# 📘 מדריך הקמת Microsoft Azure App לחיבור Outlook Calendar

מדריך זה יעזור לך להגדיר את החיבור ל-Outlook Calendar API דרך Microsoft Azure.

## 📋 שלב 1: יצירת Azure App Registration

### 1.1 כניסה ל-Azure Portal

1. היכנס ל-[Azure Portal](https://portal.azure.com)
2. חפש "App registrations" בחיפוש העליון
3. לחץ על "+ New registration"

### 1.2 הגדרת האפליקציה

מלא את הפרטים הבאים:

- **Name**: `Weekly Calendar App` (או כל שם שתבחר)
- **Supported account types**: בחר `Accounts in any organizational directory and personal Microsoft accounts`
- **Redirect URI**:
  - Platform: `Web`
  - URL: `http://localhost:3000/api/auth/callback/azure-ad` (לפיתוח)
  - URL ייצור: `https://your-domain.com/api/auth/callback/azure-ad`

לחץ **Register**.

---

## 📋 שלב 2: קבלת Client ID ו-Client Secret

### 2.1 Client ID (Application ID)

1. אחרי יצירת האפליקציה, תגיע לדף "Overview"
2. העתק את **Application (client) ID**
3. שמור אותו - תצטרך אותו ב-`.env.local`

### 2.2 Client Secret

1. בתפריט צד, לחץ על **Certificates & secrets**
2. לחץ על **+ New client secret**
3. הוסף תיאור (למשל: "Production Secret")
4. בחר תוקף (Expires): 24 months מומלץ
5. לחץ **Add**
6. **חשוב!** העתק את ה-**Value** מיד - לא תוכל לראות אותו שוב!

---

## 📋 שלב 3: הגדרת הרשאות API

### 3.1 הוסף הרשאות Microsoft Graph

1. בתפריט צד, לחץ על **API permissions**
2. לחץ על **+ Add a permission**
3. בחר **Microsoft Graph**
4. בחר **Delegated permissions**
5. הוסף את ההרשאות הבאות:

   ✅ **Calendars.ReadWrite** - קריאה וכתיבה לאירועים  
   ✅ **Calendars.ReadWrite.Shared** - גישה ללוחות משותפים  
   ✅ **User.Read** - מידע בסיסי על המשתמש

6. לחץ **Add permissions**

### 3.2 Grant Admin Consent (אופציונלי אבל מומלץ)

1. לחץ על **Grant admin consent for [Your Organization]**
2. אשר את ההרשאות

---

## 📋 שלב 4: עדכון קבצי הקוד

### 4.1 עדכן את `.env.local`

צור/ערוך את הקובץ `.env.local` בשורש הפרויקט:

```env
# Azure Calendar API
MICROSOFT_CLIENT_ID="YOUR_APPLICATION_CLIENT_ID_HERE"
MICROSOFT_CLIENT_SECRET="YOUR_CLIENT_SECRET_VALUE_HERE"
MICROSOFT_TENANT_ID="common"  # או ה-Tenant ID הספציפי שלך

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"  # הפק בעזרת: openssl rand -base64 32
```

### 4.2 עדכן את `src/auth.config.ts`

הוסף את Microsoft provider:

```typescript
import Microsoft from "next-auth/providers/microsoft";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Microsoft({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email User.Read Calendars.ReadWrite Calendars.ReadWrite.Shared",
        },
      },
    }),
  ],
  // ... שאר ההגדרות
};
```

---

## 📋 שלב 5: הפעל את החיבור האמיתי

### 5.1 עדכן את `outlookClient.ts`

בקובץ `src/lib/calendar/outlookClient.ts`:

1. הסר את ההערות מהקוד האמיתי
2. יבא את `Client` מ-`@microsoft/microsoft-graph-client`
3. השתמש בפונקציות האמיתיות במקום dummy data

דוגמה:

```typescript
import { Client } from '@microsoft/microsoft-graph-client';
import { getSession } from 'next-auth/react';

export async function getOutlookEvents(startDate: Date, endDate: Date) {
  const session = await getSession();
  const accessToken = session?.accessToken;
  
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
  
  const result = await client
    .api('/me/calendar/events')
    .filter(`start/dateTime ge '${startDate.toISOString()}' and end/dateTime le '${endDate.toISOString()}'`)
    .select('subject,start,end,location,attendees,bodyPreview,isAllDay')
    .get();
  
  return result.value.map(convertOutlookEventToCalendarEvent);
}
```

---

## 🔐 אבטחה וטיפים

### ✅ אבטחה

- **אף פעם** אל תשתף את ה-Client Secret
- **אף פעם** אל תעלה `.env.local` ל-Git
- החלף secrets באופן קבוע (כל 6-12 חודשים)
- השתמש ב-`.gitignore` כדי להחריג `.env.local`

### 💡 טיפים

1. **בדיקה מקומית**: התחל עם `http://localhost:3000`
2. **Redirect URIs**: הוסף גם את ה-URL של ייצור אחרי הפריסה
3. **Scopes**: ודא שכל ההרשאות מאושרות
4. **Tokens**: Access tokens תקפים ל-1 שעה, Refresh tokens ל-90 ימים

---

## 🐛 פתרון בעיות נפוצות

### שגיאה: "Invalid redirect URI"

**פתרון**: ודא שה-Redirect URI ב-Azure תואם בדיוק ל-URL באפליקציה.

### שגיאה: "AADSTS7000218: The request body must contain the following parameter: 'client_assertion'"

**פתרון**: ודא ש-Client Secret נוצר ולא פג תוקפו.

### שגיאה: "Insufficient privileges to complete the operation"

**פתרון**: ודא שההרשאות (`Calendars.ReadWrite`) הוגדרו ב-Azure ואושרו.

### אירועים לא נטענים

**פתרון**:
1. בדוק שה-Access Token תקף
2. ודא שהמשתמש התחבר עם Microsoft Account
3. בדוק את ה-scope ב-authorization

---

## 📚 משאבים נוספים

- [Microsoft Graph API Documentation](https://learn.microsoft.com/en-us/graph/api/resources/calendar)
- [NextAuth Microsoft Provider](https://next-auth.js.org/providers/microsoft-entra-id)
- [Azure App Registration Guide](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

---

## ✅ סיימת!

אחרי שתשלים את כל השלבים, היומן שלך יהיה מחובר ל-Outlook Calendar ויסנכרן אירועים באופן דו-כיווני!

🎉 **בהצלחה!**

