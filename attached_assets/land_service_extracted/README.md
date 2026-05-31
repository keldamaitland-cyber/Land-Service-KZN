# Land Service KZN National Camp 2026 — App

## 🌿 Overview
A full camp management web app in forest green, gold & white for the Land Service KZN National Camp 2026, hosted in Richmond, KwaZulu-Natal.

## 📁 Files
- `index.html` — The entire app (single file, no build step needed)
- `google_apps_script.js` — Google Apps Script for Sheets integration
- `README.md` — This file

---

## 🚀 Running on Replit

1. Create a new Replit → choose **HTML/CSS/JS** (or just upload `index.html`)
2. Upload `index.html` to the project root
3. Click **Run** — the app will open in the built-in browser

---

## 📊 Connecting to Google Sheets (Sign In & Feedback)

### Step 1 — Create Your Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet
2. Name it: `Land Service Camp 2026 Register`
3. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**YOUR_SHEET_ID**/edit`

### Step 2 — Set Up the Apps Script
1. In your Google Sheet: click **Extensions → Apps Script**
2. Delete all default code and paste the entire contents of `google_apps_script.js`
3. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID (line 28)
4. Click **Save** (Ctrl+S)

### Step 3 — Deploy as a Web App
1. Click **Deploy → New Deployment**
2. Click the gear ⚙️ icon next to "Select type" → choose **Web App**
3. Set:
   - **Description:** Camp 2026 Register
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Copy the Web App URL** (looks like `https://script.google.com/macros/s/AKfyc...../exec`)

### Step 4 — Connect the App
In `index.html`, find these two lines and update them:

```javascript
// Line ~251 — replace with your Apps Script Web App URL
const SHEET_WEBHOOK_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```

```html
<!-- Line ~140 — replace with your Google Sheet URL -->
<a href="YOUR_GOOGLE_SHEET_LINK_HERE" ...>
```

---

## 🎨 App Tabs

| Tab | Content |
|-----|---------|
| 📋 Sign In | Camper registration form that syncs to Google Sheets |
| 📅 Schedule | 3-day camp programme |
| 🏛️ Richmond History | Timeline of Richmond's fascinating history |
| 🌍 KZN Trivia | Amazing facts about KwaZulu-Natal |
| 🎨 Arts & Crafts | All 24 craft activity cards |
| 💬 Feedback | Star-rated feedback form syncing to Sheets |

---

## 🖌️ Design
- **Colours:** Forest Green `#1a4731`, Gold `#c9a227`, Warm White `#fdfaf3`
- **Fonts:** Cinzel Decorative (headings) + Lato (body) via Google Fonts
- **No dependencies** — pure HTML/CSS/JS, works offline once cached

---

## 📞 Support
Update the camp contact details, Google Sheet link, and Apps Script URL as needed. 
All content (trivia, history, crafts) is sourced from the uploaded camp documents.
