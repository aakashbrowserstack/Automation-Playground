# 🚀 LCNC OTP Testing Guide - BrowserStack Integration

## 📋 Overview

This guide explains how to test the OTP (One-Time Password) flow using **LCNC (BrowserStack Automate)** with **temp emails from BrowserStack inbox**.

---

## 🔑 Key Concept: Temp Email Integration

### What is Temp Email?
BrowserStack provides temporary email addresses for testing:
```
temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com
```

**Benefits:**
- ✅ Emails sent to temp address arrive in BrowserStack inbox
- ✅ Can extract OTP from email programmatically
- ✅ No real email setup needed for testing
- ✅ Perfect for automation testing

---

## 🎯 Step-by-Step LCNC Testing Flow

### Step 1: Record Action - Enter Temp Email

**In LCNC Recording Mode:**

```
1. Navigate to: http://localhost:3000/v1/mfa.html
   (Or: https://aakashbrowserstack.github.io/Automation-Playground/v1/mfa.html)

2. Click on Email Input Field
   - Element gets recorded: #emailInput or [data-testid="email-input"]

3. Type Temp Email:
   temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com

4. Click "Send OTP" Button
   - Element: [data-testid="btn-send-otp"]
```

**LCNC Records:**
```javascript
// Recorded action
click(emailInput)
type("temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com")
click(sendOtpBtn)
wait(2000) // Wait for email
```

---

### Step 2: Extract OTP from BrowserStack Inbox

**Two Methods:**

#### Method A: Manual Extraction (During Recording)
```
1. Open new tab: https://www.bstackinbox.com/
2. Login with same temp email
3. Check inbox for OTP email
4. Copy OTP (6-digit code)
5. Switch back to test tab
6. Paste OTP into OTP input field
7. Click Verify
```

#### Method B: Programmatic Extraction (Recommended for LCNC)
```javascript
// Get OTP from BrowserStack API
const bstackInboxUrl = "https://api.bstackinbox.com/v1/inbox";
const email = "temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com";

fetch(`${bstackInboxUrl}/${email}`)
  .then(res => res.json())
  .then(data => {
    // Get latest email
    const latestEmail = data.mails[0];
    // Extract OTP from email body (e.g., using regex)
    const otpMatch = latestEmail.body.match(/(\d{6})/);
    const otp = otpMatch[1];
    
    // Use in test
    enterOTP(otp);
    clickVerify();
  });
```

---

## 🔄 Complete LCNC Test Scenario

### Scenario: Full OTP Verification Flow

**Preconditions:**
- ✅ Temp email ready: `temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com`
- ✅ BrowserStack Automate session active
- ✅ Network access to BrowserStack inbox

**Test Steps:**

```
STEP 1: Launch Application
├─ Navigate to: https://aakashbrowserstack.github.io/Automation-Playground/v1/mfa.html
└─ Wait for page load ✓

STEP 2: Enter Email
├─ Click: [data-testid="email-input"]
├─ Type: temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com
└─ Verify: Email field shows value ✓

STEP 3: Send OTP
├─ Click: [data-testid="btn-send-otp"]
├─ Wait: 2 seconds for email delivery
├─ Verify: Status shows "✅ OTP sent to..."
└─ Verify: OTP display box appears ✓

STEP 4: Extract OTP from Email
├─ Option A (Manual): 
│   ├─ Open: https://www.bstackinbox.com/
│   ├─ Check inbox for OTP email
│   └─ Copy OTP (6 digits)
│
├─ Option B (API):
│   ├─ Call BrowserStack inbox API
│   ├─ Parse email body for OTP
│   └─ Extract 6-digit code
└─ ✓ OTP extracted

STEP 5: Enter OTP
├─ Click: [data-testid="otp-input"]
├─ Type: <extracted-otp>
└─ Verify: Input shows 6 digits ✓

STEP 6: Verify OTP
├─ Click: [data-testid="btn-verify-otp"]
├─ Wait: 1 second for verification
├─ Verify: Status shows "✅ Email verified successfully!"
├─ Verify: Progress indicator shows step 3 completed
└─ ✓ Verification successful

STEP 7: Validate Results
├─ Step 1 (Email): ✅ COMPLETED (green)
├─ Step 2 (OTP): ✅ COMPLETED (green)
├─ Step 3 (Verify): ✅ COMPLETED (green)
└─ Overall Status: ✅ PASS
```

---

## 🎬 LCNC Recording Checklist

### Before Recording
- [ ] Temp email address ready
- [ ] BrowserStack Automate session started
- [ ] Element inspection enabled
- [ ] Network access to temp email service confirmed
- [ ] Test URL verified: `/v1/mfa.html`

