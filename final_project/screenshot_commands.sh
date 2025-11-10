#!/bin/bash

# Screenshot Commands for Book Review API Testing
# Run these commands one by one and take screenshots

echo "=== TASK 1: Get All Books ==="
curl -s "http://localhost:3001/" | head -20

echo -e "\n\n=== TASK 2: Get Book by ISBN ==="
curl -s "http://localhost:3001/isbn/1"

echo -e "\n\n=== TASK 3: Get Books by Author ==="
curl -s "http://localhost:3001/author/Jane%20Austen"

echo -e "\n\n=== TASK 4: Get Books by Title ==="
curl -s "http://localhost:3001/title/Pride"

echo -e "\n\n=== TASK 5: Get Book Reviews ==="
curl -s "http://localhost:3001/review/1"

echo -e "\n\n=== TASK 6: User Registration ==="
curl -X POST "http://localhost:3001/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"screenshot_user","password":"testpass123"}'

echo -e "\n\n=== TASK 7: User Login ==="
curl -X POST "http://localhost:3001/customer/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"screenshot_user","password":"testpass123"}' \
  -c cookies.txt

echo -e "\n\n=== TASK 8: Add Review ==="
# Extract token from login response first, then:
curl -X PUT "http://localhost:3001/customer/auth/review/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{"review":"Great book for screenshots!"}'

echo -e "\n\n=== TASK 9: Delete Review ==="
curl -X DELETE "http://localhost:3001/customer/auth/review/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

echo -e "\n\n=== TASK 10: Async Get All Books ==="
curl -s "http://localhost:3001/async"

echo -e "\n\n=== TASK 11: Async Get Book by ISBN ==="
curl -s "http://localhost:3001/async/isbn/5"

echo -e "\n\n=== TASK 12: Async Get Books by Author ==="
curl -s "http://localhost:3001/async/author/Dante%20Alighieri"

echo -e "\n\n=== TASK 13: Async Get Books by Title ==="
curl -s "http://localhost:3001/async/title/Divine"