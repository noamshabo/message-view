# הגדרת משתני סביבה ב-Vercel (חשוב!)

## הבעיה שנפתרה
אם אחרי התחברות עם Google ב-Vercel אתה מועבר ל-localhost, הסיבה היא שחסר משתנה סביבה חשוב.

## התיקון

### שלב 1: כנס להגדרות הפרוייקט ב-Vercel

1. כנס ל-[Vercel Dashboard](https://vercel.com/dashboard)
2. בחר את הפרוייקט שלך (`message-view`)
3. לחץ על **Settings** (הגדרות)
4. בתפריט הצד, לחץ על **Environment Variables** (משתני סביבה)

### שלב 2: הוסף את משתנה הסביבה NEXTAUTH_URL

הוסף משתנה סביבה חדש:

```
Key (שם המשתנה):
NEXTAUTH_URL

Value (ערך המשתנה):
https://YOUR-DOMAIN.vercel.app
```

**חשוב:** החלף `YOUR-DOMAIN` בכתובת האמיתית של האתר שלך ב-Vercel.

לדוגמה:
- אם הכתובת שלך היא: `message-view-abc123.vercel.app`
- אז הערך יהיה: `https://message-view-abc123.vercel.app`

### שלב 3: בחר סביבות

בחר באילו סביבות המשתנה יהיה זמין:
- ✅ Production (ייצור)
- ✅ Preview (תצוגה מקדימה)
- ✅ Development (פיתוח)

### שלב 4: שמור ופרוס מחדש

1. לחץ על **Save** (שמור)
2. חזור לטאב **Deployments**
3. לחץ על שלוש הנקודות ליד הפריסה האחרונה
4. בחר **Redeploy** (פרוס מחדש)
5. אשר את הפריסה מחדש

### שלב 5: וודא שה-Google OAuth Redirect URI מוגדר נכון

1. כנס ל-[Google Cloud Console](https://console.cloud.google.com/)
2. בחר את הפרוייקט שלך
3. עבור ל-**APIs & Services** > **Credentials**
4. בחר את ה-OAuth 2.0 Client ID שלך
5. ב-**Authorized redirect URIs**, וודא שיש את הכתובת הבאה:

```
https://YOUR-DOMAIN.vercel.app/api/auth/callback/google
```

(החלף `YOUR-DOMAIN` בכתובת האמיתית שלך)

---

## בדיקה

אחרי הפריסה מחדש:
1. כנס לאתר שלך ב-Vercel: `https://YOUR-DOMAIN.vercel.app`
2. נסה להתחבר עם Google
3. עכשיו אתה אמור להישאר באתר שלך ולא להיות מועבר ל-localhost! ✅

---

## טיפ נוסף: שימוש בדומיין מותאם אישית

אם יש לך דומיין משלך (למשל `myapp.com`):
1. הוסף אותו ב-Vercel דרך **Settings** > **Domains**
2. עדכן את `NEXTAUTH_URL` ל-`https://myapp.com`
3. עדכן את ה-Redirect URI ב-Google Console
4. פרוס מחדש

---

## עזרה נוספת

אם עדיין יש בעיות, בדוק:
- ✅ האם `NEXTAUTH_URL` מוגדר בלי `/` בסוף
- ✅ האם השתמשת ב-`https://` ולא `http://`
- ✅ האם האתר האמיתי שלך תואם לכתובת ב-NEXTAUTH_URL
- ✅ האם פרסת מחדש אחרי שינוי משתני הסביבה

