<!-- Mailtrap Email Screenshots & Instructions -->

# Mailtrap Email Configuration - Visual Guide

## What is Mailtrap?

Mailtrap is a **free email testing service** that captures and displays emails sent from your application during development. It's perfect for testing email functionality without actually sending to real users.

### Key Features:
- ✅ Free plan with 500 emails/month
- ✅ Professional HTML/Plain text display
- ✅ Email headers inspection
- ✅ Spam score checking
- ✅ SMTP & API integration
- ✅ Multiple inboxes support
- ✅ Email log retention (7 days free)

---

## Step-by-Step Setup

### 1️⃣ Create Mailtrap Account

**Go to:** https://mailtrap.io

```
┌─────────────────────────────────────────────┐
│  Sign Up / Try for Free                     │
├─────────────────────────────────────────────┤
│  Email: your.email@example.com              │
│  Password: ••••••••••••                      │
│  [Create Account Button]                    │
└─────────────────────────────────────────────┘
```

### 2️⃣ Create Your First Inbox

**Dashboard → Add Inbox**

```
┌──────────────────────────────────┐
│ + Add Inbox                      │
├──────────────────────────────────┤
│ Inbox Name: NNPTUD Development   │
│ Type: Personal Account           │
│ [Create Button]                  │
└──────────────────────────────────┘
```

### 3️⃣ Get SMTP Credentials

**Inbox → Settings → Integrations → Nodemailer**

```
┌─────────────────────────────────────────────────────┐
│ MAILTRAP SMTP SETTINGS FOR NODEMAILER               │
├─────────────────────────────────────────────────────┤
│ Host:       sandbox.smtp.mailtrap.io                │
│ Port:       2525 (or 25, 465, 587)                  │
│ Username:   [Your Username Here]                    │
│ Password:   [Your Password Here]                    │
│ TLS:        Optional                                │
└─────────────────────────────────────────────────────┘
```

**Example Code:**
```javascript
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "abc123def456",      // Copy from Mailtrap
    pass: "xyz789qwe123"        // Copy from Mailtrap
  }
});
```

### 4️⃣ Configure .env File

**Create `.env` in project root:**

```env
# Mailtrap Settings
MAILTRAP_USER=abc123def456
MAILTRAP_PASS=xyz789qwe123

# MongoDB
MONGODB_URL=mongodb://localhost:27017/NNPTUD-S3

# JWT
JWT_SECRET=secretKey

# Server
PORT=3000
```

### 5️⃣ Load .env in Your App

**In `app.js` or main entry:**

```javascript
require('dotenv').config(); // Add this line first

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});
```

---

## Viewing Emails in Mailtrap

### 📧 Email Received in Inbox

```
┌─────────────────────────────────────────────────────┐
│ NNPTUD Development Inbox                            │
├─────────────────────────────────────────────────────┤
│ □ From: Admin NNPTUD <admin@nnptud.com>             │
│   To: student001@example.com                        │
│   Subject: Thông tin tài khoản - NNPTUD System      │
│   Date: 2026-04-02 10:30:45 UTC                     │
│   [View Details]                                    │
│                                                     │
│ □ From: Admin NNPTUD <admin@nnptud.com>             │
│   To: student002@example.com                        │
│   Subject: Thông tin tài khoản - NNPTUD System      │
│   Date: 2026-04-02 10:31:12 UTC                     │
│   [View Details]                                    │
└─────────────────────────────────────────────────────┘
```

### 📄 Email Content Display

```
┌──────────────────────────────────────────────────────┐
│ Email Details                                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│ From: Admin NNPTUD <admin@nnptud.com>               │
│ To: student001@example.com                          │
│ Subject: Thông tin tài khoản - NNPTUD System        │
│ Date: Wed, 02 Apr 2026 10:30:45 +0000              │
│ Size: 2.3 KB                                        │
│                                                      │
│ ┌────────────────────────────────────────────────┐ │
│ │ HTML View                                      │ │
│ ├────────────────────────────────────────────────┤ │
│ │                                                │ │
│ │ Thông tin tài khoản của bạn                   │ │
│ │                                                │ │
│ │ Xin chào,                                      │ │
│ │                                                │ │
│ │ Tài khoản của bạn đã được tạo thành công     │ │
│ │ trên hệ thống NNPTUD.                         │ │
│ │                                                │ │
│ │ ┌──────────────────────────────────────────┐ │ │
│ │ │ Username: student001                     │ │ │
│ │ │ Password: a1b2c3d4e5f6g7h8               │ │ │
│ │ │                                          │ │ │
│ │ │ Vui lòng đổi mật khẩu sau khi đăng nhập│ │ │
│ │ │ lần đầu tiên.                           │ │ │
│ │ └──────────────────────────────────────────┘ │ │
│ │                                                │ │
│ │ Email này được gửi tự động. Vui lòng không   │ │
│ │ trả lời email này.                           │ │
│ │                                                │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ [HTML] [Plain Text] [Headers] [Attachments]        │
└──────────────────────────────────────────────────────┘
```

### 📋 Email Headers

