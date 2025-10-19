# מדריך מהיר - אוטנטיקציה עם Google

## 🎯 מה הוקם?

המערכת מוגדרת עם אוטנטיקציה מלאה באמצעות Google OAuth, כך שרק משתמשים ספציפיים שאתה מגדיר מראש יכולים להתחבר.

## ⚡ התחלה מהירה (3 שלבים)

### 1️⃣ צור Google OAuth credentials

1. כנס ל-[Google Cloud Console](https://console.cloud.google.com/)
2. צור פרויקט חדש
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
4. הגדר:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5. שמור את **Client ID** ו-**Client Secret**

### 2️⃣ עדכן את `.env.local`

```bash
# צור secret עם: openssl rand -base64 32
AUTH_SECRET=your_generated_secret_here

# Google credentials שקיבלת בשלב 1
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

NEXTAUTH_URL=http://localhost:3000
```

### 3️⃣ הוסף אימיילים מורשים

פתח את `src/auth.config.ts` ועדכן:

```typescript
const ALLOWED_EMAILS = [
  "your.email@gmail.com",
  "colleague@gmail.com",
  // הוסף כאן את כל האימיילים המורשים
];
```

**זהו!** הרץ `pnpm dev` והמערכת מוכנה 🎉

---

## 🔐 איך זה עובד?

1. משתמש נכנס לאתר → מופנה אוטומטית לדף התחברות
2. לוחץ "התחבר עם Google" → נכנס עם חשבון Google
3. המערכת בודקת אם האימייל ברשימת המותרים
4. אם כן → כניסה מאושרת ✅
5. אם לא → גישה נדחית ❌

## 🎨 תכונות

- ✅ אוטנטיקציה מלאה עם Google OAuth
- ✅ רק אימיילים מורשים יכולים להתחבר (whitelist)
- ✅ הגנה אוטומטית על כל הדפים
- ✅ תפריט משתמש עם כפתור יציאה
- ✅ דף התחברות מעוצב בעברית
- ✅ Session management אוטומטי

## 📁 קבצים שנוצרו

```
src/
├── auth.config.ts          # הגדרות auth + רשימת אימיילים מותרים
├── auth.ts                 # אתחול NextAuth
├── middleware.ts           # הגנה על routes
├── app/
│   ├── layout.tsx         # SessionProvider (עודכן)
│   ├── page.tsx           # UserMenu (עודכן)
│   ├── api/auth/[...nextauth]/route.ts
│   └── auth/signin/page.tsx
└── components/
    └── UserMenu.tsx        # תפריט משתמש
```

## 🔧 עריכת רשימת משתמשים

רוצה להוסיף/להסיר משתמש? פשוט ערוך את `src/auth.config.ts`:

```typescript
const ALLOWED_EMAILS = [
  "user1@gmail.com",
  "user2@gmail.com",
  "user3@company.com", // הוסף משתמש חדש
];
```

שמור את הקובץ → המערכת מתעדכנת אוטומטית (hot reload) ✨

## 🚨 פתרון בעיות

| בעיה | פתרון |
|------|--------|
| "Access denied" | בדוק שהאימייל ברשימת `ALLOWED_EMAILS` |
| "Invalid client" | בדוק את ה-redirect URI ב-Google Console |
| "AUTH_SECRET not set" | הפעל `openssl rand -base64 32` והעתק ל-.env.local |

## 📚 מסמכים נוספים

למידע מפורט יותר, ראה: [AUTH_SETUP.md](./AUTH_SETUP.md)

## 🌐 לפרודקשן

כשמעלים לפרודקשן, עדכן ב-Google Cloud Console:

```
Authorized redirect URIs:
https://yourdomain.com/api/auth/callback/google
```

ועדכן משתני סביבה:

```bash
NEXTAUTH_URL=https://yourdomain.com
AUTH_SECRET=new_production_secret
```

---

**המערכת מוכנה לשימוש! 🚀**

