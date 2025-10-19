# 🔍 NocoDB Setup Guide - Finding Your Credentials

If you're getting a **404 error**, it means the API endpoint can't be found. This guide will help you find the correct values.

## Step 1: Find Your NocoDB Base URL

### Option A: From Browser Address Bar
When you're logged into NocoDB, look at the URL in your browser:
```
https://app.nocodb.com/...
```

Your `NC_BASE_URL` is just the domain part:
```
NC_BASE_URL=https://app.nocodb.com
```

### Option B: If Self-Hosted
If you're running your own NocoDB instance:
```
NC_BASE_URL=https://your-nocodb-domain.com
# or
NC_BASE_URL=http://localhost:8080
```

**Important:** Do NOT include trailing slash!

---

## Step 2: Find Your Project ID (NC_PROJECT_SLUG)

### Method 1: From URL (Recommended)
1. Open your NocoDB project
2. Look at the browser URL:
   ```
   https://app.nocodb.com/nc/p01abcdef123456
                              ^^^^^^^^^^^^^^
                              This is your project ID
   ```

3. Your project ID might look like:
   - `p01abcdef123456` (new format)
   - `pxxxxxxxxxxxxx` (starts with 'p')
   - Or a custom slug like `myproject`

### Method 2: From API Documentation in NocoDB
1. In NocoDB, click on your workspace/project
2. Look for "API Documentation" or "Swagger" link
3. The URL will show your project ID

---

## Step 3: Find Your Table ID (NC_TABLE_SLUG)

### Method 1: From URL (Recommended)
1. Open your table in NocoDB
2. Look at the browser URL:
   ```
   https://app.nocodb.com/nc/p01abc.../m9zyxwvu987654
                                      ^^^^^^^^^^^^^^
                                      This is your table ID
   ```

3. Your table ID might look like:
   - `m9zyxwvu987654` (starts with 'm')
   - Or a custom slug like `messages`

### Method 2: From Table Settings
1. Right-click on your table name
2. Select "Table Settings" or "Edit Table"
3. Look for "Table ID" or "Table Name"

---

## Step 4: Get Your API Token (NC_TOKEN)

### For NocoDB Cloud:
1. Click on your profile icon (top right)
2. Go to "Account Settings"
3. Click "API Tokens" tab
4. Click "Create New Token"
5. Give it a name (e.g., "Message Viewer")
6. Copy the token (starts with `nc_` or similar)

### For Self-Hosted NocoDB:
1. Click on your profile/avatar
2. Go to "API Tokens" or "Account Settings"
3. Generate a new token
4. Copy the entire token string

---

## Step 5: Check API Path Format

NocoDB has different API versions. The app will try these formats:

### NocoDB v2 (Latest - Try First):
```
/api/v2/tables/{PROJECT_ID}/{TABLE_ID}/records
```

### NocoDB v1 (Older versions):
```
/api/v1/db/data/{PROJECT_ID}/{TABLE_ID}
/api/v1/db/data/noco/{PROJECT_ID}/{TABLE_ID}
```

---

## Example Configuration

Here's a complete example:

```env
# For NocoDB Cloud
NC_BASE_URL=https://app.nocodb.com
NC_PROJECT_SLUG=p01abcdef123456
NC_TABLE_SLUG=m9zyxwvu987654
NC_TOKEN=nc_1234567890abcdefghijklmnopqrstuvwxyz

# For Self-Hosted
NC_BASE_URL=http://localhost:8080
NC_PROJECT_SLUG=my_project
NC_TABLE_SLUG=messages
NC_TOKEN=your_generated_token_here
```

---

## Testing Your Configuration

### Step 1: Check the Console Logs

After updating `.env.local`, restart your dev server:
```bash
pnpm dev
# or
npm run dev
```

Then refresh the app and check the terminal/console. You should see:
```
=== NocoDB API Debug Info ===
NC_BASE_URL: https://app.nocodb.com
NC_PROJECT_SLUG: p01abcdef123456
NC_TABLE_SLUG: m9zyxwvu987654
NC_TOKEN: nc_1234567...
Trying API paths:
  1. https://app.nocodb.com/api/v2/tables/p01abcdef123456/m9zyxwvu987654/records
  2. https://app.nocodb.com/api/v1/db/data/p01abcdef123456/m9zyxwvu987654
  3. https://app.nocodb.com/api/v1/db/data/noco/p01abcdef123456/m9zyxwvu987654
📡 Fetching from: ...
```

### Step 2: Test URL Manually (Optional)

You can test the URL directly in your browser or with curl:

```bash
curl -X GET "https://app.nocodb.com/api/v2/tables/YOUR_PROJECT/YOUR_TABLE/records?limit=10" \
  -H "xc-token: YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

Replace `YOUR_PROJECT`, `YOUR_TABLE`, and `YOUR_TOKEN` with your actual values.

If you get:
- ✅ **200 + JSON data** → Configuration is correct!
- ❌ **401** → Token is wrong
- ❌ **404** → Project/Table ID is wrong, or API path is wrong
- ❌ **403** → Token doesn't have permission

---

## Common Issues & Solutions

### Issue: "NC_TOKEN: MISSING"
**Solution:** Your `.env.local` file is not in the right location or not loaded.
- Make sure `.env.local` is in the project ROOT directory (same level as `package.json`)
- Restart your dev server after creating/editing `.env.local`

### Issue: URL shows "undefined"
**Solution:** Environment variables are not being read.
- Check `.env.local` syntax (no quotes needed unless value has spaces)
- Restart dev server completely (Ctrl+C then `pnpm dev` again)

### Issue: 404 on all paths
**Solution:** Try these:
1. Check if your NocoDB version is old or new
2. Go to NocoDB API docs (in your NocoDB interface)
3. Look at example URLs to see the correct path format
4. Share the working URL format with me

### Issue: 401 Unauthorized
**Solution:** Token is incorrect or expired
- Generate a new API token in NocoDB
- Make sure you copied the entire token
- Check token has read permissions for your table

---

## Need More Help?

**Run the app with debugging enabled**, then share the console output with me. Look for:

```
=== NocoDB API Debug Info ===
```

Copy everything from this section and share it (you can redact part of the token for security).

The debug output will show:
1. ✅ What environment variables are loaded
2. ✅ What URLs are being tried
3. ✅ What the exact error response is

This will help me identify the exact issue!

---

## Alternative: Find Table ID from NocoDB API Docs

1. In NocoDB, open your project
2. Click the three dots (⋯) or menu icon
3. Look for "API Documentation" or "API Snippet"
4. This will show you the exact API endpoints with correct IDs
5. Copy the project and table IDs from there

Example API doc URL:
```
https://app.nocodb.com/api/v1/db/meta/projects/{PROJECT_ID}/swagger
```

