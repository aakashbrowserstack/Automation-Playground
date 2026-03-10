# 🚀 Deploy OTP Backend on Render.com (Step-by-Step)

## Why Render?
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Auto-deploys on push
- ✅ Environment variables support
- ✅ No credit card needed for free tier

---

## Prerequisites

- GitHub account with your code pushed ✅ (you have this)
- Ethereal Email credentials ✅ (emmitt74@ethereal.email)
- 10 minutes

---

## Step 1: Sign Up on Render

1. Go to: https://render.com
2. Click "Sign up"
3. Choose "Continue with GitHub"
4. Authorize Render to access your GitHub account
5. Choose your repository: `aakashbrowserstack/Automation-Playground`

---

## Step 2: Create New Web Service

1. Click "New +" (top navigation)
2. Select "Web Service"
3. Choose your repo: `aakashbrowserstack/Automation-Playground`
4. Click "Connect"

---

## Step 3: Configure Service

### Basic Settings

**Name:** `otp-backend`

**Environment:** `Node`

**Build Command:**
```
cd otp-server && npm install
```

**Start Command:**
```
cd otp-server && node server.js
```

**Instance Type:** Free

---

## Step 4: Set Environment Variables

This is **CRITICAL** for your credentials to work on cloud!

Click "Advanced" (or "Environment")

Add these variables (same as in `.env.example`):

| Key | Value |
|-----|-------|
| `ETHEREAL_EMAIL` | `emmitt74@ethereal.email` |
| `ETHEREAL_PASSWORD` | `HzesPq282MNH8ZDKyD` |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

**Why show the password?**
- ✅ This is a **free testing account** (Ethereal Email)
- ✅ Only used for QA/LCNC testing
- ✅ No real data or sensitive info
- ✅ Same credentials in `.env.example` for reference
- ⚠️ In production, use secret management instead

**Click "Add Environment Variable" for each one**

---

## Step 5: Deploy

1. Scroll to bottom
2. Click "Create Web Service"
3. Wait 2-3 minutes for deployment
4. You'll see logs showing build progress

---

## Step 6: Get Your URL

