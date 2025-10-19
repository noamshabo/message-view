# הגדרת אוטנטיקציה עם Google OAuth

המערכת מוגדרת עם אוטנטיקציה באמצעות Google OAuth, עם whitelist של אימיילים מותרים בלבד.

## 📋 שלב 1: הגדרת Google OAuth

### 1.1 יצירת פרויקט ב-Google Cloud Console

1. היכנס ל-[Google Cloud Console](https://console.cloud.google.com/)
2. צור פרויקט חדש או בחר פרויקט קיים
3. עבור ל-**APIs & Services** > **Credentials**
4. לחץ על **Create Credentials** > **OAuth client ID**

### 1.2 הגדרת OAuth consent screen

לפני יצירת ה-credentials, תצטרך להגדיר את ה-OAuth consent screen:

1. לחץ על **Configure consent screen**
2. בחר **External** (או Internal אם יש לך Google Workspace)
3. מלא את השדות הנדרשים:
   - **App name**: שם האפליקציה שלך
   - **User support email**: כתובת האימייל שלך
   - **Developer contact information**: כתובת האימייל שלך
4. לחץ **Save and Continue**

### 1.3 יצירת OAuth Client ID

1. חזור ל-**Credentials** > **Create Credentials** > **OAuth client ID**
2. בחר **Application type**: Web application
3. תן שם ל-client (למשל: "Message View App")
4. הוסף **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
5. הוסף **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. לחץ **Create**
7. שמור את ה-**Client ID** וה-**Client Secret** (תצטרך אותם בהמשך)

### 1.4 הוספת לפרודקשן

כשתעלה לפרודקשן, תצטרך להוסיף גם:

**Authorized JavaScript origins**:
```
https://yourdomain.com
```

**Authorized redirect URIs**:
```
https://yourdomain.com/api/auth/callback/google
```

---

## 🔧 שלב 2: הגדרת משתני סביבה

### 2.1 עדכן את קובץ `.env.local`

פתח את הקובץ `.env.local` שנוצר בשורש הפרויקט ועדכן אותו:

```bash
# NocoDB Configuration (אם יש לך)
NOCODB_API_URL=your_nocodb_api_url_here
NOCODB_API_TOKEN=your_nocodb_token_here

# NextAuth Configuration
# צור secret באמצעות: openssl rand -base64 32
AUTH_SECRET=your_generated_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth URL
NEXTAUTH_URL=http://localhost:3000
```

### 2.2 יצירת AUTH_SECRET

הרץ את הפקודה הבאה כדי לייצר secret אקראי:

```bash
openssl rand -base64 32
```

העתק את התוצאה ל-`AUTH_SECRET` בקובץ `.env.local`

---

## 👥 שלב 3: הגדרת רשימת משתמשים מותרים (Whitelist)

### 3.1 עדכן את רשימת האימיילים המותרים

פתח את הקובץ `src/auth.config.ts` ומצא את המערך `ALLOWED_EMAILS`:

```typescript
const ALLOWED_EMAILS = [
  "example@gmail.com", // החלף בכתובות האימייל שלך
  // הוסף עוד אימיילים כאן
];
```

### 3.2 הוסף את כתובות האימייל שלך

```typescript
const ALLOWED_EMAILS = [
  "your.email@gmail.com",
  "colleague@gmail.com",
  "boss@company.com",
  // ניתן להוסיף כמה שרוצים
];
```

**חשוב:** רק משתמשים עם אימיילים מהרשימה הזו יוכלו להתחבר למערכת!

---

## 🚀 שלב 4: הרצת המערכת

### 4.1 התקנת dependencies (אם לא עשית)

```bash
pnpm install
```

### 4.2 הפעלת שרת הפיתוח

```bash
pnpm dev
```

### 4.3 בדיקת האוטנטיקציה

1. פתח דפדפן וגש ל-`http://localhost:3000`
2. אמור להיות מופנה אוטומטית לדף ההתחברות
3. לחץ על "התחבר עם Google"
4. בחר את חשבון Google שלך (חייב להיות ברשימת המותרים!)
5. אם החשבון מורשה, תועבר לדף הראשי
6. אם החשבון לא מורשה, תקבל הודעת שגיאה

---

## 📁 קבצים שנוצרו

הקבצים הבאים נוצרו/עודכנו במערכת:

- `src/auth.config.ts` - הגדרות אוטנטיקציה ורשימת משתמשים מותרים
- `src/auth.ts` - אתחול NextAuth
- `src/app/api/auth/[...nextauth]/route.ts` - API route לאוטנטיקציה
- `src/middleware.ts` - הגנה על routes
- `src/app/layout.tsx` - SessionProvider
- `src/app/auth/signin/page.tsx` - דף התחברות
- `src/components/UserMenu.tsx` - תפריט משתמש עם כפתור יציאה
- `.env.example` - דוגמה למשתני סביבה
- `.env.local` - משתני סביבה (אל תעלה ל-git!)

---

## 🔒 אבטחה

### מה מוגן?

- כל הדפים בפרויקט מוגנים אוטומטית על ידי ה-middleware
- רק משתמשים שמופיעים ב-`ALLOWED_EMAILS` יכולים להתחבר
- ה-session מתנהל באמצעות JWT tokens מוצפנים

### מה לא מוגן?

- `/api/auth/*` - נתיבי האוטנטיקציה עצמם
- `/_next/*` - קבצי Next.js סטטיים
- `/favicon.ico` - האייקון

אם אתה רוצה להוסיף דפים שלא מוגנים (למשל דף about), תצטרך לעדכן את ה-middleware.

---

## 🛠️ פתרון בעיות נפוצות

### 1. "Access denied" למרות שהאימייל ברשימה

- ודא שהאימייל כתוב בדיוק כמו בחשבון Google (כולל אותיות גדולות/קטנות)
- בדוק שאין רווחים מיותרים ברשימת האימיילים
- הפעל מחדש את שרת הפיתוח (`pnpm dev`)

### 2. "Invalid client" או "Redirect URI mismatch"

- ודא שה-Authorized redirect URI ב-Google Cloud Console הוא בדיוק:
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- אין צורך ב-trailing slash (/)
- ודא שה-NEXTAUTH_URL ב-.env.local תואם לכתובת

### 3. "AUTH_SECRET is not set"

- הפעל: `openssl rand -base64 32`
- העתק את התוצאה ל-AUTH_SECRET ב-.env.local
- הפעל מחדש את השרת

### 4. המערכת לא מפנה לדף התחברות

- ודא שהקובץ `src/middleware.ts` קיים
- בדוק שאין שגיאות בקונסול
- נסה למחוק את תיקיית `.next` והפעל מחדש: `rm -rf .next && pnpm dev`

---

## 📝 הוספת אימייל חדש לרשימת המותרים

1. פתח את `src/auth.config.ts`
2. הוסף את האימייל למערך:
   ```typescript
   const ALLOWED_EMAILS = [
     "existing@gmail.com",
     "new_user@gmail.com", // <- הוסף כאן
   ];
   ```
3. שמור את הקובץ
4. המערכת תעדכן אוטומטית (hot reload)

---

## 🌐 העלאה לפרודקשן

כשאתה מוכן להעלות לפרודקשן:

1. עדכן ב-Google Cloud Console את ה-Authorized URIs עם הדומיין שלך
2. עדכן את `.env.local` (או הגדר משתני סביבה בשרת):
   ```bash
   NEXTAUTH_URL=https://yourdomain.com
   AUTH_SECRET=new_random_secret_for_production
   ```
3. ודא שכל משתני הסביבה מוגדרים בסביבת הפרודקשן

---

## 💡 טיפים נוספים

- אפשר לראות בקונסול של השרת ניסיונות התחברות כושלים
- ה-session נשמר ב-cookie מוצפן
- כל פעם שמשתמש מתחבר, הוא נבדק מול רשימת המותרים
- אפשר להוסיף לוגיקה מורכבת יותר (לדוגמה, domains מורשים במקום אימיילים ספציפיים)

---

## 📞 צריך עזרה?

אם משהו לא עובד, בדוק:
1. שכל משתני הסביבה מוגדרים נכון ב-.env.local
2. שה-Google OAuth credentials מוגדרים נכון
3. שהאימייל שלך ברשימת המותרים
4. את הקונסול בדפדפן ובשרת לשגיאות

---

**בהצלחה! 🎉**

