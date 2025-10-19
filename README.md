# Conversations Viewer

A production-ready React TypeScript application for viewing conversations and messages from NocoDB.

## Features

- 📱 **Two-Pane Layout**: Conversations list on the left, chat view on the right
- 🔒 **Secure**: NocoDB API token is never exposed to the client (server-side proxy)
- 🎨 **Modern UI**: Clean, responsive design with TailwindCSS
- 🔍 **Search**: Filter conversations by name or phone number
- ⚡ **Real-time Updates**: Refresh button to fetch latest messages
- 💬 **Message Types**: Visual distinction between incoming (customer) and outgoing (business) messages
- 📊 **Conversation Grouping**: Messages automatically grouped by phone numbers

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **NocoDB** as the data source

## Setup

### 1. Install Dependencies

```bash
npm install
# or with pnpm (faster)
pnpm install
# or with yarn
yarn install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with your NocoDB credentials:

```env
# For NocoDB Cloud (app.nocodb.com)
NC_BASE_URL=https://app.nocodb.com
NC_BASE_ID=YOUR_BASE_ID
NC_TABLE_ID=YOUR_TABLE_ID
NC_TOKEN=YOUR_XC_TOKEN
```

**Important**: 
- These environment variables are only accessible on the server and are never exposed to the browser.
- Use `NC_TABLE_ID` (the actual table ID like "m123abc"), NOT the table name
- See **NOCODB_CLOUD_SETUP.md** for detailed instructions on finding these values

### 3. Data Model

Your NocoDB table should have the following columns:

| Column Name | Type | Description |
|------------|------|-------------|
| `Id` | string/number | Unique identifier |
| `CreatedAt` | datetime | Message creation timestamp |
| `UpdatedAt` | datetime | Last update timestamp (optional) |
| `message_type` | string | Either "in" (customer) or "out" (business) |
| `from_phone` | string | Business phone number |
| `customer_phone` | string | Customer phone number |
| `customer_name` | string | Customer display name (optional) |
| `content` | string | Message content |
| `date_of_meeting` | date | Meeting date (optional) |
| `customer_start_hour` | time | Meeting start time (optional) |
| `route` | string | Message route (optional) |

### 4. Run Development Server

```bash
npm run dev
# or with pnpm
pnpm dev
# or with yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
message-view/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── messages/
│   │   │       └── route.ts       # Server-side API proxy
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main page
│   ├── components/
│   │   ├── Chat.tsx               # Chat view component
│   │   └── ConversationsList.tsx # Conversations list component
│   └── types.ts                   # TypeScript types
├── .env.local                     # Environment variables (create this)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## How It Works

### Conversation ID

Conversations are grouped by computing a stable `conversation_id` from the two phone numbers:

```typescript
conversation_id = sort([customer_phone, from_phone]).join(":")
```

This ensures that all messages between the same two parties are grouped together.

### Server-Side Proxy

The `/api/messages` route acts as a secure proxy to NocoDB:
- Reads credentials from environment variables
- Fetches data from NocoDB
- Computes `conversation_id` for each message
- Returns data to the client without exposing the API token

### UI Components

**ConversationsList**
- Groups messages by `conversation_id`
- Shows preview of last message
- Displays relative timestamps (e.g., "2h ago")
- Provides search functionality
- Highlights selected conversation

**Chat**
- Displays messages in chronological order
- Incoming messages (left, gray bubble)
- Outgoing messages (right, blue bubble)
- Shows absolute timestamps for each message

## API Endpoints

### GET /api/messages

Fetch messages from NocoDB.

**Query Parameters:**
- `limit` (optional): Number of messages to fetch (default: 500)
- `offset` (optional): Pagination offset (default: 0)
- `conversationId` (optional): Filter by specific conversation
- `where` (optional): Additional NocoDB where clause (JSON string)

**Response:**
```json
[
  {
    "Id": "1",
    "CreatedAt": "2025-10-19T10:30:00Z",
    "message_type": "in",
    "from_phone": "+1234567890",
    "customer_phone": "+0987654321",
    "customer_name": "John Doe",
    "content": "Hello!",
    "conversation_id": "+0987654321:+1234567890"
  }
]
```

## Production Build

```bash
npm run build
npm start

# or with pnpm
pnpm build
pnpm start

# or with yarn
yarn build
yarn start
```

## Customization

### Changing NocoDB API Path

If your NocoDB instance uses a different API path, modify the `apiUrl` in `src/app/api/messages/route.ts`:

```typescript
const apiUrl = new URL(
  `/api/v2/tables/${NC_PROJECT_SLUG}/${NC_TABLE_SLUG}/records`,
  baseUrl
);
```

### Styling

All styles use TailwindCSS. Modify the components directly to change colors, spacing, etc.

## Troubleshooting

### "Missing NocoDB configuration" Error

Make sure your `.env.local` file exists and contains all required variables:
- `NC_BASE_URL`
- `NC_PROJECT_SLUG`
- `NC_TABLE_SLUG`
- `NC_TOKEN`

### "NocoDB API error" Error

- Verify your NocoDB credentials are correct
- Check that the table slug and project slug match your NocoDB setup
- Ensure your API token has read permissions for the table

### Messages Not Showing

- Check that your NocoDB table has data
- Verify column names match exactly (case-sensitive)
- Check browser console for errors

## License

MIT

