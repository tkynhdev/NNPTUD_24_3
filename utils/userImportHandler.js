const crypto = require('crypto');
const ExcelJS = require('exceljs');
const fs = require('fs');

/**
 * Generate random password 16 characters
 * @returns {string} Random password
 */
const generateRandomPassword = () => {
    return crypto.randomBytes(8).toString('hex');
};

/**
 * Read users from Excel file
 * @param {string} filePath - Path to Excel file
 * @returns {Array} Array of user objects with {username, email}
 */
const readUsersFromExcel = async (filePath) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        const users = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
                const user = {
                    username: row.getCell(1).value,
                    email: row.getCell(2).value
                };
                if (user.username && user.email) {
                    users.push(user);
                }
            }
        });

        return users;
    } catch (error) {
        throw new Error(`Error reading Excel file: ${error.message}`);
    }
};

/**
 * Read users from CSV file
 * @param {string} filePath - Path to CSV file
 * @returns {Array} Array of user objects with {username, email}
 */
const readUsersFromCSV = async (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.trim().split('\n');

        const users = [];
        for (let i = 1; i < lines.length; i++) { // Skip header
            const [username, email] = lines[i].split(',').map(item => item.trim());
            if (username && email) {
                users.push({ username, email });
            }
        }

        return users;
    } catch (error) {
        throw new Error(`Error reading CSV file: ${error.message}`);
    }
};

/**
 * Main function to import users from file
 * @param {string} filePath - Path to user file (Excel or CSV)
 * @param {string} roleId - User role ID
 * @param {object} userController - User controller for creating users
 * @param {object} mailHandler - Mail handler for sending emails
 * @returns {Array} Array of created users with their passwords
 */
const importUsersFromFile = async (filePath, roleId, userController, mailHandler) => {
    try {
        // Determine file type and read users
        let users = [];
        const ext = filePath.split('.').pop().toLowerCase();

        if (ext === 'xlsx' || ext === 'xls') {
            users = await readUsersFromExcel(filePath);
        } else if (ext === 'csv') {
            users = await readUsersFromCSV(filePath);
        } else {
            throw new Error('Unsupported file format. Please use .xlsx or .csv');
        }

        if (users.length === 0) {
            throw new Error('No valid users found in file');
        }

        const createdUsers = [];
        const failedUsers = [];

        // Create users and send emails
        for (const userData of users) {
            try {
                const password = generateRandomPassword();

                // Create user
                const newUser = await userController.CreateAnUser(
                    userData.username,
                    password,
                    userData.email,
                    roleId,
                    null, // session
                    userData.username, // fullName
                    'https://i.sstatic.net/l60Hf.png', // avatarUrl
                    false, // status
                    0 // loginCount
                );

                // Send email with password
                await mailHandler.sendMail(
                    userData.email,
                    `Tài khoản của bạn đã được tạo thành công!\n\nUsername: ${userData.username}\nPassword: ${password}\n\nVui lòng đổi mật khẩu sau khi đăng nhập lần đầu.`
                );

                createdUsers.push({
                    userId: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    password: password,
                    message: 'User created and email sent successfully'
                });
            } catch (error) {
                failedUsers.push({
                    username: userData.username,
                    email: userData.email,
                    error: error.message
                });
            }
        }

        return {
            success: true,
            createdUsers: createdUsers,
            failedUsers: failedUsers,
            summary: {
                total: users.length,
                created: createdUsers.length,
                failed: failedUsers.length
            }
        };
    } catch (error) {
        throw new Error(`User import failed: ${error.message}`);
    }
};

module.exports = {
    generateRandomPassword,
    readUsersFromExcel,
    readUsersFromCSV,
    importUsersFromFile
};