### During Recording
- [ ] Email input captured with data-testid
- [ ] Send OTP button captured
- [ ] OTP input field captured
- [ ] Verify button captured
- [ ] Wait times added (2-3 seconds for email)
- [ ] Assertions added for status messages

### After Recording
- [ ] Play back test without recording
- [ ] Verify all elements located correctly
- [ ] Verify email received in BrowserStack inbox
- [ ] Verify OTP extracted successfully
- [ ] Verify final status shows success

---

## 🧪 Element Selection for LCNC Testing

### All Required Elements (Data Attributes)

**Email Section:**
```html
<!-- Input -->
<input 
  id="emailInput" 
  class="form-input"
  data-testid="email-input"
  type="email"
/>

<!-- Send Button -->
<button 
  id="sendOtpBtn"
  data-testid="btn-send-otp"
  onclick="sendOTP()"
>
  📧 Send OTP
</button>

<!-- Status Message -->
<div 
  id="emailStatus"
  data-testid="email-status"
  class="status-message"
></div>
```

**OTP Section:**
```html
<!-- OTP Input -->
<input 
  id="otpInput"
  class="form-input"
  data-testid="otp-input"
  type="text"
  maxlength="6"
  pattern="[0-9]{6}"
/>

<!-- Verify Button -->
<button 
  id="verifyBtn"
  data-testid="btn-verify-otp"
  onclick="verifyOTP()"
>
  ✓ Verify OTP
</button>

<!-- Resend Button -->
<button 
  id="resendBtn"
  data-testid="btn-resend-otp"
  onclick="resendOTP()"
>
  Resend
</button>

<!-- Status Message -->
<div 
  id="otpStatus"
  data-testid="otp-status"
  class="status-message"
></div>
```

**Progress Indicator:**
```html
<div class="progress-indicator">
  <div class="progress-step active" id="step1">1. Email</div>
  <div class="progress-step" id="step2">2. OTP</div>
  <div class="progress-step" id="step3">3. Verify</div>
</div>
```

### Element Locators for LCNC

**Recommended (Most Reliable):**
```
data-testid="email-input"       → Email field
data-testid="btn-send-otp"      → Send OTP button
data-testid="otp-input"         → OTP input field
data-testid="btn-verify-otp"    → Verify button
data-testid="btn-resend-otp"    → Resend button
data-testid="email-status"      → Email status message
data-testid="otp-status"        → OTP status message
```

**Alternative (CSS Selectors):**
```
#emailInput     → Email field
#sendOtpBtn     → Send OTP button
#otpInput       → OTP input field
#verifyBtn      → Verify button
#resendBtn      → Resend button
#emailStatus    → Email status
#otpStatus      → OTP status
```

**Alternative (XPath):**
```
//input[@data-testid='email-input']
//button[@data-testid='btn-send-otp']
//input[@data-testid='otp-input']
//button[@data-testid='btn-verify-otp']
```

---

## 🔧 LCNC Action Mapping

### Common LCNC Actions

```
Action          | Code                  | Purpose
────────────────┼──────────────────────┼─────────────────────
Click           | click(selector)       | Click buttons/links
Type            | type(text)            | Enter text in fields
Wait            | wait(milliseconds)    | Wait for elements
Get Value       | getValue(selector)    | Get input value
Assert          | assert(condition)     | Verify expectations
Scroll          | scroll(selector)      | Scroll to element
Clear           | clear(selector)       | Clear input field
```

### Example LCNC Script

