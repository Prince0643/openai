# Broadcast Compliance Implementation

This document explains how compliant broadcast messaging has been implemented for the OpenAI to ManyChat integration system.

## Overview

The system now ensures that broadcasts are only sent to opted-in contacts using pre-approved templates, meeting compliance requirements for messaging platforms.

## Implementation Details

### 1. Broadcast Manager Module

A new module `broadcastManager.js` was created to handle all broadcast functionality:

- Template management (add, approve, check approval status)
- User opt-in/opt-out management
- Broadcast sending with compliance checks
- Persistent storage using JSON file

### 2. Key Features

- **Template Approval**: Only pre-approved templates can be used for broadcasts
- **User Consent**: Users must explicitly opt-in to receive broadcasts
- **Opt-out Support**: Users can opt-out at any time
- **Test Mode**: Supports sending test broadcasts to specific user lists
- **Persistent Storage**: All data stored in `broadcast_data.json`

### 3. API Endpoints

New endpoints were added to [openaitomanychat.js](file:///D:/from%20drive%20c/openaitomanychat/openaitomanychat.js):

1. `POST /broadcast/template` - Add new broadcast template
2. `POST /broadcast/approve` - Approve a template for broadcast
3. `POST /broadcast/opt-in` - Opt-in a user for broadcasts
4. `POST /broadcast/opt-out` - Opt-out a user from broadcasts
5. `POST /broadcast/send` - Send a broadcast to opted-in users
6. `GET /broadcast/status` - Get broadcast system status

### 4. Compliance Enforcement

The system enforces compliance by:

1. Checking template approval before sending any broadcast
2. Only sending to users who have explicitly opted in
3. Respecting user opt-out requests
4. Supporting test broadcasts to verified test lists

## Usage Examples

### Adding and Approving Templates

```bash
# Add a new template
curl -X POST http://localhost:3000/broadcast/template \
  -H "Authorization: Bearer YOUR_BACKEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"templateId": "welcome_msg", "content": "Welcome to our gym!", "preApproved": true}'

# Approve an existing template
curl -X POST http://localhost:3000/broadcast/approve \
  -H "Authorization: Bearer YOUR_BACKEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"templateId": "promo_msg"}'
```

### User Opt-in/Opt-out

```bash
# Opt-in a user
curl -X POST http://localhost:3000/broadcast/opt-in \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "contactInfo": {"email": "user@example.com", "phone": "+1234567890"}}'

# Opt-out a user
curl -X POST http://localhost:3000/broadcast/opt-out \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}'
```

### Sending Broadcasts

```bash
# Send broadcast to all opted-in users
curl -X POST http://localhost:3000/broadcast/send \
  -H "Authorization: Bearer YOUR_BACKEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"templateId": "welcome_msg"}'

# Send test broadcast to specific users
curl -X POST http://localhost:3000/broadcast/send \
  -H "Authorization: Bearer YOUR_BACKEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"templateId": "promo_msg", "testUserIds": ["user123", "user456"]}'
```

## Testing Verification

The implementation passes all compliance requirements:

- ✅ Broadcasts only sent to opted-in contacts
- ✅ Only pre-approved templates can be used
- ✅ Test broadcasts work correctly with test lists
- ✅ Opt-in/opt-out functionality works properly
- ✅ Data persists across server restarts

## Files Created

- `broadcastManager.js`: Core broadcast functionality
- `test_broadcast.js`: Comprehensive test suite
- `BROADCAST_COMPLIANCE_IMPLEMENTATION.md`: This documentation
- `broadcast_data.json`: Persistent storage (auto-generated)

The system is now ready to handle compliant broadcast messaging while ensuring all regulatory requirements are met.