# OTP Email Integration - Setup Guide

## 🎯 Options for Free Real OTP Testing

### Option 1: **Ethereal Email** (✅ RECOMMENDED - Completely Free)
- **Cost:** Free forever
- **No Credit Card:** Not required
- **Setup Time:** 2 minutes
- **Perfect for:** QA testing, automation testing
- **Downside:** Fake email service (not real emails, but shows in browser)

### Option 2: **Mailtrap** (Free tier)
- **Cost:** Free for 500 emails/month
- **No Credit Card:** Not required (free tier)
- **Setup Time:** 5 minutes
- **Perfect for:** Testing with real inbox interface
- **Downside:** Limited emails per month

### Option 3: **Gmail** (Free but requires setup)
- **Cost:** Free (your own Gmail account)
- **Setup Time:** 10 minutes (needs app password)
- **Perfect for:** Real emails to your actual inbox
- **Downside:** Requires Gmail account + app password setup

---

## 🚀 Quick Start: Ethereal Email (Easiest)

### Step 1: Create Ethereal Account (30 seconds)
```bash
# No signup needed! Just use this command:
curl -X POST https://api.ethereal.email/users
```

Or visit: https://ethereal.email/ and click "Create Ethereal Account"

You'll get credentials like:
```
User: john.doe@ethereal.email
Pass: abc123xyz789
```

### Step 2: Install Node.js Backend

Create a new folder for the backend:

```bash
mkdir mega-testbed-backend
cd mega-testbed-backend
npm init -y
npm install express nodemailer cors body-parser
```

### Step 3: Create Backend Server

Create `server.js`:

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ==========================================
// ETHEREAL EMAIL CONFIG (Free, No Credit Card)
// ==========================================
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'your-ethereal-email@ethereal.email',  // Get from ethereal.email
    pass: 'your-ethereal-password'                // Get from ethereal.email
  }
});

// Store OTPs in memory (for testing only)
const otpStore = {};

