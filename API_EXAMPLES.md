# API Usage Examples

Here are some example curl commands to test the API endpoints:

## Health Check
```bash
curl -X GET http://localhost:8080/health
```

## Public Schedule
```bash
curl -X GET "http://localhost:8080/schedule/public?date_from=2025-10-16"
```

## Member Login
```bash
curl -X POST http://localhost:8080/member/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "password": "password123"
  }'
```

## Get Class Seats (Backend-restricted)
```bash
curl -X GET "http://localhost:8080/class/seats/123?token=member_token_here" \
  -H "Authorization: Bearer your_backend_api_key"
```

## Book Class (Backend-restricted)
```bash
curl -X POST http://localhost:8080/book/class \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_backend_api_key" \
  -d '{
    "memberId": "mem_123",
    "classId": "class_456",
    "token": "member_token_here"
  }'
```

## Cancel Booking (Backend-restricted)
```bash
curl -X POST http://localhost:8080/cancel/booking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_backend_api_key" \
  -d '{
    "bookingId": "bk_789",
    "token": "member_token_here"
  }'
```

## Get Member Memberships (Backend-restricted)
```bash
curl -X GET "http://localhost:8080/member/mem_123/memberships?token=member_token_here" \
  -H "Authorization: Bearer your_backend_api_key"
```

## Save Lead (Backend-restricted)
```bash
curl -X POST http://localhost:8080/save/lead \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_backend_api_key" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "interest": "Interested in trial class"
  }'
```

## List Catalog (Backend-restricted)
```bash
curl -X GET http://localhost:8080/catalog \
  -H "Authorization: Bearer your_backend_api_key"
```