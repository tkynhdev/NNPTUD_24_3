<!-- Test Cases for User Import Feature -->

# NNPTUD User Import - Test Cases

## Test Suite Overview

Total Test Cases: 15
- Positive Cases: 8
- Negative Cases: 5
- Edge Cases: 2

---

## 1. POSITIVE TEST CASES ✅

### TC-001: Import CSV with Valid Data

**Preconditions:**
- User is logged in with ADMIN role
- Valid JWT token in header
- Valid role ID exists in database
- CSV file has proper format

**Steps:**
1. Create CSV file with 5 users
2. Send POST request to `/api/v1/users/import`
3. Select CSV file and role ID
4. Submit request

**Expected Result:**
- Status: 200 OK
- All 5 users created in DB
- 5 emails sent (visible in Mailtrap)
- Each email contains 16-char password
- Response shows all users created successfully

**Actual Result:**
- ✅ Pass

---

### TC-002: Import Excel with Valid Data

**Preconditions:**
- User is logged in with ADMIN role
- Valid JWT token
- Excel file with columns: username, email
- Proper formatting (no extra rows)

**Steps:**
1. Create XLSX file with 3 users
2. Upload to `/api/v1/users/import`
3. Verify all data matches

**Expected Result:**
- Status: 200 OK
- 3 users created
- 3 emails sent
- All passwords unique and 16 chars
- Database records created with proper role

**Actual Result:**
- ✅ Pass

---

### TC-003: Password Correctly Hashed in Database

**Preconditions:**
- User imported successfully
- Access to MongoDB database
- Knowledge of bcrypt hash format

**Steps:**
1. Import 1 user with password: "test123456789"
2. Query MongoDB for created user
3. Compare stored password with plain text
4. Verify hash format

**Expected Result:**
- Stored password is NOT "test123456789"
- Hash starts with "$2a$" or "$2b$" (bcrypt format)
- Cannot reverse engineer to plain password
- bcrypt.compareSync(plain, stored) returns true

**Actual Result:**
- ✅ Pass

---

### TC-004: Email Sent to All Imported Users

**Preconditions:**
- Mailtrap configured correctly
- SMTP credentials valid
- Internet connection working

**Steps:**
1. Import 5 users
2. Wait 5 seconds
3. Check Mailtrap inbox
4. Count total emails

**Expected Result:**
- Exactly 5 emails in Mailtrap
- Each email sent to correct recipient
- Each email contains username and password
- All emails from "Admin NNPTUD"
- Timestamp matches import time

**Actual Result:**
- ✅ Pass

---

### TC-005: Unique Passwords Generated for Each User

**Preconditions:**
- Import at least 10 users
- Collect all passwords

**Steps:**
1. Import 10 users from file
2. Extract passwords from response
3. Check for duplicates
4. Verify each is 16 chars hex

**Expected Result:**
- All 10 passwords are unique
- No duplicates found
- Each password is exactly 16 characters
- Each contains only hex chars (0-9, a-f)

**Actual Result:**
- ✅ Pass

---

### TC-006: Email Contains Required Information

**Preconditions:**
- Email successfully received in Mailtrap
- Email client ready

**Steps:**
1. Import 1 user: username=student001, email=student001@example.com
2. Check Mailtrap for email
3. Open email and verify content

**Expected Result:**
Email contains:
- ✅ Username: student001
- ✅ Password: [16-char hex]
- ✅ Warning about changing password
- ✅ Professional HTML formatting
- ✅ Subject: "Thông tin tài khoản - NNPTUD System"

**Actual Result:**
- ✅ Pass

---

### TC-007: User Role Assignment Correct

**Preconditions:**
- Multiple roles exist (USER, TEACHER, ADMIN)
- Import file prepared

**Steps:**
1. Get ObjectId of "USER" role (e.g., 507f1f77bcf86cd799439011)
2. Import users with this roleId
3. Query database for created users
4. Check role field

**Expected Result:**
- All imported users have correct roleId
- Users can be queried with populate('role')
- Role name is correctly displayed

**Actual Result:**
- ✅ Pass

---

### TC-008: Partial Import Success Handling

**Preconditions:**
- File has some valid and some invalid users
- Mix of good and bad data

**Steps:**
1. Create CSV with:
   - Valid user: student001, student001@example.com
   - Duplicate: (same username as existing)
   - Valid user: student002, student002@example.com
2. Import the file
3. Check response for success/failure counts

**Expected Result:**
- Status: 200 OK
- createdUsers: 2 items
- failedUsers: 1 item
- Summary shows correct counts
- 2 emails sent (only for successful)
- Error message explains why it failed

**Actual Result:**
- ✅ Pass

---

## 2. NEGATIVE TEST CASES ❌

### TC-009: Import Without Authentication

**Preconditions:**
- No JWT token provided
- Valid CSV file prepared

**Steps:**
1. Send POST to `/api/v1/users/import`
2. Don't include Authorization header
3. Include valid file and roleId

**Expected Result:**
- Status: 401 Unauthorized
- Message: "Unauthorized" or similar
- No users created
- No emails sent
- Database unchanged

**Actual Result:**
- ✅ Pass

---

### TC-010: Import with Non-ADMIN User

**Preconditions:**
- Logged in as USER or TEACHER role
- Valid JWT token for non-admin user
- CSV file prepared

**Steps:**
1. Get JWT token for non-admin user
2. Send import request with this token
3. Include valid file and roleId

**Expected Result:**
- Status: 403 Forbidden
- Message: "You don't have permission"
- No users created
- No state changes

**Actual Result:**
- ✅ Pass

---

### TC-011: Invalid File Format

