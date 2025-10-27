import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

interface NocoDBRecord {
  Id?: string | number;
  CreatedAt: string;
  UpdatedAt?: string;
  message_type: "in" | "out" | "incoming";
  from_phone: string;
  customer_phone: string;
  customer_name?: string;
  content: string;
  date_of_meeting?: string | null;
  customer_start_hour?: string | null;
  route?: string;
}

interface MessageWithConversationId extends NocoDBRecord {
  conversation_id: string;
}

// Compute stable conversation ID from two phone numbers
function computeConversationId(customerPhone: string, fromPhone: string): string {
  const phones = [customerPhone || "", fromPhone || ""];
  return phones.sort().join(":");
}

export async function GET(request: NextRequest) {
  try {
    // Read env variables (server-side only)
    const NC_BASE_URL = process.env.NC_BASE_URL;
    const NC_BASE_ID = process.env.NC_BASE_ID; // NocoDB Base/Workspace ID
    const NC_TABLE_ID = process.env.NC_TABLE_ID; // NocoDB Table ID
    const NC_TOKEN = process.env.NC_TOKEN;

    if (!NC_BASE_URL || !NC_BASE_ID || !NC_TABLE_ID || !NC_TOKEN) {
      console.error("❌ Missing environment variables!");
      return NextResponse.json(
        { 
          error: "Missing NocoDB configuration. Please check .env.local",
          required: ["NC_BASE_URL", "NC_BASE_ID", "NC_TABLE_ID", "NC_TOKEN"]
        },
        { status: 500 }
      );
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const requestedLimit = searchParams.get("limit") || "1000"; // High limit to get full week
    const conversationId = searchParams.get("conversationId");
    const whereParam = searchParams.get("where");
    
    // Week-based pagination: weeksBack=0 means current week, weeksBack=1 means last week, etc.
    const weeksBackParam = searchParams.get("weeksBack") || "0";
    const weeksBack = parseInt(weeksBackParam);

    // Build NocoDB API URL - Correct format for NocoDB Cloud
    const baseUrl = NC_BASE_URL.replace(/\/$/, ""); // Remove trailing slash
    
    // Calculate date range for the requested week (for client-side filtering)
    // Week 0 = current week (last 7 days from now)
    // Week 1 = week before that (8-14 days ago)
    // Week 2 = week before that (15-21 days ago), etc.
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() - (weeksBack * 7));
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);
    
    // NocoDB returns 100 records per request by default
    // We'll fetch multiple batches to get the full week
    const NOCODB_PAGE_SIZE = 100;
    const desiredRecords = parseInt(requestedLimit);
    const batches = Math.ceil(desiredRecords / NOCODB_PAGE_SIZE);
    
    let allRecords: NocoDBRecord[] = [];
    let currentOffset = 0;
    let hasMoreData = true;

    // Fetch records in batches
    for (let i = 0; i < batches && hasMoreData; i++) {
      // NocoDB v2 API: /api/v2/tables/{tableId}/records
      const apiUrl = new URL(`/api/v2/tables/${NC_TABLE_ID}/records`, baseUrl);

      // Add query parameters - NocoDB uses its own pagination
      apiUrl.searchParams.set("limit", NOCODB_PAGE_SIZE.toString());
      apiUrl.searchParams.set("offset", currentOffset.toString());
      
      // NocoDB v2 uses fields for sorting
      apiUrl.searchParams.set("sort", "-CreatedAt"); // Sort by CreatedAt desc

      // Add custom where clause if provided
      if (whereParam) {
        apiUrl.searchParams.set("where", whereParam);
      }

      // Fetch from NocoDB
      const response = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "xc-token": NC_TOKEN,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ NocoDB API error:", response.status);
        console.error("❌ Error response:", errorText);
        console.error("❌ URL that failed:", apiUrl.toString());
        
        return NextResponse.json(
          { 
            error: `NocoDB API error: ${response.status}`,
            details: errorText,
            url: apiUrl.toString(),
            troubleshooting: {
              message: "The API endpoint returned an error. Please check:",
              steps: [
                "1. Verify NC_BASE_URL is correct (e.g., https://app.nocodb.com)",
                "2. Verify NC_TABLE_ID is the correct table ID (not table name)",
                "3. Get table ID from: Right-click table → Copy ID, or from browser URL",
                "4. Verify your API token has read permissions for this table",
                "5. Check that the table actually exists in your NocoDB workspace"
              ],
              hint: "For NocoDB cloud, you need the TABLE ID (like 'm123abc'), not the table name"
            }
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      // Handle both { list: [...] } and direct array responses
      let batchRecords: NocoDBRecord[] = [];
      if (Array.isArray(data)) {
        batchRecords = data;
      } else if (data.list && Array.isArray(data.list)) {
        batchRecords = data.list;
      } else if (data.records && Array.isArray(data.records)) {
        batchRecords = data.records;
      } else {
        console.error("❌ Unexpected NocoDB response format:", JSON.stringify(data, null, 2));
        return NextResponse.json(
          { 
            error: "Unexpected response format from NocoDB",
            receivedKeys: Object.keys(data),
            sample: data
          },
          { status: 500 }
        );
      }
      
      // Add to accumulated records
      allRecords = allRecords.concat(batchRecords);
      
      // Check if we got fewer records than expected (reached the end)
      if (batchRecords.length < NOCODB_PAGE_SIZE) {
        hasMoreData = false;
      }
      
      // Move to next offset
      currentOffset += batchRecords.length;
    }

    const records = allRecords;

    // Compute conversation_id for each message
    let messagesWithConvId: MessageWithConversationId[] = records.map((record) => {
      const convId = computeConversationId(record.customer_phone, record.from_phone);
      return {
        ...record,
        conversation_id: convId,
      };
    });

    // Filter by date range (client-side) if NOT requesting a specific conversation
    if (!conversationId) {
      messagesWithConvId = messagesWithConvId.filter((msg) => {
        const msgDate = new Date(msg.CreatedAt);
        return msgDate >= startDate && msgDate <= endDate;
      });
    }

    // Filter by conversationId if provided
    if (conversationId) {
      messagesWithConvId = messagesWithConvId.filter(
        (msg) => msg.conversation_id === conversationId
      );
    }
    
    // Return data with metadata for week-based pagination
    return NextResponse.json({
      data: messagesWithConvId,
      hasMore: conversationId ? false : (messagesWithConvId.length > 0), // No pagination for specific conversation
      nextWeeksBack: weeksBack + 1, // Next request should fetch the previous week
      currentWeek: weeksBack,
      dateRange: conversationId ? null : {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      count: messagesWithConvId.length,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

