const nodemailer = require("nodemailer");

// Configure Mailtrap for sending emails
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // Use true for port 465, false for port 2525
    auth: {
        user: process.env.MAILTRAP_USER || "",
        pass: process.env.MAILTRAP_PASS || "",
    },
});

module.exports = {
    /**
     * Send password via email
     * @param {string} to - Recipient email
     * @param {string} passwordContent - Password content to send
     */
    sendMail: async (to, passwordContent) => {
        try {
            const info = await transporter.sendMail({
                from: '"Admin NNPTUD" <admin@nnptud.com>',
                to: to,
                subject: "Thông tin tài khoản - NNPTUD System",
                text: passwordContent,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Thông tin tài khoản của bạn</h2>
                        <p>Xin chào,</p>
                        <p>Tài khoản của bạn đã được tạo thành công trên hệ thống NNPTUD.</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <pre style="white-space: pre-wrap; word-wrap: break-word;">${passwordContent}</pre>
                        </div>
                        <p style="color: #666; font-size: 12px;">
                            <strong>Lưu ý:</strong> Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu tiên.
                        </p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px;">
                            Email này được gửi tự động. Vui lòng không trả lời email này.
                        </p>
                    </div>
                `
            });

            console.log("Message sent:", info.messageId);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    },

    /**
     * Send reset password link via email
     * @param {string} to - Recipient email
     * @param {string} url - Reset password URL
     */
    sendResetPasswordMail: async (to, url) => {
        try {
            const info = await transporter.sendMail({
                from: '"Admin NNPTUD" <admin@nnptud.com>',
                to: to,
                subject: "Yêu cầu đặt lại mật khẩu - NNPTUD System",
                text: `Click vào đây để đặt lại mật khẩu: ${url}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Đặt lại mật khẩu</h2>
                        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                        <p>
                            <a href="${url}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                Đặt lại mật khẩu
                            </a>
                        </p>
                        <p style="color: #666; font-size: 12px;">
                            Liên kết này có hiệu lực trong 1 giờ.
                        </p>
                    </div>
                `
            });

            console.log("Reset password email sent:", info.messageId);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error("Error sending reset password email:", error);
            throw error;
        }
    }
}