```
┌──────────────────────────────────────────────────────┐
│ Email Headers                                        │
├──────────────────────────────────────────────────────┤
│ Return-Path: <noreply@mailtrap.io>                  │
│ Received: from sandbox.smtp.mailtrap.io             │
│           by app-001.sandbox.mailtrap.io with SMTP  │
│           id f3c2b1a0-9e8d-7c6b-5a4f-3e2d1c0b9a8   │
│ From: "Admin NNPTUD" <admin@nnptud.com>             │
│ To: student001@example.com                          │
│ Date: Wed, 02 Apr 2026 10:30:45 +0000              │
│ Subject: Thông tin tài khoản - NNPTUD System        │
│ MIME-Version: 1.0                                   │
│ Content-Type: text/html; charset=UTF-8             │
└──────────────────────────────────────────────────────┘
```

---

## Testing the Import Feature

### 1️⃣ Start Your Application

```bash
# Terminal
npm install
npm start

# Output
> nodemon ./bin/www
> NNPTUD-S3@0.0.0 start
> Listening on port 3000
```

### 2️⃣ Send Import Request

**Using PowerShell:**

```powershell
$JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
$ROLE_ID = "507f1f77bcf86cd799439011"

$form = @{
    file = Get-Item "samples/users_sample.csv"
    roleId = $ROLE_ID
}

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/users/import" `
    -Method Post `
    -Headers @{"Authorization" = $JWT} `
    -Form $form
```

### 3️⃣ Check Mailtrap Inbox

```
✅ Refresh Mailtrap Dashboard
✅ Should see 5-6 new emails (one for each user)
✅ Click each email to verify:
   - Username and password are correct
   - Password is 16 characters
   - Email formatting looks good
```

---

## Common Issues & Solutions

### ❌ Issue: "Invalid login"
```
Error: Invalid login credentials
Cause: Wrong username or password
Fix: 
  1. Go to Mailtrap Dashboard
  2. Copy credentials again carefully
  3. Update .env file
  4. Restart application
```

### ❌ Issue: Connection timeout
```
Error: Socket timeout
Cause: Wrong port or network issue
Fix:
  1. Try port 2525 (default)
  2. Check internet connection
  3. Check firewall settings
```

### ❌ Issue: Emails not appearing
```
Error: No emails in inbox
Cause: Email not actually sent or goes to spam
Fix:
  1. Check app console for errors
  2. Verify MAILTRAP_USER and MAILTRAP_PASS
  3. Check "Spam" folder in Mailtrap
```

### ❌ Issue: "Port 25 blocked"
```
Error: Cannot connect to port 25
Cause: ISP or firewall blocks port 25
Fix:
  1. Use port 2525 instead (in Mailtrap)
  2. Try port 587 with TLS
  3. Try port 465 with SSL
```

---

## Moving to Production

### ⚠️ IMPORTANT: Mailtrap is NOT for Production!

**For Production Email Service, use:**

1. **SendGrid** - Reliable, affordable
   ```javascript
   host: "smtp.sendgrid.net"
   port: 587
   auth: {
     user: "apikey",
     pass: "SG.xxxxx..." // SendGrid API key
   }
   ```

2. **AWS SES** - AWS ecosystem integration
   ```javascript
   // Use aws-sdk-v3
   const sesClient = new SESClient({});
   ```

3. **Gmail API** - For small volume
   ```javascript
   host: "smtp.gmail.com"
   port: 587
   auth: {
     user: "your-email@gmail.com",
     pass: "app_specific_password" // NOT regular password
   }
   ```

4. **Mailgun** - Developer-friendly
   ```javascript
   host: "smtp.mailgun.org"
   port: 25
   ```

---

## Tips & Best Practices

### ✅ Development Best Practices

1. **Use `.env` for credentials**
   ```javascript
   require('dotenv').config();
   user: process.env.MAILTRAP_USER
   ```

2. **Add `.env` to `.gitignore`**
   ```
   .env
   .env.local
   ```

3. **Test email formatting**
   - Use real-looking sample data
   - Check HTML rendering in different clients
   - Verify attachment handling

4. **Monitor Mailtrap quota**
   - Free plan: 500 emails/month
   - Check remaining quota weekly
   - Archive old emails if needed

5. **Use meaningful subject lines**
   - Makes debugging easier
   - Example: "Password Reset - NNPTUD"

---

## Links & Resources

- **Mailtrap Official:** https://mailtrap.io
- **Nodemailer Docs:** https://nodemailer.com
- **SMTP Troubleshooting:** https://mailtrap.io/blog/
- **Email Best Practices:** https://www.mailgun.com/blog/

---

## Screenshot Locations

When demonstrating the feature, capture:

1. **Mailtrap Dashboard:**
   - Inbox list view
   - Show multiple emails received

2. **Email Content:**
   - HTML view showing password
   - Plain text version

3. **Email Headers:**
   - Sender information
   - Date/time received

4. **Terminal Output:**
   - Node.js console showing import log
   - Success/failure messages

5. **Postman/cURL Request:**
   - Request headers with JWT
   - File upload form
   - Response JSON

---

