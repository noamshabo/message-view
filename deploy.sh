#!/bin/bash

# סקריפט מהיר לפריסת שינויים

echo "🚀 מעלה גירסה חדשה..."
echo ""

# בדוק אם יש שינויים
if [[ -z $(git status -s) ]]; then
    echo "❌ אין שינויים לפרוס"
    exit 1
fi

# הצג מה השתנה
echo "📝 קבצים ששונו:"
git status -s
echo ""

# בקש תיאור
read -p "תאר את השינויים: " commit_message

if [[ -z "$commit_message" ]]; then
    commit_message="עדכון כללי"
fi

# Commit & Push
echo ""
echo "💾 שומר שינויים..."
git add .
git commit -m "$commit_message"

echo "⬆️  דוחף ל-GitHub..."
git push

echo ""
echo "✅ הושלם!"
echo "🌐 Vercel מפרס עכשיו..."
echo "📊 ראה סטטוס ב: https://vercel.com/dashboard"
echo ""
echo "האתר יתעדכן תוך 1-2 דקות ב:"
echo "https://message-view.vercel.app/"

