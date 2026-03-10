# 📧 Setup OTP Email Backend for BrowserStack Testing

## ⚡ Quick Setup (5 minutes)

### Step 1: Get Free Email Credentials

**Option A: Ethereal Email (Recommended - Instant)**
1. Visit: https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy your credentials:
   - Email: `your-email@ethereal.email`
   - Password: `your-password`

**Option B: Mailtrap (Requires Account)**
1. Visit: https://mailtrap.io/
2. Sign up (free)
3. Get SMTP credentials from dashboard
4. User: `your-username`
5. Password: `your-password`

**Option C: Gmail (Requires Setup)**
1. Enable 2-factor authentication on Gmail
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use your email and app-specific password

### Step 2: Update Backend Configuration

**Edit:** `/otp-server/server.js`

**For Ethereal Email (Easiest):**
```javascript
// Line 29-35: Update these lines
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@ethereal.email',  // ← PASTE YOUR EMAIL
    pass: 'your-password'                // ← PASTE YOUR PASSWORD
  }
});
```

**For Mailtrap:**
```javascript
// Comment out Ethereal (lines 29-35)
// Uncomment lines 37-44:
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 465,
  auth: {
    user: 'your-mailtrap-username',    // ← PASTE YOUR USERNAME
    pass: 'your-mailtrap-password'     // ← PASTE YOUR PASSWORD
  }
});
```

**For Gmail:**
```javascript
// Uncomment lines 46-51:
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',      // ← YOUR GMAIL
    pass: 'your-app-password'          // ← APP-SPECIFIC PASSWORD
  }
});
```

### Step 3: Install Dependencies

```bash
cd otp-server
npm install
```

Expected output:
```
added 123 packages
```

### Step 4: Start the Backend Server

```bash
node server.js
```

Expected output:
```
✅ OTP Server running on http://localhost:3001
📧 Email service configured and ready
```

**Leave this terminal open** - the server must run in the background.

### Step 5: Test Email Connection

**Option A: Via Terminal**
```bash
curl http://localhost:3001/api/test-email
```

Expected response:
```json
{ "success": true, "message": "Email service is working!" }
```

**Option B: Via Browser**
1. Open: http://localhost:3001/api/test-email
2. Should see: `{"success":true,"message":"Email service is working!"}`

### Step 6: Test OTP Form

1. Open: https://aakashbrowserstack.github.io/Automation-Playground/v1/mfa.html
2. Enter your email address
3. Click "Send OTP"
4. **Expected Result:** 
   - Status shows "✅ OTP sent to your-email@example.com"
   - Email appears in your Ethereal/Mailtrap/Gmail inbox
   - OTP code visible in email

---

## 🧪 Testing with BrowserStack Temp Email

### Step 1: Get a Temp Email

1. Visit BrowserStack Inbox: https://console.browserstack.local/automate/inbox
2. Copy a temp email address:
   ```
   temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com
   ```

### Step 2: Send OTP to Temp Email

1. Open MFA page: `https://aakashbrowserstack.github.io/Automation-Playground/v1/mfa.html`
2. Paste temp email in form
3. Click "Send OTP"
4. Status should show "✅ OTP sent to temp_..."

### Step 3: Extract OTP from BrowserStack

**Manual Method:**
1. Go to BrowserStack Inbox
2. Find the email with subject "🔐 Your OTP Code - QA Testbed"
3. Open email
4. Copy the 6-digit OTP
5. Paste into OTP input field
6. Click "Verify OTP"

