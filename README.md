Nguyễn Đức Thịnh - 2280603091



# NNPTUD - User Management System with Bulk Import

## Tính năng chính

### 1. **Import User từ File**
- Hỗ trợ nhập dữ liệu user từ file Excel (.xlsx, .xls) hoặc CSV (.csv)
- Tự động tạo mật khẩu ngẫu nhiên 16 ký tự cho mỗi user
- Gửi mật khẩu tới email của user thông qua Mailtrap
- Ghi nhận thành công/thất bại cho mỗi user được import

### 2. **Cấu trúc File Import**

#### CSV Format
```
username,email
student001,student001@example.com
student002,student002@example.com
teacher001,teacher001@example.com
```

#### Excel Format
- Column A: username
- Column B: email

### 3. **Cập nhật Email Handler**
- Tự động tạo mật khẩu ngẫu nhiên 16 ký tự
- Gửi email chuyên nghiệp với thông tin tài khoản
- Hỗ trợ gửi email đặt lại mật khẩu

## Cài đặt

### 1. Clone repository
```bash
git clone https://github.com/tkynhdev/NNPTUD_24_3.git
cd NNPTUD_24_3
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Mailtrap

#### Bước 1: Tạo tài khoản Mailtrap
1. Truy cập [Mailtrap.io](https://mailtrap.io)
2. Đăng ký tài khoản miễn phí
3. Tạo inbox mới

#### Bước 2: Lấy thông tin xác thực
1. Vào Settings > Integrations > Nodemailer
2. Copy thông tin user và password

#### Bước 3: Cấu hình .env
```bash
# Copy từ .env.example
cp .env.example .env

# Chỉnh sửa .env
MAILTRAP_USER=your_username_from_mailtrap
MAILTRAP_PASS=your_password_from_mailtrap
```

### 4. Khởi động MongoDB
```bash
mongod
```

### 5. Chạy ứng dụng
```bash
npm start
```

## API Endpoints

### Import Users
```
POST /api/v1/users/import
```

#### Request
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Authentication**: Required (JWT Token + ADMIN role)

#### Parameters
```json
{
  "file": "users_sample.csv",
  "roleId": "ObjectId_of_role"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Users imported successfully",
  "data": {
    "success": true,
    "createdUsers": [
      {
        "userId": "6504f8b8c3e4a2d1f9e8c7b1",
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

#### Response Error (400)
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Quy trình Mật khẩu

### 1. Tạo Mật khẩu Ngẫu nhiên
- Độ dài: 16 ký tự
- Format: Hexadecimal (0-9, a-f)
- Ví dụ: `a1b2c3d4e5f6g7h8`

### 2. Gửi Email
- Email được gửi ngay sau khi tạo user
- Nội dung: Tài khoản, mật khẩu, lưu ý đổi mật khẩu
- Template: HTML được format đẹp

### 3. Mật khẩu lưu trong Database
- Mật khẩu được hash bằng bcrypt trước khi lưu
- Salt rounds: 10
- Không thể recover mật khẩu gốc từ database

## File Cấu trúc

```
NNPTUD_24/
├── bin/
├── controllers/
│   └── users.js
├── routes/
│   └── users.js          # Route import users
├── schemas/
│   └── users.js
├── utils/
│   ├── mailHandler.js    # Updated email sender
│   ├── userImportHandler.js  # New import utility
│   ├── authHandler.js
│   └── validatorHandler.js
├── uploads/              # Uploaded files storage
├── samples/
│   └── users_sample.csv  # Sample file
├── app.js
├── package.json
├── .env.example
└── README.md
```

## Xử lý Lỗi

### Lỗi thường gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-----------|----------|
| "No file uploaded" | Không gửi file | Kiểm tra form-data có file không |
| "roleId is required" | Không gửi roleId | Thêm roleId vào body |
| "Unsupported file format" | File không phải .csv/.xlsx | Sử dụng file đúng format |
| "No valid users found" | File rỗng hoặc format sai | Kiểm tra format dòng data |
| Email không gửi | Mailtrap config sai | Kiểm tra MAILTRAP_USER/PASS |

## Git Commits

### Commit History
```
- feat: Add user bulk import functionality
  * userImportHandler.js: Import from Excel/CSV
  * routes/users.js: POST /api/v1/users/import endpoint
  * utils/mailHandler.js: Enhanced email sending

- feat: Add random password generation
  * 16-character hexadecimal password
  * Auto-send to user email

- feat: Add email notification system
  * Mailtrap integration
  * HTML email templates
  * Reset password email support
```

## Testing

### Test Import với Sample File

```bash
# 1. Lấy roleId từ database (ADMIN role chẳng hạn)
# 2. Upload file và import:

curl -X POST http://localhost:3000/api/v1/users/import \
  -H "Authorization: your_jwt_token" \
  -F "file=@samples/users_sample.csv" \
  -F "roleId=your_role_id"
```

## Lưu ý Bảo mật

1. **Mailtrap chỉ dùng cho Development**
   - Không bao giờ sử dụng Mailtrap trong production
   - Sử dụng email service chuyên nghiệp (SendGrid, AWS SES, etc.)

2. **Mật khẩu**
   - Luôn hash mật khẩu trước khi lưu (bcrypt)
   - Không bao giờ gửi mật khẩu dưới dạng plain text qua HTTP
   - Sử dụng HTTPS trong production

3. **File Upload**
   - Validate file type (chỉ .csv/.xlsx)
   - Validate file size
   - Lưu file vào thư mục riêng
   - Xóa file sau khi xử lý

## Technologies Used

- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **bcrypt**: Password hashing
- **nodemailer**: Email sending
- **exceljs**: Excel file reading
- **multer**: File upload handling
- **jsonwebtoken**: Authentication

## License

GPL-3.0

## Author

- Development Team NNPTUD
