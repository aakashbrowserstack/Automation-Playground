/**
 * OTP Email Backend Server
 * 
 * Sends real OTP emails using Ethereal Email (free) or Mailtrap
 * 
 * Setup:
 * 1. npm install express nodemailer cors body-parser
 * 2. Get Ethereal credentials from https://ethereal.email/
 * 3. Update credentials below
 * 4. Run: node server.js
 * 5. Server runs on http://localhost:3001
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ==========================================
// EMAIL CONFIGURATION
// ==========================================
// Option 1: ETHEREAL EMAIL (Free, Recommended)
// Get credentials from: https://ethereal.email/
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'emmitt74@ethereal.email',
    pass: 'HzesPq282MNH8ZDKyD'
  }
});

// Option 2: MAILTRAP (Free tier, 500 emails/month)
// Uncomment below and comment above if using Mailtrap
// const transporter = nodemailer.createTransport({
//   host: 'smtp.mailtrap.io',
//   port: 465,
//   auth: {
//     user: 'your-mailtrap-username',
//     pass: 'your-mailtrap-password'
//   }
// });

// Option 3: GMAIL (Free, requires app password)
// Uncomment below and comment above if using Gmail
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'your-app-specific-password' // Generate at myaccount.google.com/apppasswords
//   }
// });

// ==========================================
// IN-MEMORY OTP STORE (For Testing Only)
// ==========================================
const otpStore = {};

// Test OTP validity before sending
app.get('/api/test-email', async (req, res) => {
  try {
    await transporter.verify();
    res.json({ success: true, message: 'Email service is working!' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Email service not configured properly',
      error: error.message 
    });
  }
});

// ==========================================
// ENDPOINT: Send OTP
// ==========================================
/**
 * POST /api/send-otp
 * Body: { email: "user@example.com" }
 * Returns: { success: true, message: "...", previewUrl: "..." }
 */
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📧 Generated OTP for ${email}: ${otp}`);

    // Prepare email
    const mailOptions = {
      from: 'noreply@testbed.local',
      to: email,
      subject: '🔐 Your OTP Code - QA Testbed',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2196f3; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .otp-box { 
              background: white; 
              border: 2px solid #2196f3; 
              padding: 20px; 
              text-align: center; 
              border-radius: 8px; 
              margin: 20px 0;
            }
            .otp-code { 
              font-size: 32px; 
              font-family: monospace; 
              letter-spacing: 4px; 
              color: #2196f3; 
              font-weight: bold; 
            }
            .footer { 
              background: #f5f5f5; 
              padding: 15px; 
              text-align: center; 
              font-size: 12px; 
              color: #999;
              border-radius: 0 0 8px 8px;
            }
            .warning { color: #ff9800; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔐 One-Time Password (OTP)</h2>
            </div>
            
            <div class="content">
              <p>Hello,</p>
              
              <p>You requested a one-time password for the QA Testbed. Your OTP code is:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>This code <span class="warning">expires in 10 minutes</span></li>
                <li>Do not share this code with anyone</li>
                <li>We will never ask you for this code via email</li>
              </ul>
              
              <p>If you didn't request this code, please ignore this email.</p>
              
              <p>Best regards,<br>QA Testbed Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message from the QA Testbed application.</p>
              <p>For testing purposes only - Not a real authentication system</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Store OTP (valid for 10 minutes)
    otpStore[email] = {
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
      maxAttempts: 5
    };

    console.log(`✅ Email sent successfully to ${email}`);

    // Generate preview URL (for Ethereal only)
    let previewUrl = null;
    if (process.env.NODE_ENV !== 'production') {
      try {
        previewUrl = nodemailer.getTestMessageUrl(info);
      } catch (e) {
        // Preview URL not available for non-Ethereal services
      }
    }

    res.json({
      success: true,
      message: `OTP sent to ${email}`,
      email: email,
      previewUrl: previewUrl, // Click to see email in browser (Ethereal only)
      expiresIn: 600 // seconds
    });

  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP. Check email configuration.',
      error: error.message 
    });
  }
});

// ==========================================
// ENDPOINT: Verify OTP
// ==========================================
/**
 * POST /api/verify-otp
 * Body: { email: "user@example.com", otp: "123456" }
 * Returns: { success: true, message: "..." }
 */
app.post('/api/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    // Check if OTP was sent to this email
    const stored = otpStore[email];
    if (!stored) {
      return res.status(400).json({ 
        success: false, 
        message: 'No OTP sent to this email. Send one first.' 
      });
    }

    // Check if OTP expired
    if (Date.now() > stored.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Request a new one.' 
      });
    }

    // Check attempt limit
    if (stored.attempts >= stored.maxAttempts) {
      delete otpStore[email];
      return res.status(429).json({ 
        success: false, 
        message: 'Too many failed attempts. Request a new OTP.' 
      });
    }

    // Verify OTP
    if (stored.otp !== otp) {
      stored.attempts++;
      const remaining = stored.maxAttempts - stored.attempts;
      return res.status(400).json({ 
        success: false, 
        message: `Invalid OTP. ${remaining} attempts remaining.` 
      });
    }

    // OTP verified successfully!
    console.log(`✅ OTP verified for ${email}`);
    delete otpStore[email];

    res.json({
      success: true,
      message: 'OTP verified successfully!',
      email: email,
      verified: true
    });

  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying OTP',
      error: error.message 
    });
  }
});

// ==========================================
// ENDPOINT: Resend OTP
// ==========================================
app.post('/api/resend-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email is required' 
    });
  }

  // Just send OTP again
  req.body = { email };
  return app._router.stack.find(r => r.route && r.route.path === '/api/send-otp').handle(req, res);
});

// ==========================================
// ENDPOINT: Get OTP Status (for debugging)
// ==========================================
app.get('/api/otp-status/:email', (req, res) => {
  const { email } = req.params;
  const stored = otpStore[email];

  if (!stored) {
    return res.json({ 
      success: false, 
      message: 'No OTP found for this email' 
    });
  }

  res.json({
    email: email,
    otp: stored.otp, // ⚠️ Only for testing!
    expiresAt: new Date(stored.expiresAt),
    expiresIn: Math.round((stored.expiresAt - Date.now()) / 1000),
    attempts: stored.attempts,
    maxAttempts: stored.maxAttempts
  });
});

// ==========================================
// ENDPOINT: Clear All OTPs (for testing)
// ==========================================
app.post('/api/clear-otps', (req, res) => {
  const count = Object.keys(otpStore).length;
  for (const email in otpStore) {
    delete otpStore[email];
  }
  res.json({ 
    success: true, 
    message: `Cleared ${count} OTPs` 
  });
});

// ==========================================
// HEALTH CHECK ENDPOINT
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'OTP Email Service',
    uptime: process.uptime(),
    otpCount: Object.keys(otpStore).length,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 3001;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║         🔐 OTP Email Backend Server               ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  console.log('');
  console.log('📧 Email Service Configuration:');
  console.log('   Provider: Ethereal Email (Free, Test Email)');
  console.log('   SMTP Host: smtp.ethereal.email:587');
  console.log('');
  console.log('📌 API Endpoints:');
  console.log(`   POST   /api/send-otp      - Send OTP to email`);
  console.log(`   POST   /api/verify-otp    - Verify OTP code`);
  console.log(`   POST   /api/resend-otp    - Resend OTP`);
  console.log(`   GET    /api/otp-status/:email - Check OTP status (debug)`);
  console.log(`   POST   /api/clear-otps    - Clear all OTPs (debug)`);
  console.log(`   GET    /api/health        - Server health check`);
  console.log('');
  console.log('🧪 Test in Browser:');
  console.log(`   Open: http://localhost:3000/v1/mfa.html`);
  console.log('');
  console.log('📚 Documentation:');
  console.log(`   Read: OTP_EMAIL_INTEGRATION_GUIDE.md`);
  console.log('');
});

module.exports = app;
