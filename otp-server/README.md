# 📧 OTP Email Backend - Complete Setup Guide

## 🎯 What This Does

Sends **real OTP emails** for testing without paying for email services:
- ✅ Free forever (Ethereal Email)
- ✅ No credit card needed
- ✅ Real emails sent
- ✅ Preview emails in browser
- ✅ Perfect for QA automation testing

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Free Email Service (2 minutes)

**Option A: Ethereal Email (Recommended)**
1. Visit: https://ethereal.email/
2. Click "Create Ethereal Account" button
3. You'll get credentials instantly:
   ```
   Email: something@ethereal.email
   Password: some-password
   ```
4. Copy them (you'll need these next)

**Option B: Mailtrap (Alternative)**
1. Visit: https://mailtrap.io/
2. Sign up (free, no CC)
3. Create inbox
4. Get SMTP credentials from settings

### Step 2: Install Dependencies (2 minutes)

```bash
# Navigate to the otp-server folder
cd otp-server

# Install required packages
npm install

# Output should show:
# added 50 packages
```

### Step 3: Configure Email Service (1 minute)

**Edit `otp-server/server.js`:**

Find these lines (~line 26-33):
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'your-ethereal-email@ethereal.email', // ← REPLACE THIS
    pass: 'your-ethereal-password'                // ← REPLACE THIS
  }
});
```

Replace with your Ethereal credentials:
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'john.doe@ethereal.email',    // From step 1
    pass: 'xyz123abc456def789'          // From step 1
  }
});
```

### Step 4: Start the Server

```bash
# In otp-server folder
npm start

# You should see:
# ✅ Server running on http://localhost:3001
# 📧 Email Service Configuration: Ethereal Email
```

### Step 5: Test It

Open in browser: `http://localhost:3000/v1/mfa.html`

1. Enter email (e.g., `test@example.com`)
2. Click "Send OTP"
3. Copy the generated OTP
4. Paste into OTP field
5. Click "Verify"
6. ✅ Success!

---

## 📊 API Endpoints

### Send OTP
```bash
POST http://localhost:3001/api/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

# Response:
{
  "success": true,
  "message": "OTP sent to user@example.com",
  "previewUrl": "https://ethereal.email/message/...",
  "expiresIn": 600
}
```

### Verify OTP
```bash
POST http://localhost:3001/api/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

# Response:
{
  "success": true,
  "message": "OTP verified successfully!",
  "verified": true
}
```

### Check OTP Status (Debug)
```bash
GET http://localhost:3001/api/otp-status/user@example.com

# Response:
{
  "email": "user@example.com",
  "otp": "123456",
  "expiresIn": 450,
  "attempts": 0
}
```

### Server Health
```bash
GET http://localhost:3001/api/health

# Response:
{
  "status": "OK",
  "server": "OTP Email Service",
  "otpCount": 2,
  "uptime": 234.5
}
```

---

## 📁 File Structure

```
mega-testbed-v3.4/
├── v1/
│   └── mfa.html                    (Updated with API calls)
├── otp-server/                      (NEW)
│   ├── server.js                   (Main backend)
│   ├── package.json                (Dependencies)
│   └── node_modules/               (Auto-created)
├── OTP_EMAIL_INTEGRATION_GUIDE.md   (Detailed guide)
└── SETUP_OTP_BACKEND.sh             (Setup script)
```

---

## 🔧 Email Service Options

### 1. Ethereal Email (✅ Recommended)
- **Cost:** Free forever
- **Setup:** 2 minutes
- **CC Required:** No
- **Credentials:** Instant
- **Features:** 
  - Test email preview in browser
  - Unlimited test emails
  - 10 minute email expiry
- **Best for:** QA testing, automation

**Setup:**
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@ethereal.email',
    pass: 'your-password'
  }
});
```

### 2. Mailtrap (Alternative)
- **Cost:** Free (500 emails/month)
- **Setup:** 5 minutes
- **CC Required:** No
- **Features:**
  - Real inbox interface
  - Email attachments support
  - HTML/text email preview
- **Best for:** Integration testing

**Setup:**
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 465,
  auth: {
    user: 'your-username',
    pass: 'your-password'
  }
});
```

