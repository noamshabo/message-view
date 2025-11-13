# 📅 יומן שבועי - Weekly Calendar

יומן שבועי מודרני ומרשים עם אינטגרציה ל-Outlook Calendar, תמיכה מלאה ב-RTL ועברית.

## ✨ תכונות

### 🎨 עיצוב מודרני
- ✅ פונט עברי **Heebo** קריא ויפה
- ✅ פלטת צבעים מודרנית (2024-2025)
- ✅ Glassmorphism effects
- ✅ אנימציות חלקות ומלוטשות
- ✅ Responsive design מלא
- ✅ Shadows ו-borders מעוצבים

### 📋 ניהול אירועים
- ✅ הצגת אירועים בתצוגת שבוע
- ✅ יצירת אירועים חדשים
- ✅ עריכת אירועים קיימים
- ✅ מחיקת אירועים
- ✅ הצגת פרטי אירוע (מיקום, משתתפים, תיאור)

### 🔄 Drag & Drop
- ✅ גרירת אירועים בין שעות שונות
- ✅ שינוי משך אירוע (resize)
- ✅ עדכון אוטומטי ב-Outlook
- ✅ אנימציות חלקות בגרירה

### ⏰ תכונות זמן
- ✅ סמן זמן נוכחי (קו אדום עם אנימציית pulse)
- ✅ עדכון אוטומטי כל דקה
- ✅ הדגשת היום הנוכחי

### 🌍 RTL מלא
- ✅ תמיכה מלאה בעברית
- ✅ CSS Logical Properties
- ✅ כיוון מימין לשמאל
- ✅ פונטים מותאמים

### 🔗 אינטגרציה Outlook
- ✅ חיבור ל-Microsoft Graph API
- ✅ סנכרון דו-כיווני עם Outlook Calendar
- ✅ Dummy data למצב פיתוח
- ✅ Placeholders לחיבור אמיתי

### 📱 ניווט
- ✅ מעבר בין שבועות (הבא/הקודם)
- ✅ כפתור "היום" לקפיצה מהירה
- ✅ הצגת טווח תאריכים בכותרת
- ✅ כפתור "אירוע חדש"
- ✅ כפתור סנכרון

### 🎉 UX מתקדם
- ✅ Toast notifications (הודעות הצלחה/שגיאה)
- ✅ דיאלוג אישור למחיקה
- ✅ Loading states (spinners, skeleton loaders)
- ✅ Error handling מקיף

## 🗂️ מבנה הפרויקט

```
src/
├── app/
│   ├── calendar/
│   │   └── page.tsx                    # דף היומן הראשי
│   └── api/
│       └── calendar/
│           ├── events/route.ts         # CRUD לאירועים
│           └── sync/route.ts           # סנכרון Outlook
│
├── components/calendar/
│   ├── CalendarView/                   # קומפוננטה ראשית
│   ├── EventModal/                     # מודל עריכה/יצירה
│   ├── EventCard/                      # כרטיס אירוע
│   ├── TimeIndicator/                  # סמן זמן נוכחי
│   ├── Toolbar/                        # סרגל כלים עליון
│   └── common/                         # קומפוננטות משותפות
│
├── hooks/
│   ├── useCalendar.ts                  # ניהול יומן
│   ├── useEvents.ts                    # CRUD אירועים
│   └── useTimeIndicator.ts             # סמן זמן
│
├── lib/
│   ├── calendar/
│   │   ├── outlookClient.ts            # חיבור Outlook
│   │   ├── eventStorage.ts             # אחסון מקומי
│   │   └── calendarSync.ts             # לוגיקת סנכרון
│   └── utils/
│       ├── dateUtils.ts                # פונקציות תאריכים
│       ├── colorUtils.ts               # פונקציות צבעים
│       └── rtlUtils.ts                 # פונקציות RTL
│
├── types/
│   ├── event.types.ts                  # טיפוסי אירוע
│   ├── calendar.types.ts               # טיפוסי יומן
│   └── outlook.types.ts                # טיפוסי Outlook
│
├── constants/
│   ├── colors.ts                       # פלטת צבעים
│   ├── calendarConstants.ts            # קבועים ליומן
│   └── config.ts                       # הגדרות
│
└── styles/
    ├── calendar.css                    # עיצוב כללי
    ├── rtl.css                         # RTL גלובלי
    └── animations.css                  # אנימציות
```

## 🚀 התחלה מהירה

### 1. התקנת התלויות

```bash
pnpm install
```

### 2. הרצת הפרויקט

```bash
pnpm dev
```

### 3. גישה ליומן

נווט ל-`http://localhost:3000/calendar`

## 🔧 חיבור ל-Outlook

כרגע היומן עובד עם **Dummy Data** לפיתוח.

לחיבור אמיתי ל-Outlook Calendar:

1. קרא את [`AZURE_SETUP_GUIDE.md`](AZURE_SETUP_GUIDE.md)
2. הקם Azure App Registration
3. קבל Client ID ו-Client Secret
4. עדכן את `.env.local`
5. הסר הערות מהקוד ב-`outlookClient.ts`

## 🎨 פלטת צבעים

```typescript
const COLORS = {
  indigo: '#6366F1',   // תכלת
  emerald: '#10B981',  // ירוק
  amber: '#F59E0B',    // כתום
  pink: '#EC4899',     // ורוד
  purple: '#8B5CF6',   // סגול
  red: '#EF4444',      // אדום
};
```

## 📦 ספריות משמעותיות

- **React Big Calendar** - ספריית יומן מקצועית
- **date-fns** - ניהול תאריכים בעברית
- **@microsoft/microsoft-graph-client** - חיבור ל-Outlook API
- **Moment.js** - לוקאליזציה של React Big Calendar

## 🔥 תכונות מתקדמות

### Drag & Drop

```typescript
// הגרירה מופעלת אוטומטית
// האירוע מתעדכן ב-Outlook בזמן אמת
```

### Time Indicator

```typescript
// מתעדכן כל דקה
// אנימציית pulse
// מציג את השעה הנוכחית
```

### Toast Notifications

```typescript
setToast({ 
  message: 'האירוע נשמר בהצלחה', 
  type: 'success' 
});
```

## 🛠️ פיתוח והרחבה

### הוספת צבע חדש

```typescript
// constants/colors.ts
export const EVENT_COLORS = {
  // ... צבעים קיימים
  newColor: '#123456',
};
```

### הוספת תצוגה חדשה

```typescript
// CalendarView.tsx
views={['week', 'day', 'month']}
```

### שינוי משך slot

```typescript
// CalendarView.tsx
step={15}  // 15 דקות במקום 30
```

## 🐛 פתרון בעיות

### האירועים לא נטענים

- בדוק את ה-console לשגיאות
- ודא ש-API route עובד: `/api/calendar/events`

### Drag & Drop לא עובד

- ודא שהספריה `react-big-calendar/lib/addons/dragAndDrop` מותקנת
- בדוק את ה-CSS imports

### RTL לא עובד כראוי

- ודא ש-`dir="rtl"` מוגדר
- בדוק את `rtl.css`
- השתמש ב-CSS Logical Properties

## 📚 למידע נוסף

- [React Big Calendar Docs](https://jquense.github.io/react-big-calendar/examples/index.html)
- [Microsoft Graph Calendar API](https://learn.microsoft.com/en-us/graph/api/resources/calendar)
- [NextAuth.js](https://next-auth.js.org/)

## 🎉 סיום

היומן מוכן לשימוש! תהנה מיומן שבועי מודרני ומרשים! 🚀

---

**Built with ❤️ using Next.js 14, TypeScript, and React Big Calendar**