After deployment completes:
1. Look at top of page
2. You'll see something like: `https://otp-backend-abc123.onrender.com`
3. Copy this URL (you'll need it)

---

## Step 7: Test Deployment

Open this URL in your browser:
```
https://otp-backend-abc123.onrender.com/api/test-email
```

**Expected:** Should see JSON response:
```json
{"success":true,"message":"Email service is working!"}
```

If you see an error:
- Check Render dashboard logs
- Verify environment variables are set
- Check GitHub code is latest version

---

## Step 8: Test Sending OTP

```bash
curl -X POST https://otp-backend-abc123.onrender.com/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test-user@example.com"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "OTP sent to test-user@example.com",
  "email": "test-user@example.com",
  "expiresIn": 600
}
```

---

## Step 9: Auto-Deployment Setup

Great news - Render automatically redeploys when you push to GitHub!

When you update code:
```bash
git add .
git commit -m "Update MFA form or backend"
git push origin main
```

Render will:
1. Detect the push
2. Re-run build command: `cd otp-server && npm install`
3. Re-run start command: `cd otp-server && node server.js`
4. Update the live service

No manual redeploy needed! ✅

---

## Step 10: Update MFA Form

Now update your MFA form to use the cloud URL.

**File:** `/v1/mfa.html`

Find line ~260 in `sendOTP()` function:
```javascript
const response = await fetch('http://localhost:3001/api/send-otp', {
```

Replace with:
```javascript
const response = await fetch('https://otp-backend-abc123.onrender.com/api/send-otp', {
```

Replace `otp-backend-abc123` with **your actual** URL

---

## Step 11: Push Updated Form

```bash
cd /Users/akash/Downloads/mega-testbed-v3.4
git add v1/mfa.html
git commit -m "Update MFA form to use cloud backend"
git push origin main
```

---

## Step 12: Test Complete Flow

1. Wait 30 seconds for GitHub Pages to update
2. Open: https://aakashbrowserstack.github.io/Automation-Playground/v1/mfa.html
3. Enter a test email (or BrowserStack temp email)
4. Click "Send OTP"
5. ✅ Should see: "OTP sent to..."
6. Backend logs on Render will show the email was sent

---

## 📊 Architecture

```
GitHub Pages Frontend
         ↓
    v1/mfa.html
         ↓
    https://otp-backend-xxxx.onrender.com
         ↓
    Ethereal SMTP
         ↓
    BrowserStack Inbox / Your Email
```

---

## 🔍 Monitoring & Logs

1. Go to https://dashboard.render.com
2. Click your "otp-backend" service
3. Click "Logs" tab
4. See real-time server logs
5. When OTP is sent, you'll see:
   ```
   📧 Generated OTP for test@example.com: 123456
   ✅ Email sent successfully
   ```

---

## ⚠️ Render Free Tier Limits

- **Free tier includes:**
  - 750 hours/month (enough for always-on)
  - Spin down after 15 min of inactivity (restart takes 30 sec)
  - 0.5 GB RAM
  - Shared CPU

- **For testing/LCNC:** More than enough
- **If you need guaranteed uptime:** Upgrade to Paid ($7/month)

---

## 🆘 Troubleshooting

### Deployment Fails
1. Check Build Logs in Render dashboard
2. Verify build command: `cd otp-server && npm install`
3. Verify start command: `cd otp-server && node server.js`
4. Make sure `otp-server/` folder exists in repo

### Email Not Sending
1. Check environment variables are set:
   - `ETHEREAL_EMAIL` - correct?
   - `ETHEREAL_PASSWORD` - correct?
2. Restart service from Render dashboard
3. Check logs for errors

### 404 or Connection Error
1. Verify full URL includes `/api/send-otp`
2. Make sure using HTTPS not HTTP
3. Wait 5 minutes after deployment
4. Try restarting service

### Getting "Internal Server Error"
1. Check Render logs for error details
2. Verify environment variables match
3. Restart service
4. Check GitHub code pushed correctly

---

## ✅ Deployment Checklist

- [ ] Sign up on Render.com
- [ ] Connect GitHub repo
- [ ] Create Web Service
- [ ] Set Build Command: `cd otp-server && npm install`
- [ ] Set Start Command: `cd otp-server && node server.js`
- [ ] Add env var: `ETHEREAL_EMAIL=emmitt74@ethereal.email`
- [ ] Add env var: `ETHEREAL_PASSWORD=HzesPq282MNH8ZDKyD`
- [ ] Add env var: `NODE_ENV=production`
- [ ] Click "Create Web Service"
- [ ] Wait 2-3 minutes for deployment
- [ ] Copy your URL (e.g., `https://otp-backend-abc123.onrender.com`)
- [ ] Test with curl command
- [ ] Update MFA form with cloud URL
- [ ] Push updated form to GitHub
- [ ] Test from GitHub Pages
- [ ] ✅ Ready for LCNC!

---

## 🎯 After Deployment

Your architecture is now:

```
┌─────────────────────────┐
│ LCNC Test (BrowserStack)│
└────────────┬────────────┘
             │
┌────────────▼────────────────┐
│ GitHub Pages MFA Form       │
│ (Frontend)                  │
└────────────┬────────────────┘
             │
┌────────────▼────────────────────────┐
│ Render.com OTP Backend              │
│ (Cloud, Always Accessible)          │
└────────────┬────────────────────────┘
             │
┌────────────▼──────────────────┐
│ Ethereal SMTP Server          │
│ (Email Service)               │
└────────────┬──────────────────┘
             │
┌────────────▼──────────────────┐
│ BrowserStack Inbox / Email    │
│ (OTP Delivery)                │
└───────────────────────────────┘
```

✅ **Everything works globally!**
✅ **LCNC can access backend from cloud**
✅ **Ready for full automation testing**

---

## Next Steps

1. Deploy to Render (this guide)
2. Update MFA form with cloud URL
3. Test the complete flow
4. Follow **LCNC_OTP_TESTING_GUIDE.md**

---

**Estimated Time:** 10 minutes  
**Difficulty:** Easy (just clicks and copy-paste)  
**Result:** Global OTP backend ready for LCNC! 🚀
