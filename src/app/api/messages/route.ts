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

    console.log("=== NocoDB API Debug Info ===");
    console.log("NC_BASE_URL:", NC_BASE_URL);
    console.log("NC_BASE_ID:", NC_BASE_ID);
    console.log("NC_TABLE_ID:", NC_TABLE_ID);
    console.log("NC_TOKEN:", NC_TOKEN ? `${NC_TOKEN.substring(0, 10)}...` : "MISSING");

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
    const limit = searchParams.get("limit") || "500";
    const offset = searchParams.get("offset") || "0";
    const conversationId = searchParams.get("conversationId");
    const whereParam = searchParams.get("where");

    // Build NocoDB API URL - Correct format for NocoDB Cloud
    const baseUrl = NC_BASE_URL.replace(/\/$/, ""); // Remove trailing slash
    
    // NocoDB v2 API: /api/v2/tables/{tableId}/records
    // This is the correct format for NocoDB cloud (app.nocodb.com)
    const apiUrl = new URL(`/api/v2/tables/${NC_TABLE_ID}/records`, baseUrl);

    // Add query parameters
    apiUrl.searchParams.set("limit", limit);
    apiUrl.searchParams.set("offset", offset);
    
    // NocoDB v2 uses fields for sorting
    apiUrl.searchParams.set("sort", "-CreatedAt"); // Sort by CreatedAt desc

    if (whereParam) {
      apiUrl.searchParams.set("where", whereParam);
    }

    console.log("📡 Fetching from:", apiUrl.toString());

    // Fetch from NocoDB
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "xc-token": NC_TOKEN,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()));

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
    console.log("✅ Response data structure:", {
      isArray: Array.isArray(data),
      hasList: !!data.list,
      keys: Object.keys(data),
      recordCount: Array.isArray(data) ? data.length : (data.list ? data.list.length : 0)
    });

    // Handle both { list: [...] } and direct array responses
    let records: NocoDBRecord[] = [];
    if (Array.isArray(data)) {
      records = data;
      console.log("✅ Data is direct array");
    } else if (data.list && Array.isArray(data.list)) {
      records = data.list;
      console.log("✅ Data has 'list' property");
    } else if (data.records && Array.isArray(data.records)) {
      records = data.records;
      console.log("✅ Data has 'records' property");
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

    console.log(`✅ Found ${records.length} records`);
    if (records.length > 0) {
      console.log("First record sample (raw from NocoDB):", JSON.stringify(records[0], null, 2));
    }

    // Compute conversation_id for each message
    let messagesWithConvId: MessageWithConversationId[] = records.map((record, index) => {
      const convId = computeConversationId(record.customer_phone, record.from_phone);
      if (index < 3) {
        console.log(`🔗 Record ${index} conversation_id:`, {
          customer_phone: record.customer_phone,
          from_phone: record.from_phone,
          computed_conversation_id: convId
        });
      }
      return {
        ...record,
        conversation_id: convId,
      };
    });
    
    // Show unique conversation IDs
    const uniqueConvIds = Array.from(new Set(messagesWithConvId.map(m => m.conversation_id)));
    console.log("📋 Unique conversation IDs:", uniqueConvIds);

    // Filter by conversationId if provided
    if (conversationId) {
      messagesWithConvId = messagesWithConvId.filter(
        (msg) => msg.conversation_id === conversationId
      );
      console.log(`✅ Filtered to ${messagesWithConvId.length} messages for conversation ${conversationId}`);
    }

    console.log(`✅ Returning ${messagesWithConvId.length} messages`);
    return NextResponse.json(messagesWithConvId);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

