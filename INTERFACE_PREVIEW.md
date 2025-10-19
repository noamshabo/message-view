# 🖼️ Interface Preview

## Application Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  📱 Conversations Viewer                      [Refresh Button]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┬──────────────────────────────────────────┐│
│  │  Conversations   │         Chat View                         ││
│  │  (320px)         │                                           ││
│  ├──────────────────┤                                           ││
│  │  [Search Box]    │  ┌─────────────────────────────────────┐ ││
│  ├──────────────────┤  │  John Doe                            │ ││
│  │                  │  │  +1234567890 • +0987654321           │ ││
│  │ 📧 John Doe      │  └─────────────────────────────────────┘ ││
│  │ +1234567890      │                                           ││
│  │ Hello!           │                                           ││
│  │ 2h ago • 5 msgs  │    ┌─────────────────────┐               ││
│  ├──────────────────┤    │ Hello!              │               ││
│  │                  │    │ 2025-10-19 10:30   │               ││
│  │ 📧 Jane Smith    │    └─────────────────────┘               ││
│  │ +1987654321      │                                           ││
│  │ Thanks!          │                   ┌─────────────────────┐││
│  │ 3h ago • 3 msgs  │                   │ Hi there!           │││
│  ├──────────────────┤                   │ 2025-10-19 10:31   │││
│  │                  │                   └─────────────────────┘││
│  │ 📧 Bob Wilson    │                                           ││
│  │ +1555123456      │    ┌─────────────────────┐               ││
│  │ See you soon     │    │ How are you?        │               ││
│  │ 1d ago • 12 msgs │    │ 2025-10-19 10:32   │               ││
│  │                  │    └─────────────────────┘               ││
│  │ ...              │                                           ││
│  │                  │                   ┌─────────────────────┐││
│  │                  │                   │ Great, thanks!      │││
│  │                  │                   │ 2025-10-19 10:33   │││
│  │                  │                   └─────────────────────┘││
│  │                  │                                           ││
│  └──────────────────┴───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Header Bar
```
┌─────────────────────────────────────────────────────┐
│  📱 Conversations Viewer            [Refresh]       │
└─────────────────────────────────────────────────────┘
```
- App title on the left
- Refresh button on the right
- White background with bottom border
- Shadow for depth

### 2. Conversations Sidebar
```
┌──────────────────┐
│  [🔍 Search...]  │
├──────────────────┤
│  📧 John Doe     │ ← Selected (highlighted)
│  +1234567890     │
│  Hello!          │
│  2h ago • 5 msgs │
├──────────────────┤
│  📧 Jane Smith   │ ← Hover effect
│  +1987654321     │
│  Thanks!         │
│  3h ago • 3 msgs │
├──────────────────┤
│  📧 Bob Wilson   │
│  +1555123456     │
│  See you soon    │
│  1d ago • 12 msgs│
└──────────────────┘
```
- Fixed 320px width
- Scrollable list
- Search box at top
- Each item shows:
  - Customer name (or phone)
  - Phone number(s)
  - Last message preview
  - Relative time + message count

### 3. Chat View
```
┌─────────────────────────────────────────────────┐
│  John Doe                                       │
│  +1234567890 • +0987654321                     │
│  Meeting Date: 2025-10-20                      │
│  Start Time: 14:00                             │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────────────┐     ← Incoming (left)│
│   │ Hello!              │                       │
│   │ 2025-10-19 10:30   │                       │
│   └─────────────────────┘                       │
│                                                 │
│                  ┌─────────────────────┐        │
│                  │ Hi there!           │  ← Out │
│                  │ 2025-10-19 10:31   │        │
│                  └─────────────────────┘        │
│                                                 │
│   ┌─────────────────────┐                       │
│   │ How are you?        │                       │
│   │ 2025-10-19 10:32   │                       │
│   └─────────────────────┘                       │
│                                                 │
│                  ┌─────────────────────┐        │
│                  │ Great, thanks!      │        │
│                  │ 2025-10-19 10:33   │        │
│                  └─────────────────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
```
- Conversation header with details
- Scrollable message area
- Incoming: left-aligned, gray bubble
- Outgoing: right-aligned, blue bubble
- Timestamps on each message

