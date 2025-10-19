# 🚀 Quick Start - Get Running in 3 Minutes

## Step 1: Install Dependencies (30 seconds)

```bash
npm install
```

## Step 2: Configure NocoDB (1 minute)

Create `.env.local` in the root directory:

```bash
NC_BASE_URL=https://YOUR-NOCODB.com
NC_PROJECT_SLUG=YOUR_PROJECT
NC_TABLE_SLUG=YOUR_TABLE
NC_TOKEN=YOUR_XC_TOKEN
```

**Where to find these values:**
- Log into your NocoDB instance
- Go to your project and table
- Look at the URL: `https://nocodb.com/{project}/{table}`
- Get your API token from Settings → API Tokens

## Step 3: Run the App (10 seconds)

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## Troubleshooting

### "Missing NocoDB configuration"
- Make sure `.env.local` exists in the root folder
- Check all 4 variables are set

### "Cannot find module 'next/server'"
- Run `npm install` first

### "No conversations showing"
- Check your NocoDB table has data
- Verify column names match exactly (case-sensitive)
- Check browser console (F12) for errors

### Still having issues?
See **SETUP.md** for detailed instructions

---

## What You Should See

1. **Left Sidebar**: List of conversations (grouped by phone numbers)
2. **Right Panel**: "Select a conversation to view messages"
3. **Header**: "Conversations Viewer" with Refresh button

Click any conversation to view the chat timeline!

---

## Next Steps

- Read **README.md** for full documentation
- Check **PROJECT_SUMMARY.md** for technical details
- Deploy to Vercel with environment variables configured