### 3. Gmail (Production)
- **Cost:** Free (your account)
- **Setup:** 10 minutes
- **CC Required:** No (but Gmail account)
- **Features:**
  - Real emails to real inbox
  - Gmail security features
- **Best for:** Production-like testing

**Setup:**
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-specific-password' // From myaccount.google.com/apppasswords
  }
});
```

---

## 🧪 Testing Scenarios

### Test 1: Valid OTP Flow
```
1. Send OTP to test@example.com
2. Copy OTP from preview or console
3. Verify OTP
4. ✅ Should succeed
```

### Test 2: Invalid Email Format
```
1. Try to send OTP to "notanemail"
2. ❌ Should show error: "Invalid email format"
```

### Test 3: Expired OTP
```
1. Send OTP
2. Wait 10+ minutes
3. Try to verify OTP
4. ❌ Should show: "OTP has expired"
```

### Test 4: Wrong OTP
```
1. Send OTP (e.g., 123456)
2. Enter wrong code (e.g., 654321)
3. ❌ Should show: "Invalid OTP"
4. 3 wrong attempts allowed
```

### Test 5: Rate Limiting
```
1. Enter wrong OTP 5 times
2. 5th attempt fails
3. ❌ Should say: "Too many failed attempts"
4. Must request new OTP
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
**Solution:** Run `npm install` in the otp-server folder

### Error: "ECONNREFUSED - Connection refused"
**Solution:** Make sure backend is running (`npm start`)

### Error: "Invalid login credentials"
**Solution:** 
1. Check Ethereal credentials are correct
2. Get new credentials from https://ethereal.email/
3. Update server.js with correct credentials

### Error: "CORS policy blocked"
**Solution:** CORS is already enabled in server.js, should work fine

### Error: "Port 3001 already in use"
**Solution:** 
```bash
# Kill process on port 3001
# Mac/Linux:
lsof -ti:3001 | xargs kill -9

# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### OTP shows as "undefined" in email
**Solution:** Check that your email service is connected properly

---

## 📝 For Automation Testing

### With Cypress/Nightwatch
```javascript
// Send OTP
cy.request('POST', 'http://localhost:3001/api/send-otp', {
  email: 'test@example.com'
}).then(response => {
  const otp = response.body.otp; // Get OTP
  
  // Use OTP in test
  cy.get('[data-testid="otp-input"]').type(otp);
  cy.get('[data-testid="btn-verify-otp"]').click();
});
```

### With Selenium/Webdriver
```python
import requests

# Send OTP
response = requests.post(
    'http://localhost:3001/api/send-otp',
    json={'email': 'test@example.com'}
)

otp = response.json()['otp']

# Use in test
driver.find_element(By.ID, 'otp-input').send_keys(otp)
driver.find_element(By.ID, 'btn-verify-otp').click()
```

---

## ✅ Checklist

- [ ] Get Ethereal Email account (https://ethereal.email/)
- [ ] Copy credentials
- [ ] Run `npm install` in otp-server/
- [ ] Update credentials in server.js
- [ ] Run `npm start`
- [ ] Open http://localhost:3000/v1/mfa.html
- [ ] Test send OTP
- [ ] Test verify OTP
- [ ] Verify automation integration

---

## 📚 Learn More

- **Nodemailer Docs:** https://nodemailer.com/
- **Ethereal Email:** https://ethereal.email/
- **Mailtrap:** https://mailtrap.io/
- **Gmail App Passwords:** https://myaccount.google.com/apppasswords

---

## 🎓 What You've Learned

✅ How to send real emails without paying  
✅ How to integrate email with backend  
✅ How to test OTP flows end-to-end  
✅ How to preview emails in browser  
✅ How to handle security (rate limiting, expiry)  

---

## 🚀 Next Steps

1. **Now:** Start testing with Ethereal Email (free)
2. **Later:** Switch to Mailtrap for more features
3. **Production:** Use Gmail or SendGrid with real credentials

---

**Need help?** Check `OTP_EMAIL_INTEGRATION_GUIDE.md` for more details!