### 4. Empty States

**No Conversation Selected:**
```
┌─────────────────────────────────────────┐
│                                         │
│              💬                         │
│       (chat bubble icon)                │
│                                         │
│   Select a conversation to view         │
│         messages                        │
│                                         │
└─────────────────────────────────────────┘
```

**No Messages in Conversation:**
```
┌─────────────────────────────────────────┐
│                                         │
│         No messages                     │
│                                         │
└─────────────────────────────────────────┘
```

**Loading:**
```
┌─────────────────────────────────────────┐
│                                         │
│              ⟳                          │
│       (spinning loader)                 │
│                                         │
│      Loading messages...                │
│                                         │
└─────────────────────────────────────────┘
```

### 5. Error Banner
```
┌─────────────────────────────────────────────────┐
│  ⚠️  Error: Failed to fetch messages  [Retry]  │
└─────────────────────────────────────────────────┘
```
- Red background
- Error icon and message
- Retry button

## Color Scheme

### Background Colors
- `bg-white` - Main areas, cards
- `bg-gray-50` - Subtle backgrounds, headers
- `bg-gray-100` - Selected items
- `bg-gray-200` - Incoming message bubbles
- `bg-blue-500` - Outgoing message bubbles, primary actions
- `bg-red-50` - Error banners

### Text Colors
- `text-gray-900` - Primary text (headings, names)
- `text-gray-600` - Secondary text (phone numbers, content)
- `text-gray-500` - Tertiary text (timestamps, metadata)
- `text-gray-400` - Low-emphasis text (message counts)
- `text-white` - Text on colored backgrounds
- `text-red-800` - Error messages

### Borders & Shadows
- `border-gray-200` - Standard borders
- `border-gray-100` - Subtle borders between items
- `shadow-sm` - Subtle shadows (buttons, cards)
- `shadow-md` - Elevated elements

## Interaction States

### Hover Effects
```
Normal:     ┌──────────────┐
            │  Item        │
            └──────────────┘

Hover:      ┌──────────────┐
            │  Item        │  ← bg-gray-50
            └──────────────┘

Selected:   ┌──────────────┐
            │  Item        │  ← bg-gray-100
            └──────────────┘
```

### Button States
```
Normal:     [Refresh]         Blue background
Hover:      [Refresh]         Darker blue
Disabled:   [Refresh]         Gray background
Loading:    [Refreshing...]   Gray background
```

### Search Input
```
Normal:     [🔍 Search...]    Gray border
Focus:      [🔍 Search...]    Blue ring, no border
```

## Responsive Behavior

### Desktop (> 1024px)
- Full two-pane layout
- 320px fixed sidebar
- Remaining space for chat
- Optimal viewing experience

### Tablet (768px - 1024px)
- Sidebar remains visible
- Chat area compressed
- Scrolling still smooth
- Touch-friendly targets

### Mobile (< 768px)
- Consider stacking layout
- Full-width sidebar or chat
- Toggle between views
- Maintained functionality

## Typography

### Font Sizes
- `text-2xl` (24px) - App title
- `text-xl` (20px) - Conversation header
- `text-lg` (18px) - Empty states
- `text-base` (16px) - Message content
- `text-sm` (14px) - Phone numbers, metadata
- `text-xs` (12px) - Timestamps, counts

### Font Weights
- `font-bold` - Headings, titles
- `font-semibold` - Customer names
- `font-medium` - Labels, error messages
- `font-normal` - Body text

## Spacing

### Padding
- `p-6` (24px) - Main content areas
- `p-4` (16px) - Headers, search box
- `px-4 py-3` - List items
- `px-3 py-2` - Message bubbles

### Gaps
- `space-y-4` (16px) - Between messages
- `space-y-1` (4px) - Between metadata items

---

**Total Interface Size:** Flexible, responsive
**Minimum Width:** 768px recommended
**Optimal Width:** 1024px+
**Height:** 100vh (full viewport)