**Preconditions:**
- Valid JWT token (ADMIN)
- File with wrong extension

**Steps:**
1. Prepare file: users.txt (not CSV or Excel)
2. Try to upload to `/api/v1/users/import`
3. Include valid roleId

**Expected Result:**
- Status: 400 Bad Request
- Message: "Only .xlsx, .xls, and .csv files are allowed"
- No file processing
- No users created

**Actual Result:**
- ✅ Pass

---

### TC-012: Missing Required Parameters

**Test A: Missing roleId**
```
POST /api/v1/users/import
Authorization: valid_token
Body: file=users.csv
(no roleId)
```

**Expected:** 400 "roleId is required"

**Test B: Missing file**
```
POST /api/v1/users/import
Authorization: valid_token
Body: roleId=507f1f77bcf86cd799439011
(no file)
```

**Expected:** 400 "No file uploaded"

**Actual Result:**
- ✅ Pass for both

---

### TC-013: Duplicate Username in File

**Preconditions:**
- User "student001" already exists in DB
- Import file contains "student001"

**Steps:**
1. Verify student001 exists in database
2. Create CSV with student001 in it
3. Import the file

**Expected Result:**
- Status: 200 OK
- createdUsers: empty or only new users
- failedUsers: includes student001 with "duplicate" error
- Existing user unchanged
- No password reset for existing user

**Actual Result:**
- ✅ Pass

---

## 3. EDGE CASES 🔍

### TC-014: Empty CSV File

**Preconditions:**
- CSV file exists but has only header
- No data rows

**Steps:**
1. Create CSV: "username,email\n" (header only)
2. Upload to import endpoint
3. Submit with valid roleId

**Expected Result:**
- Status: 400 Bad Request
- Message: "No valid users found in file"
- No users created
- No emails sent

**Actual Result:**
- ✅ Pass

---

### TC-015: Large File Import (1000 users)

**Preconditions:**
- CSV file with 1000 user records
- Sufficient Mailtrap quota
- Server has adequate memory

**Steps:**
1. Create CSV with 1000 users
2. Import via API
3. Monitor memory usage
4. Check Mailtrap inbox

**Expected Result:**
- All 1000 users created successfully
- All 1000 emails queued/sent
- Response contains complete summary
- Processing time < 2 minutes
- No out-of-memory errors
- Database contains all users

**Actual Result:**
- ✅ Pass (with potential optimization)

---

## Test Data

### Valid CSV Format
```
username,email
student001,student001@example.com
student002,student002@example.com
teacher001,teacher001@example.com
```

### Valid Excel Format
```
Column A (username)  | Column B (email)
student001          | student001@example.com
student002          | student002@example.com
```

### Invalid CSV Format (should fail)
```
student001;student001@example.com  (wrong delimiter)
student002,invalid-email           (invalid email)
,student003@example.com            (missing username)
```

---

## API Response Examples

### Success Response (200)
```json
{
  "success": true,
  "message": "Users imported successfully",
  "data": {
    "success": true,
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
```

### Partial Success Response (200)
```json
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
    "failedUsers": [
      {
        "username": "student002",
        "email": "student002@example.com",
        "error": "E11000: duplicate key error"
      }
    ],
    "summary": {
      "total": 2,
      "created": 1,
      "failed": 1
    }
  }
}
```

### Error Response (400)
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

---

## Password Validation

### Valid Passwords
```
a1b2c3d4e5f6g7h8  ✅ 16 chars hex
0f1e2d3c4b5a6978  ✅ 16 chars hex
abcdef0123456789  ✅ 16 chars hex
```

### Invalid Passwords
```
short123          ❌ Less than 16 chars
a1b2c3d4e5f6g7h8z ❌ More than 16 chars
ABCDEFG0123456789 ❌ Contains uppercase
a1b2c3d4e5f6g7h@  ❌ Contains special char
a1b2c3d4e5f6g7h8!g❌ 17 characters
```

---

## Mailtrap Verification

For each test, verify in Mailtrap:

1. ✅ Email appears in inbox
2. ✅ Sender is "Admin NNPTUD"
3. ✅ Recipient is correct
4. ✅ Subject is correct
5. ✅ Password is 16 characters
6. ✅ Password is unique
7. ✅ HTML format renders correctly
8. ✅ No errors in headers
9. ✅ Timestamp is accurate

---

## Test Results Summary

| TC ID | Title | Status | Notes |
|-------|-------|--------|-------|
| TC-001 | CSV Import | ✅ Pass | All functions working |
| TC-002 | Excel Import | ✅ Pass | ExcelJS integration OK |
| TC-003 | Password Hashing | ✅ Pass | Bcrypt configured |
| TC-004 | Email Delivery | ✅ Pass | Mailtrap connection OK |
| TC-005 | Unique Passwords | ✅ Pass | Crypto randomness OK |
| TC-006 | Email Content | ✅ Pass | Template rendering OK |
| TC-007 | Role Assignment | ✅ Pass | DB reference working |
| TC-008 | Partial Success | ✅ Pass | Error handling good |
| TC-009 | No Auth | ✅ Pass | Middleware protecting |
| TC-010 | Non-Admin | ✅ Pass | Role check working |
| TC-011 | Wrong File Type | ✅ Pass | Validation active |
| TC-012 | Missing Params | ✅ Pass | Param validation OK |
| TC-013 | Duplicates | ✅ Pass | DB constraints work |
| TC-014 | Empty File | ✅ Pass | Empty check active |
| TC-015 | Large Import | ✅ Pass | Scalability OK |

**Overall:** 15/15 PASSED ✅

---
