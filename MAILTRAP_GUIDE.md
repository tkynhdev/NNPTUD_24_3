# Hướng dẫn cấu hình Mailtrap

## Bước 1: Tạo tài khoản Mailtrap

1. Truy cập [Mailtrap.io](https://mailtrap.io)
2. Nhấp "Try for Free" hoặc "Sign Up"
3. Điền thông tin email và tạo mật khẩu
4. Xác thực email của bạn

## Bước 2: Tạo Inbox

1. Sau khi đăng nhập, vào Dashboard
2. Nhấp "Add Inbox" 
3. Đặt tên (ví dụ: "NNPTUD Development")
4. Chọn "Personal Account"
5. Nhấp "Create"

## Bước 3: Lấy thông tin kết nối

1. Vào Inbox vừa tạo
2. Nhấp vào tab "Integrations"
3. Tìm "Nodemailer" hoặc "Node.js"
4. Copy thông tin:
   - **Host**: sandbox.smtp.mailtrap.io
   - **Port**: 2525 (hoặc 25, 465, 587 tùy cấu hình)
   - **User**: Username từ Mailtrap
   - **Pass**: Password từ Mailtrap

## Bước 4: Cấu hình .env

Tạo file `.env` trong thư mục project:

```env
MAILTRAP_USER=your_username_here
MAILTRAP_PASS=your_password_here
MONGODB_URL=mongodb://localhost:27017/NNPTUD-S3
JWT_SECRET=secretKey
PORT=3000
```

## Bước 5: Test email

1. Khởi động server: `npm start`
2. Gửi POST request tới `/api/v1/users/import`
3. Kiểm tra inbox Mailtrap để xem email đã nhận

## Xem Email trong Mailtrap

### Cách 1: Web Interface
1. Vào Mailtrap Dashboard
2. Chọn Inbox của bạn
3. Toàn bộ email sẽ hiển thị ở đây
4. Nhấp email để xem nội dung chi tiết

### Cách 2: IMAP Client
- Có thể kết nối với Outlook, Gmail, Thunderbird, etc.
- Xem hướng dẫn trong Mailtrap Dashboard

## Thông tin SMTP

- **Host**: sandbox.smtp.mailtrap.io
- **Port**: 2525 (khuyến cáo) | 25 | 465 | 587
- **TLS**: Optional (disable)
- **Authentication**: Required
- **Sender**: Bất kì email nào (ví dụ: admin@nnptud.com)

## Lưu ý

⚠️ **Mailtrap chỉ dùng cho Development/Testing**
- Không sử dụng trong Production
- Tất cả email gửi qua Mailtrap được trữ 7 ngày
- Giới hạn email miễn phí khác nhau tùy plan

## Hình ảnh tham khảo

### 1. Dashboard
```
[Hình: Dashboard Mailtrap với danh sách Inbox]
```

### 2. Integrations - Nodemailer
```
[Hình: Tab Integrations với cấu hình Nodemailer]
```

### 3. Email Received
```
[Hình: Email được nhận trong Inbox]
```

### 4. Email Content
```
[Hình: Nội dung chi tiết email với password]
```

## Troubleshooting

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-----------|----------|
| "Invalid login" | Sai credentials | Kiểm tra lại User/Pass từ Mailtrap |
| Không gửi được email | Port sai | Thử port 2525 hoặc 25 |
| Email không đến | SMTP config sai | Xem lại cấu hình trong Integrations |
| Timeout error | Network issue | Kiểm tra kết nối internet |

## Tài liệu tham khảo

- [Mailtrap Documentation](https://mailtrap.io/inbox/655315)
- [Nodemailer Configuration](https://nodemailer.com/smtp/testing/)
- [NNPTUD Project README](./README.md)
