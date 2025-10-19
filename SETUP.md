# Quick Setup Guide

Follow these steps to get the Conversations Viewer running:

## 1. Install Dependencies

```bash
npm install
# or use pnpm (faster, recommended)
pnpm install
# or use yarn
yarn install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- All required dependencies

> **Using pnpm?** See [QUICKSTART_PNPM.md](QUICKSTART_PNPM.md) for pnpm-specific instructions.

## 2. Configure NocoDB Connection

Create a `.env.local` file in the root directory:

```bash
# Copy the template
touch .env.local
```

Add your NocoDB credentials:

```env
# For NocoDB Cloud
NC_BASE_URL=https://app.nocodb.com
NC_BASE_ID=YOUR_BASE_ID
NC_TABLE_ID=YOUR_TABLE_ID
NC_TOKEN=YOUR_XC_TOKEN
```

### How to Find These Values:

1. **NC_BASE_URL**: For NocoDB Cloud use `https://app.nocodb.com`
2. **NC_BASE_ID**: Your base/workspace ID (find in browser URL after `/nc/`)
3. **NC_TABLE_ID**: Your table ID - **Right-click table → Copy ID** (NOT the table name!)
4. **NC_TOKEN**: Your API token from Profile → Account Settings → API Tokens

**📖 See NOCODB_CLOUD_SETUP.md for detailed step-by-step instructions!**

## 3. Verify Your NocoDB Table Structure

Ensure your table has these columns (case-sensitive):

✅ **Required:**
- `Id` - Unique identifier
- `CreatedAt` - Datetime field
- `message_type` - Text field ("in" or "out")
- `from_phone` - Text field
- `customer_phone` - Text field
- `content` - Text/Long text field

✅ **Optional:**
- `customer_name` - Text field
- `date_of_meeting` - Date field
- `customer_start_hour` - Time field
- `route` - Text field
- `UpdatedAt` - Datetime field

## 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Test the Application

You should see:
- ✅ Conversations list on the left
- ✅ Empty state on the right (until you select a conversation)
- ✅ Refresh button in the header

If you see errors:
- Check browser console (F12)
- Verify your `.env.local` configuration
- Check NocoDB connection and permissions

## Production Deployment

When ready to deploy:

```bash
npm run build && npm start
# or
pnpm build && pnpm start
# or
yarn build && yarn start
```

Or deploy to Vercel/Netlify with environment variables configured in their dashboards.

## Need Help?

Common issues:
- **"Missing NocoDB configuration"** → Check `.env.local` file exists and has all variables
- **"NocoDB API error: 401"** → Verify your `NC_TOKEN` is correct
- **"NocoDB API error: 404"** → Check `NC_PROJECT_SLUG` and `NC_TABLE_SLUG` are correct
- **No messages showing** → Verify your table has data and column names match exactly