**Programmatic Method (LCNC Automation):**
```javascript
// In LCNC script
const email = 'temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com';
const response = await fetch(`https://api.bstackinbox.com/v1/inbox/${email}`);
const data = await response.json();
const latestEmail = data.mails[0];
const match = latestEmail.body.match(/(\d{6})/);
const otp = match ? match[1] : null;
```

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot find module 'express'"

**Solution:**
```bash
cd otp-server
npm install express nodemailer cors body-parser
```

### ❌ Error: "Email service not configured properly"

**Solutions:**
1. **Check credentials:** Verify email/password are correct
2. **Check provider:** Some providers have IP whitelisting
3. **Try different provider:** Use Ethereal (no setup needed)
4. **Check firewall:** Port 587/465 must be open

### ❌ Emails not arriving in inbox

**Check:**
1. Server is running (`node server.js` in terminal)
2. Credentials are correct in `server.js`
3. Email provider allows SMTP access
4. Check spam/junk folder
5. Use Ethereal test account (simplest)

### ❌ Error: "Backend not running" (Demo Mode)

**Solution:**
1. Open second terminal
2. Run: `cd otp-server && node server.js`
3. Keep it running while testing
4. Refresh the MFA page
5. Try sending OTP again

### ❌ MFA form still shows demo OTP

**Verify:**
1. Check backend is running: http://localhost:3001/api/test-email
2. Check browser console (F12) for errors
3. Check network tab to see if API call succeeds
4. Verify CORS is enabled (should be in server.js)

---

## 📱 LCNC Testing Flow

### With Backend Running:

```
1. LCNC Records:
   └─ Input email: temp_..._@preprod.bstackinbox.com
   └─ Click "Send OTP"
   └─ Backend sends email via SMTP
   └─ Email arrives in BrowserStack Inbox ✅

2. LCNC Extracts OTP:
   └─ API call to BrowserStack Inbox API
   └─ Regex extract 6-digit code from email body
   └─ Insert OTP into input field

3. LCNC Verifies:
   └─ Click "Verify OTP"
   └─ Status shows "✅ Email verified successfully!"
   └─ Replay succeeds ✅
```

### Without Backend (Demo Mode):

```
1. Form shows warning: "Demo Mode: OTP generated locally"
2. OTP shown in blue box below email input
3. Manual copy-paste for testing
4. No actual email sent
5. Good for element selection testing, not email integration
```

---

## 🌐 Production Deployment

### To make OTP work on GitHub Pages:

You'll need a **Cloud Backend** since GitHub Pages can't run Node.js:

**Option 1: Heroku (Free tier ending - consider Render)**
```bash
# Deploy otp-server to Heroku
heroku create your-app-name
git push heroku main
```

**Option 2: Render.com (Free tier)**
1. Push code to GitHub
2. Create account at render.com
3. Connect GitHub repo
4. Deploy with one click

**Option 3: AWS Lambda + API Gateway**
1. Deploy as Lambda function
2. Trigger via API Gateway
3. Use free tier

**Then update MFA form:**
```javascript
// Change from:
const response = await fetch('http://localhost:3001/api/send-otp', ...);

// To:
const response = await fetch('https://your-heroku-app.herokuapp.com/api/send-otp', ...);
// Or:
const response = await fetch('https://your-render-app.onrender.com/api/send-otp', ...);
```

---

## 📊 Test Results

After setup, you should see:

### Backend Running ✅
```
✅ OTP Server running on http://localhost:3001
✅ Email service configured
✅ API endpoint: POST /api/send-otp
✅ Database: In-memory OTP store
```

### MFA Form ✅
```
✅ Send OTP (via backend email)
✅ Auto-detect backend status
✅ Fallback to demo mode if backend down
✅ Progress tracking (Email → OTP → Verify)
✅ Email validation
✅ OTP validation
✅ Resend countdown
```

### LCNC Ready ✅
```
✅ Real emails sent to BrowserStack inbox
✅ Element locators available (data-testid)
✅ OTP extraction possible
✅ Full automation flow working
✅ Reliable replay without flakiness
```

---

## ✅ Verification Checklist

- [ ] Ethereal/Mailtrap credentials copied
- [ ] server.js updated with credentials
- [ ] `npm install` completed in otp-server/
- [ ] `node server.js` running in terminal
- [ ] Test email endpoint returns success
- [ ] MFA form sends OTP successfully
- [ ] Email received in inbox
- [ ] OTP verification works
- [ ] BrowserStack temp email tested
- [ ] LCNC script ready to record

---

## 🎯 Next Steps

1. **Complete setup above** ↑
2. **Verify with test email** (your personal email)
3. **Test with BrowserStack temp email**
4. **Run LCNC recording** using guide from LCNC_OTP_TESTING_GUIDE.md
5. **Validate all scenarios** in element-selection-advanced.html

**Questions?** Check LCNC_OTP_TESTING_GUIDE.md for detailed automation steps!
