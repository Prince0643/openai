# Omni Gym Chat Automation System - Documentation

## System Overview

This system integrates OpenAI Assistant with ManyChat and GymMaster API to provide automated chat responses for gym-related inquiries. The system handles the complete flow where OpenAI threads, answers, and GymMaster processes are all handled within this system, and then the OpenAI answers are passed back to Make.com.

## Key Components

1. **Backend Server** (`openaitomanychat.js`) - Main application
2. **GymMaster Integration** (`gymmaster.js`) - API wrapper for GymMaster
3. **Environment Configuration** (`.env`) - API keys and settings
4. **OpenAI Assistant** (`openaiassistant.json`) - Assistant configuration

## How to Connect to Make.com

### 1. Start Your System

```bash
# Terminal 1: Start the backend server
node openaitomanychat.js

# Terminal 2: Expose to internet (keep running)
npx localtunnel --port 3000
```

Note the public URL provided by localtunnel (e.g., `https://breezy-boxes-hope.loca.lt`)

### 2. Configure Make.com Scenario

1. Create a new scenario in Make.com
2. Add "Webhooks" > "Custom webhook" as trigger
3. Add "HTTP" > "Make a request" module with:
   - **Method**: POST
   - **URL**: `https://YOUR_LOCALTUNNEL_URL/make/webhook`
   - **Headers**: Content-Type: application/json
   - **Body**:
   ```json
   {
     "message": "{{1.message}}",
     "userId": "{{1.userId}}",
     "threadId": "{{1.threadId}}"
   }
   ```

### 3. Handle Responses

Add another module to process the response from your system and send it back to ManyChat.

## OpenAI Assistant Configuration

Your system uses an OpenAI Assistant with custom tools for gym operations:

### Assistant Details
- **Assistant ID**: `asst_xy382A6ksEJ9JwYfSyVDfSBp`
- **Model**: gpt-4o
- **Tools**: 10 gym-specific tools

### Configuration Files
- [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json) - Assistant definition
- [ASSISTANT_CONFIGURATION.md](file:///c%3A/Users/CH/Downloads/openaitomanychat/ASSISTANT_CONFIGURATION.md) - Configuration guide
- [ASSISTANT_SETUP_SUMMARY.md](file:///c%3A/Users/CH/Downloads/openaitomanychat/ASSISTANT_SETUP_SUMMARY.md) - Setup summary

### Customizing the Assistant

1. Edit [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json) to modify instructions or tools
2. Run `node create_assistant.js` to update the assistant
3. Test with `node test_assistant.js`

### Testing the Assistant

```bash
# Test assistant directly
node test_assistant.js

# Test through backend endpoints
curl -X POST http://localhost:3000/process-message \
  -H "Authorization: Bearer YOUR_BACKEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "What classes are available today?"}'
```

## Webhook Endpoint Details

**Endpoint**: `POST /make/webhook`

**Request Body**:
```json
{
  "message": "User's message",
  "userId": "Unique identifier for the user",
  "threadId": "Optional: existing conversation thread ID"
}
```

**Response**:
```json
{
  "response": "Assistant's response text",
  "threadId": "Conversation thread identifier",
  "userId": "User identifier",
  "success": true
}
```

## Testing the Connection

You can test the webhook endpoint with:

```powershell
Invoke-WebRequest -Uri "https://YOUR_LOCALTUNNEL_URL/make/webhook" -Method POST -ContentType "application/json" -Body '{"message": "What classes are available today?", "userId": "user123"}' -UseBasicParsing
```

## API Endpoints

### Authentication
- `POST /member/login` - Authenticate a member
- `POST /find_or_create_member` - Find or create a member (admin only)

### Scheduling
- `GET /schedule/public` - Get public class schedule
- `GET /class/seats/:classId` - Get available seats for a class

### Booking
- `POST /book/class` - Book a class
- `POST /cancel/booking` - Cancel a booking

### Member Information
- `GET /member/:memberId/memberships` - Get member's memberships
- `GET /member/:memberId/profile` - Get member's profile

### Lead Management
- `POST /save/lead` - Save a new lead

### Catalog
- `GET /catalog` - List available memberships and clubs

### OpenAI Integration
- `POST /process-message` - Process user message with OpenAI Assistant
- `POST /tool-call` - Handle tool calls from OpenAI Assistant
- `POST /make/webhook` - Handle Make.com integration

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| BACKEND_API_KEY | API key for securing backend endpoints | Yes |
| GYMMASTER_API_KEY | GymMaster API key | Yes |
| GYMMASTER_BASE_URL | GymMaster API base URL | Yes |
| OPENAI_API_KEY | OpenAI API key | Yes |
| PORT | Server port (default: 3000) | No |

## Security

- All backend-restricted endpoints require the `Authorization: Bearer ${BACKEND_API_KEY}` header
- GymMaster API keys are never exposed to clients
- All communication should happen over HTTPS in production

## Troubleshooting

### Server Issues
1. **Port conflicts**: Change PORT in `.env` file
2. **Server not starting**: Check environment variables
3. **Health check**: Visit `http://localhost:3000/health`

### Integration Issues
1. **GymMaster errors**: Verify API key and base URL
2. **OpenAI errors**: Check API key and assistant configuration
3. **Make.com errors**: Verify webhook URL and payload format

### Common Commands

```bash
# Check server health
curl http://localhost:3000/health

# Start server
node openaitomanychat.js

# Expose server to internet
npx localtunnel --port 3000

# Run setup verification
node verify_setup.js
```

## Files in This Project

- `.env` - Configuration file with API keys
- `gymmaster.js` - GymMaster API integration
- `openaiassistant.json` - OpenAI assistant configuration
- `openaitomanychat.js` - Main application server
- `package.json` - Node.js dependencies
- `README.md` - General project information
- `start_with_tunnel.bat` - Windows script to start server and tunnel
- `verify_setup.js` - Script to verify system setup
- `HOW_TO_CONNECT_TO_MAKE.md` - Specific instructions for Make.com integration
- `API_EXAMPLES.md` - Examples of API usage
- `Notiondoc.txt` - Original system documentation