# 🔗 Update MFA Form to Use Cloud Backend

## When to Do This

After you deploy backend to cloud and get a URL like:
```
https://otp-backend-xxxx.onrender.com
```

---

## Step 1: Edit MFA Form

File: `/v1/mfa.html`

Find the `sendOTP()` function (around line 260-290)

**Current code:**
```javascript
async function sendOTP() {
  // ... validation code ...
  
  try {
    // Try to send via backend first
    const response = await fetch('http://localhost:3001/api/send-otp', {  // ← THIS LINE
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
```

**Replace with your cloud URL:**
```javascript
async function sendOTP() {
  // ... validation code ...
  
  try {
    // Try to send via backend first
    const response = await fetch('https://otp-backend-xxxx.onrender.com/api/send-otp', {  // ← CHANGE THIS
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
```

### Where to get your URL?

After deploying on Render:
1. Go to: https://dashboard.render.com
2. Click your "otp-backend" service
3. Copy the URL at the top (e.g., `https://otp-backend-abc123.onrender.com`)
4. Replace `otp-backend-xxxx.onrender.com` with your actual URL

---

## Step 2: Test Locally (Optional)

```bash
# Test the form still works with cloud backend
curl -X POST https://otp-backend-xxxx.onrender.com/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Should return:
```json
{
  "success": true,
  "message": "OTP sent to test@example.com",
  ...
}
```

---

## Step 3: Push to GitHub

```bash
git add v1/mfa.html
git commit -m "Update MFA form to use cloud OTP backend"
git push origin main
```

---

## Step 4: Test from GitHub Pages

1. Wait 30 seconds for GitHub Pages to update
2. Open: https://aakashbrowserstack.github.io/Automation-Playground/v1/mfa.html
3. Enter BrowserStack temp email
4. Click "Send OTP"
5. ✅ Should show: "OTP sent to temp_..."
6. Check BrowserStack Inbox for email

---

## 🎯 Architecture After Update

```
GitHub Pages (Frontend)
    ↓ MFA form
    └─→ Cloud Backend (Render.com)
        ├─ Load .env with credentials
        ├─ Connect to Ethereal SMTP
        ├─ Send email to BrowserStack
        └─ Return success response
    ↓
BrowserStack Inbox
    └─ User extracts OTP
    ↓
GitHub Pages (Frontend)
    └─ Verify OTP
    ↓
✅ Success - Flow works for LCNC!
```

---

## Testing the Complete Flow

### Manual Test
1. Open MFA form (GitHub Pages)
2. Enter BrowserStack temp email
3. Click "Send OTP"
4. ✅ Email arrives in BrowserStack Inbox
5. Copy OTP
6. Paste in form
7. Click "Verify OTP"
8. ✅ Success message

### LCNC Automation Test
1. Start LCNC recording
2. Navigate to MFA form
3. Enter temp email
4. Click "Send OTP"
5. Extract OTP from email (via API or manual)
6. Enter OTP
7. Click "Verify OTP"
8. ✅ LCNC replay works

---

## If It Doesn't Work

### Check Cloud Backend Status
```bash
curl https://otp-backend-xxxx.onrender.com/api/test-email
```

Should return: `{"success":true,...}`

If error:
1. Check Render dashboard (any deployment errors?)
2. Check environment variables set correctly
3. Restart service on Render dashboard

### Check Form is Updated
1. View page source (Right-click → View Page Source)
2. Search for "onrender.com"
3. Should see your cloud URL, NOT "localhost"

### Check Network in Browser
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Send OTP"
4. Look for XHR request to "otp-backend-xxxx.onrender.com"
5. Should return 200 OK with success message

---

## URL Format

Make sure you have:
- ✅ HTTPS (not HTTP): `https://` not `http://`
- ✅ Full domain: `otp-backend-xxxx.onrender.com`
- ✅ Endpoint: `/api/send-otp`

Full example:
```javascript
'https://otp-backend-xxxx.onrender.com/api/send-otp'
```

Not:
- ❌ `http://otp-backend-xxxx.onrender.com/api/send-otp` (HTTP)
- ❌ `otp-backend-xxxx.onrender.com/api/send-otp` (Missing https://)
- ❌ `https://otp-backend-xxxx.onrender.com` (Missing /api/send-otp)

---

## Quick Copy-Paste

Once you have your URL (e.g., `https://otp-backend-abc123.onrender.com`):

**Replace this:**
```javascript
const response = await fetch('http://localhost:3001/api/send-otp', {
```

**With this:**
```javascript
const response = await fetch('https://otp-backend-abc123.onrender.com/api/send-otp', {
```

---

## After Update - Ready for LCNC

Once form is updated and deployed:
1. ✅ Frontend on GitHub Pages
2. ✅ Backend on Render.com cloud
3. ✅ Email service working globally
4. ✅ LCNC can access everything
5. ✅ Automation flow complete

Follow: **LCNC_OTP_TESTING_GUIDE.md** for next steps
