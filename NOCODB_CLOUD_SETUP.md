# 🌐 NocoDB Cloud Setup Guide (UPDATED)

This guide is specifically for **NocoDB Cloud** (app.nocodb.com). If you're using a self-hosted instance, the same steps apply.

## 📋 What You Need

You need 4 pieces of information for `.env.local`:

1. **NC_BASE_URL** - The NocoDB URL
2. **NC_BASE_ID** - Your workspace/base ID  
3. **NC_TABLE_ID** - Your table ID (NOT the table name!)
4. **NC_TOKEN** - Your API authentication token

---

## Step 1: NC_BASE_URL

For NocoDB Cloud, this is simply:
```env
NC_BASE_URL=https://app.nocodb.com
```

For self-hosted:
```env
NC_BASE_URL=https://your-nocodb-domain.com
```

**Important:** No trailing slash!

---

## Step 2: NC_BASE_ID (Workspace/Base ID)

### Method 1: From Browser URL (Easiest)

1. Open your NocoDB workspace
2. Look at the browser address bar:
   ```
   https://app.nocodb.com/nc/p1a2b3c4d5
                              ^^^^^^^^^^
                              This is your Base ID
   ```

3. Copy the part after `/nc/` - that's your `NC_BASE_ID`

Example:
```env
NC_BASE_ID=p1a2b3c4d5
```

### Method 2: From Base Settings

1. Click the base name dropdown (top left)
2. Select "Base Settings" or click the gear icon
3. Look for "Base ID" - copy it

---

## Step 3: NC_TABLE_ID (Most Important!)

**⚠️ IMPORTANT:** You need the **Table ID**, NOT the table name!

### Method 1: Copy ID Directly (Easiest)

1. In NocoDB, right-click on your table name in the left sidebar
2. Select "Copy ID" from the context menu
3. Paste it in your `.env.local`

Example:
```env
NC_TABLE_ID=m7x8y9z0a1
```

### Method 2: From Browser URL

1. Open your table in NocoDB
2. Look at the browser address bar:
   ```
   https://app.nocodb.com/nc/p1a2b3c4d5/m7x8y9z0a1
                                       ^^^^^^^^^^
                                       This is your Table ID
   ```

3. The Table ID usually starts with `m` followed by alphanumeric characters

### Method 3: From API Documentation

1. In NocoDB, click your profile icon
2. Go to "API Docs" or "Swagger Documentation"
3. Find your table in the list
4. The table ID will be shown in the endpoint URLs

---

## Step 4: NC_TOKEN (API Token)

### Get Your Token:

1. Click your profile icon (top right in NocoDB)
2. Select "Account Settings"
3. Go to "API Tokens" tab
4. Click "Create Token" or "Add New Token"
5. Give it a name (e.g., "Message Viewer")
6. Select appropriate permissions (Read access to your base)
7. Click Create
8. **Copy the token immediately** (you won't see it again!)

Example:
```env
NC_TOKEN=nc_1234567890abcdefghijklmnopqrstuvwxyz
```

---

## Complete .env.local Example

Create `.env.local` in your project root with these values:

```env
# NocoDB Cloud Configuration
NC_BASE_URL=https://app.nocodb.com
NC_BASE_ID=p1a2b3c4d5
NC_TABLE_ID=m7x8y9z0a1
NC_TOKEN=nc_1234567890abcdefghijklmnopqrstuvwxyz
```

---

## Testing Your Setup

### Step 1: Restart Dev Server

After creating/updating `.env.local`:
```bash
# Stop the server (Ctrl+C if running)
pnpm dev
```

### Step 2: Check Console Output

You should see:
```
=== NocoDB API Debug Info ===
NC_BASE_URL: https://app.nocodb.com
NC_BASE_ID: p1a2b3c4d5
NC_TABLE_ID: m7x8y9z0a1
NC_TOKEN: nc_1234567...
📡 Fetching from: https://app.nocodb.com/api/v2/tables/m7x8y9z0a1/records?...
📥 Response status: 200
✅ Found XX records
```

### Step 3: Check the App

Open http://localhost:3000 and you should see your conversations!

---

## 🔍 Troubleshooting

### Error: "Missing NocoDB configuration"
- **Cause:** `.env.local` file is missing or not in the correct location
- **Fix:** Ensure `.env.local` is in the project root (same folder as `package.json`)
- **Fix:** Restart the dev server after creating the file

### Error: "404 Not Found"
- **Cause:** Table ID is incorrect or table doesn't exist
- **Fix:** Double-check your `NC_TABLE_ID` - it should be the ID (like `m7x8y9z0a1`), NOT the table name
- **Fix:** Right-click the table in NocoDB and select "Copy ID"

### Error: "401 Unauthorized"
- **Cause:** API token is invalid or expired
- **Fix:** Generate a new API token in NocoDB
- **Fix:** Make sure you copied the entire token string
- **Fix:** Verify the token has read permissions for your base

### Error: "403 Forbidden"
- **Cause:** Token doesn't have permission to access this table
- **Fix:** Check token permissions in NocoDB settings
- **Fix:** Create a new token with appropriate permissions

### Still Not Working?

If you're still having issues, check the console output and share:
1. The debug output (with token masked)
2. The exact error message
3. Your NocoDB URL structure

---

## Visual Guide

Here's what to look for:

```
Browser URL when viewing your table:
https://app.nocodb.com/nc/[BASE_ID]/[TABLE_ID]
                          ^^^^^^^^^^^  ^^^^^^^^^^
                          Use this     Use this
                          for          for
                          NC_BASE_ID   NC_TABLE_ID
```

---

## Quick Reference Card

Copy this and fill in your values:

```
┌─────────────────────────────────────────────┐
│ NocoDB Cloud Configuration                  │
├─────────────────────────────────────────────┤
│                                             │
│ NC_BASE_URL:  https://app.nocodb.com       │
│                                             │
│ NC_BASE_ID:   p_____________ (from URL)    │
│                                             │
│ NC_TABLE_ID:  m_____________ (Copy ID)     │
│                                             │
│ NC_TOKEN:     nc_________________________  │
│               (from Account Settings)       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Need More Help?

Run the app and check the terminal output. The debug logs will show exactly what's being attempted and help identify the issue!

