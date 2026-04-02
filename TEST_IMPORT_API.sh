#!/bin/bash

# NNPTUD User Import API - Test Commands
# Thay thế các giá trị sau trước chạy:
# - YOUR_JWT_TOKEN: Token đăng nhập từ /api/v1/auth/login
# - YOUR_ROLE_ID: ObjectId của role "USER" từ database

BASE_URL="http://localhost:3000"
JWT_TOKEN="YOUR_JWT_TOKEN"
ROLE_ID="YOUR_ROLE_ID"

# ============================================
# 1. Test Import từ CSV File
# ============================================
echo "Test 1: Import users từ CSV file"
curl -X POST "$BASE_URL/api/v1/users/import" \
  -H "Authorization: $JWT_TOKEN" \
  -F "file=@samples/users_sample.csv" \
  -F "roleId=$ROLE_ID"

echo -e "\n\n"

# ============================================
# 2. Lấy danh sách user
# ============================================
echo "Test 2: Lấy danh sách tất cả user"
curl -X GET "$BASE_URL/api/v1/users" \
  -H "Authorization: $JWT_TOKEN"

echo -e "\n\n"

# ============================================
# 3. Lấy chi tiết user theo ID
# ============================================
echo "Test 3: Lấy chi tiết user theo ID"
curl -X GET "$BASE_URL/api/v1/users/USER_ID_HERE" \
  -H "Authorization: $JWT_TOKEN"

echo -e "\n\n"

# ============================================
# PowerShell Version
# ============================================

# For PowerShell users, use:

<#

# Test Import từ CSV
$JWT_TOKEN = "YOUR_JWT_TOKEN"
$ROLE_ID = "YOUR_ROLE_ID"

$form = @{
    file = Get-Item "samples/users_sample.csv"
    roleId = $ROLE_ID
}

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/users/import" `
    -Method Post `
    -Headers @{"Authorization" = $JWT_TOKEN} `
    -Form $form

#>
