# NNPTUD User Import - Technical Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Application                      │
│                (Web/Postman/cURL)                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              POST /api/v1/users/import                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Middleware: CheckLogin, CheckRole("ADMIN")       │   │
│  │ 2. Multer: File upload & validation                 │   │
│  │ 3. importUsersFromFile(): Process users             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌────────────────┐  ┌──────────────┐
│ Read File    │  │ Generate Pass  │  │ Create User  │
│ (CSV/Excel)  │  │ (16 chars hex) │  │ (bcrypt)     │
└──────────────┘  └────────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Send Email   │
                   │ (Mailtrap)   │
                   └──────────────┘
```

## Function Details

### 1. generateRandomPassword()

```javascript
// Implementation
crypto.randomBytes(8).toString('hex')

// Output Format
// - Length: 16 characters
// - Format: Hexadecimal (0-9, a-f)
// - Example: "a1b2c3d4e5f6g7h8"

// Why 16 chars?
// - Security: 8 bytes = 64 bits entropy
// - Readability: Hex format
// - User-friendly: Easy to copy/paste
```

### 2. readUsersFromExcel(filePath)

```javascript
// Input: Path to .xlsx/.xls file
// Output: Array of {username, email}

// Process:
// 1. Load workbook using ExcelJS
// 2. Get first worksheet
// 3. Iterate rows (skip header)
// 4. Extract columns: A=username, B=email
// 5. Validate data not empty

// Error Handling:
// - File not found
// - Invalid format
// - Invalid sheet structure
```

### 3. readUsersFromCSV(filePath)

```javascript
// Input: Path to .csv file
// Output: Array of {username, email}

// CSV Format Expected:
// username,email
// student001,student001@example.com
// student002,student002@example.com

// Process:
// 1. Read file content
// 2. Split by newline
// 3. Skip header row
// 4. Parse each line
// 5. Extract username and email

// Error Handling:
// - File read error
// - Invalid CSV format
// - Missing columns
```

### 4. importUsersFromFile(filePath, roleId, userController, mailHandler)

```javascript
// Main orchestrator function

// Process Flow:
// 1. Detect file type (xlsx vs csv)
// 2. Read users from file
// 3. For each user:
//    a. Generate random password
//    b. Create user in DB
//    c. Send email with password
//    d. Collect result (success/failed)
// 4. Return summary

// Error Handling:
// - Each user failure doesn't stop others
// - Return detailed failed user list
// - Log all errors

// Return Format:
{
  "success": true,
  "createdUsers": [...],
  "failedUsers": [...],
  "summary": {
    "total": 5,
    "created": 4,
    "failed": 1
  }
}
```

## API Endpoint Details

### POST /api/v1/users/import

```
Request:
  - Method: POST
  - Content-Type: multipart/form-data
  - Auth: JWT Token + ADMIN role required

Parameters:
  - file: Binary file (.csv or .xlsx)
  - roleId: String (ObjectId of user role)

Response (Success - 200):
{
  "success": true,
  "message": "Users imported successfully",
  "data": {
    "createdUsers": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "username": "student001",
        "email": "student001@example.com",
        "password": "a1b2c3d4e5f6g7h8",
        "message": "User created and email sent successfully"
      }
    ],
    "failedUsers": [],
    "summary": {
      "total": 1,
      "created": 1,
      "failed": 0
    }
  }
}

Response (Error - 400):
{
  "success": false,
  "message": "Error message here"
}

Response (Auth Error - 401/403):
{
  "message": "Unauthorized"
}
```

## Database Schema Changes

### Users Collection

```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  password: String (required, hashed with bcrypt),
  email: String (required, unique),
  fullName: String,
  avatarUrl: String,
  status: Boolean,
  role: ObjectId (ref: role),
  loginCount: Number,
  lockTime: Date,
  isDeleted: Boolean,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Email Template

### HTML Template

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Thông tin tài khoản của bạn</h2>
  <p>Xin chào,</p>
  <p>Tài khoản của bạn đã được tạo thành công trên hệ thống NNPTUD.</p>
  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <pre>Username: student001
Password: a1b2c3d4e5f6g7h8
Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu tiên.</pre>
  </div>
</div>
```

## Security Considerations

### 1. Password Hashing

```javascript
// Bcrypt Configuration in schema
userSchema.pre('save', function () {
  if (this.isModified('password')) {
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
})
```

- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Time Complexity**: ~100ms per hash
- **Cannot reverse**: No way to get plain password from hash

### 2. Email Security

- Passwords sent via SMTP (encrypted if using TLS)
- Passwords never logged to console
- Each user gets unique password
- Temporary access only until password change

### 3. File Upload Security

```javascript
// Validation in multer
fileFilter: (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.xlsx', '.xls', '.csv'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .xlsx, .xls, and .csv files are allowed'));
  }
}
```

- Only allow specific file types
- Store in uploads directory
- Delete after processing
- Validate before processing

### 4. Access Control

- Requires valid JWT token
- Requires ADMIN role
- Middleware checks both

## Performance Optimization

### 1. Parallel Processing

```javascript
// Current: Sequential processing per user
for (const userData of users) {
  // Create user
  // Send email
}

// Optimization: Process multiple users concurrently
Promise.all(users.map(userData => processUser(userData)))
```

### 2. Batch Email Sending

```javascript
// Optimization: Send emails in batches
const batchSize = 10;
for (let i = 0; i < users.length; i += batchSize) {
  await Promise.all(
    users.slice(i, i + batchSize).map(u => sendEmail(u))
  )
}
```

### 3. Database Optimization

```javascript
// Add index on email and username for faster lookups
db.users.createIndex({ email: 1 })
db.users.createIndex({ username: 1 })
```

## Monitoring & Logging

### Log Examples

```
✓ User imported: student001 (email: student001@example.com)
✓ Email sent: Message ID: abc123xyz
✗ User creation failed: student002 - Duplicate username
✗ Email send failed: student003 - Invalid email format
```

### Metrics to Track

- Total users imported
- Success rate
- Failure reasons
- Average processing time
- Email delivery rate

## Testing Checklist

- [ ] Import CSV with valid data
- [ ] Import Excel with valid data
- [ ] Test with invalid file format
- [ ] Test with empty file
- [ ] Test with duplicate usernames
- [ ] Test with invalid emails
- [ ] Verify password generation (16 chars)
- [ ] Verify email sent (check Mailtrap)
- [ ] Verify password hashed in DB
- [ ] Test without auth token
- [ ] Test with non-ADMIN role
- [ ] Test with missing roleId

## Future Enhancements

1. **Batch Processing**
   - Handle large files (10K+ users)
   - Progress tracking
   - Resume on failure

2. **Advanced Validation**
   - Email format validation
   - Username format validation
   - Duplicate detection before processing

3. **Notification System**
   - Admin notification on completion
   - Failed users report
   - Import history tracking

4. **Multiple Email Service Support**
   - AWS SES
   - SendGrid
   - Gmail API

5. **User Activity Tracking**
   - Import audit log
   - User creation source
   - Password change history
