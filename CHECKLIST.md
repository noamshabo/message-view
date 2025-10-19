# ✅ Installation & Verification Checklist

Use this checklist to verify your installation is complete and working.

## 📦 Pre-Installation

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] NocoDB instance accessible
- [ ] NocoDB API token available

## 🔧 Installation Steps

### Step 1: Dependencies
- [ ] Run `npm install`
- [ ] No errors during installation
- [ ] `node_modules` folder created

### Step 2: Environment Configuration
- [ ] Create `.env.local` file in root directory
- [ ] Add `NC_BASE_URL` with your NocoDB URL
- [ ] Add `NC_PROJECT_SLUG` with your project ID
- [ ] Add `NC_TABLE_SLUG` with your table ID
- [ ] Add `NC_TOKEN` with your API token
- [ ] Verify no trailing slashes in `NC_BASE_URL`

### Step 3: Verify NocoDB Table Structure
- [ ] Table has `Id` column
- [ ] Table has `CreatedAt` column (datetime)
- [ ] Table has `message_type` column (text: "in" or "out")
- [ ] Table has `from_phone` column (text)
- [ ] Table has `customer_phone` column (text)
- [ ] Table has `content` column (text/long text)
- [ ] Optional: `customer_name` column (text)
- [ ] Optional: `date_of_meeting` column (date)
- [ ] Optional: `customer_start_hour` column (time)
- [ ] Table has at least some test data

### Step 4: Start Development Server
- [ ] Run `npm run dev`
- [ ] Server starts without errors
- [ ] Console shows "Ready" message
- [ ] URL shown (typically http://localhost:3000)

## 🧪 Functional Testing

### Basic Functionality
- [ ] Open http://localhost:3000 in browser
- [ ] Page loads without errors (check browser console - F12)
- [ ] Header displays "Conversations Viewer"
- [ ] Refresh button is visible
- [ ] No error banners appear (red banner at top)

### Conversations List
- [ ] Left sidebar (320px) is visible
- [ ] Search box appears at top of sidebar
- [ ] Conversations list loads and displays
- [ ] Each conversation shows:
  - [ ] Customer name or phone number
  - [ ] Last message preview
  - [ ] Relative timestamp (e.g., "2h ago")
  - [ ] Message count
- [ ] Conversations sorted by most recent
- [ ] Hover effect works on conversation items
- [ ] Search box filters conversations in real-time

### Chat View
- [ ] Click on a conversation
- [ ] Conversation becomes highlighted (gray background)
- [ ] Chat view appears on right side
- [ ] Conversation header shows:
  - [ ] Customer name or phone
  - [ ] Phone number(s)
  - [ ] Meeting date (if available)
  - [ ] Meeting time (if available)
- [ ] Messages appear in chronological order
- [ ] Incoming messages (type: "in"):
  - [ ] Aligned to left
  - [ ] Gray bubble background
  - [ ] Black text
- [ ] Outgoing messages (type: "out"):
  - [ ] Aligned to right
  - [ ] Blue bubble background
  - [ ] White text
- [ ] Each message shows absolute timestamp
- [ ] Chat area is scrollable
- [ ] Empty messages don't appear

### Deep Linking
- [ ] URL updates when conversation selected
- [ ] URL format: `/conversation/[conversation_id]`
- [ ] Copy URL and open in new tab
- [ ] Conversation loads directly
- [ ] Back button works (appears in header)
- [ ] Back button returns to home page

### Refresh Functionality
- [ ] Click Refresh button
- [ ] Button text changes to "Refreshing..."
- [ ] Button becomes disabled during refresh
- [ ] Data reloads successfully
- [ ] Button returns to "Refresh" state

### Error Handling
- [ ] Stop NocoDB or break `.env.local`
- [ ] Click Refresh
- [ ] Error banner appears (red background)
- [ ] Error message is clear
- [ ] Retry button appears
- [ ] Click Retry button
- [ ] Fix `.env.local` and retry
- [ ] Data loads successfully

## 🎨 Visual Testing

### Design Quality
- [ ] Clean, modern appearance
- [ ] Good contrast (text is readable)
- [ ] Subtle shadows on cards/buttons
- [ ] Rounded corners on bubbles/cards
- [ ] Proper spacing between elements
- [ ] No layout shifts or flickering
- [ ] Custom scrollbars appear (if using Chrome)
- [ ] Icons render properly (SVG)

### Responsive Design
- [ ] Resize browser window
- [ ] Layout remains functional at different sizes
- [ ] Text doesn't overflow
- [ ] Bubbles respect max-width (70%)
- [ ] Scrolling works at all sizes

### Interaction Feedback
- [ ] Hover states work on all buttons
- [ ] Selected conversation has visual indicator
- [ ] Focus states visible (keyboard navigation)
- [ ] Disabled states are clear
- [ ] Loading spinner appears during initial load
- [ ] Smooth transitions on state changes

## 🔍 Browser Console Check

Press F12 and check the Console tab:
- [ ] No TypeScript errors
- [ ] No 404 errors (missing resources)
- [ ] No CORS errors
- [ ] No API authentication errors
- [ ] Only expected fetch logs (if any)

## 🚀 Production Build Test

Optional but recommended:

- [ ] Run `npm run build`
- [ ] Build completes without errors
- [ ] No TypeScript compilation errors
- [ ] No ESLint errors
- [ ] Run `npm start`
- [ ] Production server starts
- [ ] Test all functionality again

## 📊 Performance Check

- [ ] Initial page load < 2 seconds
- [ ] Conversation selection feels instant
- [ ] Search is responsive (no lag)
- [ ] Scrolling is smooth
- [ ] No memory leaks (watch in DevTools)

## 🔒 Security Verification

- [ ] Open browser DevTools → Network tab
- [ ] Click around and refresh
- [ ] Check API calls to `/api/messages`
- [ ] Verify `NC_TOKEN` is NOT visible in:
  - [ ] Request headers
  - [ ] Request body
  - [ ] Response headers
  - [ ] Response body
  - [ ] Page source (View Source)
  - [ ] JavaScript files
- [ ] Token only lives in `.env.local` (server-side)

## 📝 Documentation Review

- [ ] README.md is clear and helpful
- [ ] SETUP.md has step-by-step instructions
- [ ] QUICKSTART.md gets you running fast
- [ ] PROJECT_SUMMARY.md explains architecture
- [ ] FEATURES.md lists all capabilities
- [ ] ENV_TEMPLATE.txt has all required variables

## ✅ Final Sign-Off

If all items are checked, your installation is complete! 🎉

### Common Issues & Solutions

**Issue: "Cannot find module 'next/server'"**
- Solution: Run `npm install`

**Issue: "Missing NocoDB configuration"**
- Solution: Verify `.env.local` exists and has all 4 variables

**Issue: "NocoDB API error: 401"**
- Solution: Check `NC_TOKEN` is correct

**Issue: "NocoDB API error: 404"**
- Solution: Verify `NC_PROJECT_SLUG` and `NC_TABLE_SLUG`

**Issue: No conversations showing**
- Solution: Check table has data and column names match exactly

**Issue: Port 3000 already in use**
- Solution: Stop other process or use `PORT=3001 npm run dev`

---

## 🎯 Ready for Production?

Additional checks before deploying:

- [ ] Environment variables configured in hosting platform
- [ ] Build succeeds in production environment
- [ ] API routes tested in production
- [ ] Error tracking setup (optional)
- [ ] Analytics added (optional)
- [ ] Domain configured (if applicable)
- [ ] SSL certificate active (HTTPS)
- [ ] Performance tested with real data volume

---

**Need Help?** Check the documentation files or open an issue!

