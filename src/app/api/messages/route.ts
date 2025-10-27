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
    const conversationId = searchParams.get("conversationId");
    const whereParam = searchParams.get("where");
    
    // Simple pagination: weeksBack=0 means records 0-499, weeksBack=1 means 500-999, etc.
    const weeksBackParam = searchParams.get("weeksBack") || "0";
    const weeksBack = parseInt(weeksBackParam);

    // Build NocoDB API URL - Correct format for NocoDB Cloud
    const baseUrl = NC_BASE_URL.replace(/\/$/, ""); // Remove trailing slash
    
    // Calculate base offset for this page
    const RECORDS_PER_PAGE = 500;
    const baseOffset = weeksBack * RECORDS_PER_PAGE;
    
    // NocoDB limit per request
    const NOCODB_BATCH_SIZE = 100;
    const BATCHES_PER_PAGE = 5; // 5 batches × 100 = 500 records
    
    let allRecords: NocoDBRecord[] = [];
    
    // Fetch 5 batches of 100 records each
    for (let i = 0; i < BATCHES_PER_PAGE; i++) {
      // Add delay between requests to avoid rate limiting (except for first request)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
      }
      
      const currentOffset = baseOffset + (i * NOCODB_BATCH_SIZE);
      
      // NocoDB v2 API: /api/v2/tables/{tableId}/records
      const apiUrl = new URL(`/api/v2/tables/${NC_TABLE_ID}/records`, baseUrl);
      
      apiUrl.searchParams.set("limit", NOCODB_BATCH_SIZE.toString());
      apiUrl.searchParams.set("offset", currentOffset.toString());
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
              message: response.status === 429 
                ? "Rate limit exceeded. Too many requests to NocoDB."
                : "The API endpoint returned an error. Please check:",
              steps: response.status === 429
                ? [
                    "1. NocoDB has rate limits on free/cloud plans",
                    "2. Wait a few seconds and try again",
                    "3. Consider upgrading your NocoDB plan for higher limits"
                  ]
                : [
                    "1. Verify NC_BASE_URL is correct (e.g., https://app.nocodb.com)",
                    "2. Verify NC_TABLE_ID is the correct table ID (not table name)",
                    "3. Verify your API token has read permissions for this table"
                  ]
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
      
      // Add batch records to all records
      allRecords = allRecords.concat(batchRecords);
      
      // If we got fewer records than requested, we've reached the end
      if (batchRecords.length < NOCODB_BATCH_SIZE) {
        break; // Stop fetching more batches
      }
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

    // Filter by conversationId if provided (for specific conversation view)
    if (conversationId) {
      messagesWithConvId = messagesWithConvId.filter(
        (msg) => msg.conversation_id === conversationId
      );
    }
    
    // Return data with simple pagination metadata
    return NextResponse.json({
      data: messagesWithConvId,
      hasMore: conversationId ? false : (records.length >= RECORDS_PER_PAGE), // If we got 500 records, there might be more
      nextWeeksBack: weeksBack + 1, // Next page
      currentWeek: weeksBack,
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