```javascript
// OTP Verification Flow in LCNC
async function testOTPVerification() {
  // Step 1: Enter Email
  await click('[data-testid="email-input"]');
  await type('temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com');
  
  // Step 2: Send OTP
  await click('[data-testid="btn-send-otp"]');
  await wait(2000);
  
  // Step 3: Verify Status
  const emailStatus = await getValue('[data-testid="email-status"]');
  assert(emailStatus.includes('OTP sent'));
  
  // Step 4: Extract OTP
  const otp = await extractOTPFromEmail('temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com');
  
  // Step 5: Enter OTP
  await click('[data-testid="otp-input"]');
  await type(otp);
  
  // Step 6: Verify OTP
  await click('[data-testid="btn-verify-otp"]');
  await wait(1000);
  
  // Step 7: Assert Success
  const otpStatus = await getValue('[data-testid="otp-status"]');
  assert(otpStatus.includes('verified successfully'));
  
  console.log('✅ OTP Test Passed');
}

async function extractOTPFromEmail(email) {
  // Call BrowserStack Inbox API
  const response = await fetch(`https://api.bstackinbox.com/v1/inbox/${email}`);
  const data = await response.json();
  
  // Get latest email
  const latestEmail = data.mails[0];
  
  // Extract 6-digit OTP
  const match = latestEmail.body.match(/(\d{6})/);
  return match ? match[1] : null;
}
```

---

## ✅ Test Validation Checklist

### Email Section
- [ ] Email input accepts valid email
- [ ] Email input rejects invalid format
- [ ] Status message shows success (✅ OTP sent)
- [ ] Progress step 1 turns green (completed)
- [ ] Progress step 2 becomes active (blue)
- [ ] OTP input field becomes enabled

### OTP Section
- [ ] OTP input accepts 6 digits only
- [ ] OTP input rejects non-numeric characters
- [ ] Status message shows on invalid OTP (❌ Invalid OTP)
- [ ] Status message shows on valid OTP (✅ Email verified)
- [ ] Resend button works (resets 30-second timer)
- [ ] Progress steps update correctly

### Email Delivery
- [ ] Temp email receives OTP within 2-3 seconds
- [ ] Email contains 6-digit OTP code
- [ ] Email contains expiry warning (10 minutes)
- [ ] Email contains security notice
- [ ] OTP can be extracted programmatically

### End-to-End
- [ ] All 3 progress steps show completed (green)
- [ ] OTP input disabled after successful verification
- [ ] Verify button disabled after successful verification
- [ ] Overall test status: ✅ PASS

---

## 🚀 Testing Commands in LCNC

### Command: Record Test
```bash
# In LCNC Console
record()
  .navigate('https://aakashbrowserstack.github.io/Automation-Playground/v1/mfa.html')
  .click('[data-testid="email-input"]')
  .type('temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com')
  .click('[data-testid="btn-send-otp"]')
  .wait(3000)
  .click('[data-testid="otp-input"]')
  .type('123456')
  .click('[data-testid="btn-verify-otp"]')
  .verify('[data-testid="otp-status"]', 'verified successfully')
```

### Command: Play Back Test
```bash
# In LCNC Console
playback('otp_verification_test')
```

### Command: Assert Elements
```bash
# Verify all elements present
assert.element('[data-testid="email-input"]', 'exists')
assert.element('[data-testid="btn-send-otp"]', 'exists')
assert.element('[data-testid="otp-input"]', 'exists')
assert.element('[data-testid="btn-verify-otp"]', 'exists')
```

---

## 📊 Test Report Template

```
╔═══════════════════════════════════════════════════════════╗
║           OTP VERIFICATION TEST REPORT                    ║
╚═══════════════════════════════════════════════════════════╝

Date: [DATE]
Tester: [NAME]
Environment: LCNC (BrowserStack Automate)
Browser: Chrome (Latest)
Temp Email: temp_1773137651.6751688_9e910c76@preprod.bstackinbox.com

TEST RESULTS:
─────────────────────────────────────────────────────────────

✅ Email Input
   ├─ Valid email accepted: PASS
   ├─ Invalid email rejected: PASS
   └─ Data captured correctly: PASS

✅ Send OTP
   ├─ Button click recorded: PASS
   ├─ Status message appears: PASS
   ├─ Email delivery: 2.3 seconds
   └─ Email received in inbox: PASS

✅ OTP Extraction
   ├─ Email found in inbox: PASS
   ├─ OTP parsed correctly: PASS
   ├─ OTP Format (6 digits): PASS
   └─ OTP Valid: 123456

✅ OTP Verification
   ├─ OTP input accepted: PASS
   ├─ Verification successful: PASS
   ├─ Status message shows: PASS
   └─ Progress updated: PASS

OVERALL RESULT: ✅ PASS (All scenarios working)

Notes:
- All elements located successfully via data-testid
- Email delivery time acceptable (<3 seconds)
- OTP extraction working correctly
- Progress indicator updates as expected
```

---

## 🔗 Quick Links

**Test Page:**
- Local: `http://localhost:3000/v1/mfa.html`
- Live: `https://aakashbrowserstack.github.io/Automation-Playground/v1/mfa.html`

**Element Reference:**
- All elements use `data-testid` attributes (LCNC preferred)
- Fallback: ID selectors (`#emailInput`, `#otpInput`, etc.)

**Temp Email Service:**
- BrowserStack Inbox: `https://www.bstackinbox.com/`
- API: `https://api.bstackinbox.com/v1/inbox/[email]`

---

## ❓ FAQ

**Q: How long is temp email valid?**
A: Temp emails are valid for the duration of your test session (usually 24 hours).

**Q: Can I reuse same temp email?**
A: Yes, inbox accumulates all emails sent to that address.

**Q: How to extract OTP programmatically?**
A: Use BrowserStack Inbox API or parse email body with regex: `/(\d{6})/`

**Q: What if email doesn't arrive?**
A: Check network access, verify email address, wait 3-5 seconds, check spam folder.

**Q: Can I test without temp email?**
A: Yes, OTP displays in blue box for manual testing (not for production).

---

**Status:** ✅ Complete and ready for LCNC testing  
**Last Updated:** March 10, 2026  
**Version:** 1.0
