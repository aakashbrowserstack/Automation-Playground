#!/bin/bash

# OTP Email Backend - Quick Setup Script
# This script sets up the OTP email backend with Ethereal Email (free)

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║    OTP Email Backend - Quick Setup                ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Navigate to otp-server directory
cd "$(dirname "$0")/otp-server" || exit 1

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║         Next Steps:                               ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "1️⃣  Get Ethereal Email credentials:"
echo "   • Visit: https://ethereal.email/"
echo "   • Click 'Create Ethereal Account'"
echo "   • Copy your email and password"
echo ""
echo "2️⃣  Update credentials in server.js:"
echo "   • Edit: otp-server/server.js"
echo "   • Find lines with '← UPDATE THIS'"
echo "   • Paste Ethereal credentials"
echo ""
echo "3️⃣  Start the server:"
echo "   • Run: npm start"
echo "   • Or:  node server.js"
echo "   • Server will run on http://localhost:3001"
echo ""
echo "4️⃣  Test the integration:"
echo "   • Open: http://localhost:3000/v1/mfa.html"
echo "   • Enter email and send OTP"
echo "   • Verify OTP works"
echo ""
echo "📚 Documentation: OTP_EMAIL_INTEGRATION_GUIDE.md"
echo ""
