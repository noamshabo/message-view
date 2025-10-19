#!/bin/bash

echo "🚀 מעלה את הקוד לGitHub..."
echo ""

# בדוק אם remote כבר קיים
if git remote | grep -q "origin"; then
    echo "ℹ️  Remote 'origin' כבר קיים, מסיר אותו..."
    git remote remove origin
fi

# הוסף remote חדש
echo "📦 מוסיף remote..."
git remote add origin https://github.com/noamshabo/message-view.git

# דחוף לGitHub
echo "⬆️  דוחף לGitHub..."
git push -u origin main

echo ""
echo "✅ הקוד הועלה בהצלחה לGitHub!"
echo "🌐 ראה את הקוד ב: https://github.com/noamshabo/message-view"