// ==========================================
// ENDPOINT: Send OTP
// ==========================================
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Send email
    const info = await transporter.sendMail({
      from: 'noreply@testbed.local',
      to: email,
      subject: '🔐 Your OTP Code',
      html: `
        <h2>One-Time Password (OTP)</h2>
        <p>Your OTP code is:</p>
        <h1 style="color: #2196f3; font-family: monospace; letter-spacing: 2px;">
          ${otp}
        </h1>
        <p>This code expires in 10 minutes.</p>
        <p style="color: #999; font-size: 12px;">
          Do not share this code with anyone.
        </p>
      `
    });

    // Store OTP (expires in 10 minutes)
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    // For testing: log preview URL
    console.log(`OTP Preview: ${nodemailer.getTestMessageUrl(info)}`);

    res.json({
      success: true,
      message: `OTP sent to ${email}`,
      previewUrl: nodemailer.getTestMessageUrl(info) // Shows email in browser
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// ==========================================
// ENDPOINT: Verify OTP
// ==========================================
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP required' });
  }

  const stored = otpStore[email];

  if (!stored) {
    return res.status(400).json({ success: false, message: 'OTP not sent to this email' });
  }

  if (Date.now() > stored.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  // OTP verified!
  delete otpStore[email];
  res.json({ success: true, message: 'OTP verified successfully' });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📧 Using Ethereal Email for testing`);
  console.log(`\nTo see sent emails, check the preview URL returned by /api/send-otp`);
});
```

### Step 4: Update MFA Page to Use Backend

Update `v1/mfa.html` JavaScript section:

```javascript
// Change the sendOTP function to call backend:

async function sendOTP() {
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value.trim();
  const emailStatus = document.getElementById('emailStatus');

  // Validate email
  if (!email) {
    showStatus(emailStatus, 'Please enter your email address', 'error');
    emailInput.classList.add('error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showStatus(emailStatus, '❌ Invalid email format', 'error');
    emailInput.classList.add('error');
    return;
  }

  try {
    // Call backend to send OTP
    const response = await fetch('http://localhost:3001/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (data.success) {
      showStatus(emailStatus, `✅ OTP sent to ${email}`, 'success');
      emailInput.classList.add('success');

      // Show preview link if available
      if (data.previewUrl) {
        const link = document.createElement('a');
        link.href = data.previewUrl;
        link.target = '_blank';
        link.style.display = 'block';
        link.style.marginTop = '10px';
        link.textContent = '📧 Click here to see the email';
        emailStatus.parentElement.appendChild(link);
      }

      // Enable OTP input
      document.getElementById('otpInput').disabled = false;
      document.getElementById('verifyBtn').disabled = false;
      document.getElementById('resendBtn').disabled = false;

      // Update progress
      document.getElementById('step1').classList.add('completed');
      document.getElementById('step2').classList.add('active');

      startResendCountdown();
    } else {
      showStatus(emailStatus, `❌ ${data.message}`, 'error');
      emailInput.classList.add('error');
    }
  } catch (error) {
    showStatus(emailStatus, '❌ Error sending OTP', 'error');
    console.error('Error:', error);
  }
}

// Update verifyOTP to call backend:
async function verifyOTP() {
  const emailInput = document.getElementById('emailInput');
  const otpInput = document.getElementById('otpInput');
  const email = emailInput.value.trim();
  const enteredOTP = otpInput.value.trim();
  const otpStatus = document.getElementById('otpStatus');

  if (!enteredOTP) {
    showStatus(otpStatus, 'Please enter the OTP', 'error');
    otpInput.classList.add('error');
    return;
  }

  if (enteredOTP.length !== 6) {
    showStatus(otpStatus, 'OTP must be 6 digits', 'error');
    otpInput.classList.add('error');
    return;
  }

  try {
    // Call backend to verify OTP
    const response = await fetch('http://localhost:3001/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: enteredOTP })
    });

    const data = await response.json();

    if (data.success) {
      showStatus(otpStatus, '✅ Email verified successfully!', 'success');
      otpInput.classList.add('success');

      document.getElementById('step2').classList.add('completed');
      document.getElementById('step3').classList.add('active');

      otpInput.disabled = true;
      document.getElementById('verifyBtn').disabled = true;
      document.getElementById('resendBtn').disabled = true;
    } else {
      showStatus(otpStatus, `❌ ${data.message}`, 'error');
      otpInput.classList.add('error');
    }
  } catch (error) {
    showStatus(otpStatus, '❌ Error verifying OTP', 'error');
    console.error('Error:', error);
  }
}
```

### Step 5: Start Everything

**Terminal 1: Start Backend**
```bash
cd mega-testbed-backend
node server.js
# Output: ✅ Server running on http://localhost:3001
```

**Terminal 2: Start Testbed**
```bash
cd mega-testbed-v3.4
# Open in browser: http://localhost:3000/v1/mfa.html
```

### Step 6: Test End-to-End

1. Open `http://localhost:3000/v1/mfa.html`
2. Enter any email (e.g., test@example.com)
3. Click "Send OTP"
4. Click "📧 Click here to see the email" link
5. Copy OTP from the email preview
6. Paste into OTP field
7. Click "Verify OTP"
8. ✅ Success!

---

## 📊 Comparison of Options

| Feature | Ethereal | Mailtrap | Gmail |
|---------|----------|----------|-------|
| **Cost** | Free forever | Free (500/mo) | Free |
| **Setup** | 2 min | 5 min | 10 min |
| **Real Inbox** | No (but preview) | Yes | Yes |
| **Credit Card** | No | No | No |
| **Best for** | QA Testing | Integration Test | Production Test |
| **Recommendation** | ✅ Start here | Next option | Last resort |

---

## 🎯 My Recommendation

**Use Ethereal Email** because:

✅ Completely free (forever)  
✅ No credit card needed  
✅ No sign-up (auto-generated)  
✅ Preview URLs work perfectly for testing  
✅ 10-minute email expiry (realistic)  
✅ Fast setup (2 minutes)  

Once you're comfortable, upgrade to **Mailtrap** if you need a real inbox.

---

## 🔧 If You Want to Use Mailtrap Instead

1. Go to: https://mailtrap.io/
2. Sign up (free, no CC needed)
3. Get SMTP credentials from Mailtrap dashboard
4. Replace in `server.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 465,
  auth: {
    user: 'your-mailtrap-user',
    pass: 'your-mailtrap-password'
  }
});
```

---

## 📝 File Structure After Setup

```
mega-testbed-v3.4/
├── v1/
│   └── mfa.html (UPDATED with backend calls)
├── ...

mega-testbed-backend/
├── server.js (NEW - handle OTP logic)
├── package.json (NEW)
└── node_modules/
```

---

## ✅ Checklist

- [ ] Create Ethereal Email account
- [ ] Create `mega-testbed-backend` folder
- [ ] Run `npm install express nodemailer cors body-parser`
- [ ] Create `server.js` with Ethereal config
- [ ] Update `v1/mfa.html` with backend calls
- [ ] Start backend: `node server.js`
- [ ] Test on `http://localhost:3000/v1/mfa.html`
- [ ] Verify OTP flow works end-to-end

---

## 🆘 Troubleshooting

**Q: "Cannot POST /api/send-otp"**
A: Make sure backend is running on port 3001

**Q: "Failed to send OTP"**
A: Check Ethereal credentials are correct

**Q: "Connection refused"**
A: Backend not running - run `node server.js`

**Q: CORS errors**
A: CORS is enabled in server.js, should work fine

---

## 🎓 Learn More

- Ethereal: https://ethereal.email/
- Nodemailer: https://nodemailer.com/
- Mailtrap: https://mailtrap.io/

---

**Ready to set this up?** Let me know which option you prefer, and I can help with any steps!
