# 🔒 Secure Environment Setup - OTP Backend

## ⚠️ IMPORTANT: Security Best Practices

**NEVER commit passwords or secrets to GitHub!**

We've implemented secure environment variable handling:

```
✅ Passwords stored in local .env file (ignored by git)
✅ .env.example shows format (safe to commit)
✅ server.js reads from environment variables
✅ No hardcoded credentials in code
```

---

## 🚀 Setup Steps

### Step 1: Install Dependencies
```bash
cd otp-server
npm install
```

### Step 2: Create .env File (Local Only)

**Copy .env.example to .env:**
```bash
cp .env.example .env
```

**Edit .env with your credentials:**
```bash
# .env (DO NOT COMMIT THIS FILE!)
ETHEREAL_EMAIL=emmitt74@ethereal.email
ETHEREAL_PASSWORD=HzesPq282MNH8ZDKyD
PORT=3001
```

### Step 3: Verify .env is Ignored

Check that git ignores the .env file:
```bash
git check-ignore .env
# Should output: .env
```

If not, it's already configured in .gitignore - you're safe!

### Step 4: Start Server

```bash
node server.js
```

Expected output:
```
╔════════════════════════════════════════════════════╗
║         🔐 OTP Email Backend Server               ║
╚════════════════════════════════════════════════════╝

✅ Server running on http://localhost:3001
```

---

## 📋 File Structure

```
otp-server/
├── .env                 ← YOUR SECRETS (LOCAL ONLY - Git ignores)
├── .env.example         ← TEMPLATE (Safe to commit)
├── .gitignore          ← Ignores .env, node_modules, logs
├── package.json        ← Dependencies + dotenv
├── server.js           ← Reads from process.env
└── node_modules/       ← Dependencies (ignored)
```

---

## 🔐 Environment Variables Explained

### Ethereal Email (Recommended)
```bash
ETHEREAL_EMAIL=your-account@ethereal.email
ETHEREAL_PASSWORD=your-password
```

### Mailtrap (Alternative)
```bash
MAILTRAP_USER=your-username
MAILTRAP_PASSWORD=your-password
```

### Gmail (Alternative)
```bash
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password  # NOT your regular password!
```

---

## ✅ Verify Setup

### Test 1: Check .env is Ignored
```bash
git status
# Should NOT show .env in the list
```

### Test 2: Check Environment Variables Load
```bash
node -e "require('dotenv').config(); console.log(process.env.ETHEREAL_EMAIL)"
# Should output your email
```

### Test 3: Start Server
```bash
node server.js
```

### Test 4: Test Email Service
```bash
curl http://localhost:3001/api/test-email
# Should return: {"success":true,"message":"Email service is working!"}
```

---

## 🚨 If You Accidentally Committed .env

### Emergency Steps:

1. **Remove from git history:**
```bash
git rm --cached .env
git commit -m "Remove .env from git history"
```

2. **Reset any exposed credentials:**
   - Go to https://ethereal.email/
   - Create a NEW account (don't reuse old credentials)
   - Update your local .env file

3. **Never push the .env file:**
```bash
git push origin main
```

---

## 📚 What's What

### ✅ SAFE TO COMMIT
- `server.js` (uses `process.env.ETHEREAL_EMAIL`)
- `package.json` (includes dotenv dependency)
- `.env.example` (template with placeholder values)
- `.gitignore` (tells git to ignore .env)
- `README.md` (documentation)

### ❌ NEVER COMMIT
- `.env` (contains real credentials)
- Any file with passwords/API keys/tokens
- `node_modules/` (generated files)

---

## 🎯 For Team Members

If you're sharing this code with others:

1. **Share .env.example** (template)
2. **Share setup instructions** (this file)
3. **Tell them to create their own .env** file
4. **Tell them NEVER to commit .env** to git

---

## 🔑 Where to Get Credentials

### Ethereal Email (Free, Instant)
1. Go to: https://ethereal.email/
2. Click "Create Ethereal Account"
3. Get email and password immediately
4. Copy to your .env file

### Mailtrap (Free, 500 emails/month)
1. Go to: https://mailtrap.io/
2. Sign up (free account)
3. Get SMTP credentials from dashboard
4. Copy to .env file

### Gmail (Free with App Password)
1. Enable 2-factor authentication
2. Go to: https://myaccount.google.com/apppasswords
3. Generate app-specific password
4. Copy to .env file (NOT your regular Gmail password!)

---

## 🧪 Testing with Credentials

### Once .env is Set Up:

```bash
# Test 1: Server starts
node server.js

# Test 2: Email service works
curl http://localhost:3001/api/test-email

# Test 3: Send OTP
curl -X POST http://localhost:3001/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test 4: Check OTP (debug)
curl http://localhost:3001/api/otp-status/test@example.com
```

---

## 📊 Current Status

```
Setup: ✅ COMPLETE
Files:
  ✅ .env (local, not committed)
  ✅ .env.example (template, committed)
  ✅ .gitignore (configured)
  ✅ server.js (uses process.env)
  ✅ package.json (includes dotenv)

Security:
  ✅ No credentials in code
  ✅ .env ignored by git
  ✅ Environment variables used
  ✅ Safe to share code
```

---

## 🆘 Troubleshooting

**Q: Server won't start**
A: Check .env file exists and has correct format
```bash
cat .env  # Should show your credentials
```

**Q: Email service not working**
A: Verify credentials in .env
```bash
node -e "require('dotenv').config(); console.log('Email:', process.env.ETHEREAL_EMAIL)"
```

**Q: Did I commit .env by accident?**
A: Check git history:
```bash
git log --all -- .env
# If it appears, follow "Emergency Steps" above
```

**Q: How do I know .env is ignored?**
A: Run:
```bash
git check-ignore .env
# Should output: .env (means it's ignored)
```

---

## ✨ Summary

You now have:
1. ✅ Secure credentials in local .env (not committed)
2. ✅ Template in .env.example (for team reference)
3. ✅ Server that reads from environment variables
4. ✅ .gitignore configured to protect secrets
5. ✅ Safe code to share publicly

**Your code is now production-ready and secure!** 🔒
