# OpenAI Assistant Configuration Guide

This guide explains how to configure and customize your OpenAI Assistant for the Omni Gym Chat Automation System.

## Current Assistant Status

✅ Your assistant is already configured with:
- Assistant ID: `asst_nuyiOIsEkMeJVaoZLFEzdqqX`
- Model: `gpt-4o`
- All necessary tools defined in [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json)
- Detailed instructions for gym operations

## How the Assistant Works

The assistant works in conjunction with your backend system:

1. **Assistant receives user messages** through the OpenAI API
2. **Assistant calls your backend tools** when needed (like checking schedules, booking classes)
3. **Your backend processes the tool calls** using GymMaster APIs
4. **Assistant receives tool results** and formulates responses
5. **Assistant sends final response** back to the user

## Configuration Options

### 1. Assistant Instructions

The instructions in [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json) define the assistant's behavior. You can customize these by modifying the `instructions` field.

Key sections you can modify:
- **Role**: Define the assistant's personality and tone
- **Core Capabilities**: Adjust priority of different functions
- **Tone & Style**: Customize how the assistant communicates
- **Sample Snippets**: Update example responses

### 2. Tools

The tools are already defined in your [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json) file. These match the endpoints in your backend:
- `member_login` - Authenticates members
- `find_or_create_member` - Finds or creates members
- `get_schedule_public` - Gets public class schedules
- `get_class_seats` - Checks available seats
- `book_class` - Books classes
- `cancel_booking` - Cancels bookings
- `get_member_memberships` - Gets member memberships
- `list_catalog` - Lists available memberships
- `save_lead` - Saves lead information
- `handoff_to_staff` - Hands off to staff

### 3. Model Parameters

You can adjust these parameters in [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json):
- `temperature`: Controls randomness (0.0 = deterministic, 1.0 = creative)
- `top_p`: Controls diversity of responses

## Customizing the Assistant

### Option 1: Modify the Existing Assistant

If you want to modify the existing assistant:

1. **Edit [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json)** to change instructions or parameters
2. **Update the assistant in OpenAI** using their API or web interface

### Option 2: Create a New Assistant

To create a new assistant:

1. **Create a new assistant** in the OpenAI platform
2. **Update the assistant ID** in your backend code:
   ```javascript
   // In openaitomanychat.js, line ~550
   const run = await openai.beta.threads.runs.create(thread.id, {
     assistant_id: "YOUR_NEW_ASSISTANT_ID" // Update this line
   });
   ```

### Option 3: Use the Assistant Creation Script

You can programmatically create or update the assistant:

```bash
node create_assistant.js
```

This script will:
1. Read your [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json) configuration
2. Create a new assistant with those settings
3. Update the assistant ID in the config file

## Testing the Assistant

You can test your assistant integration with the [process-message](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaitomanychat.js#L400-L475) endpoint:

```bash
curl -X POST http://localhost:3000/process-message \
  -H "Authorization: Bearer YOUR_BACKEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "What classes are available today?"}'
```

## Customization Examples

### Changing the Assistant's Tone

Modify the "Role" section in the instructions:

```
You are Omni Gym's virtual assistant — a fast, friendly, and reliable helper for prospects and members.
```

### Adding New Capabilities

To add new capabilities:
1. Add a new tool definition in [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json)
2. Add a corresponding endpoint in [openaitomanychat.js](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaitomanychat.js)
3. Add the tool implementation in the [tool-call](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaitomanychat.js#L477-L572) endpoint

### Adjusting Response Style

Modify the "Tone & Style" section:

```
• Clear, concise, and friendly.
• Short paragraphs, bulleted options where useful.
• Confirm key details before booking or canceling.
```

## Troubleshooting

### Assistant Not Responding

1. Check that your OPENAI_API_KEY is set in [.env](file:///c%3A/Users/CH/Downloads/openaitomanychat/.env)
2. Verify the assistant ID is correct in [openaitomanychat.js](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaitomanychat.js)
3. Check that your backend server is running

### Tools Not Working

1. Verify that all tool endpoints are implemented in your backend
2. Check that the tool names in [openaiassistant.json](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaiassistant.json) match the backend implementations
3. Ensure GymMaster API credentials are correct

### Authentication Issues

1. Verify BACKEND_API_KEY is set in [.env](file:///c%3A/Users/CH/Downloads/openaitomanychat/.env)
2. Check that requests to protected endpoints include the Authorization header

## Best Practices

1. **Keep instructions up to date** with your gym's policies and offerings
2. **Test thoroughly** after making changes to the assistant configuration
3. **Monitor logs** for any tool call failures
4. **Regularly review** assistant performance and adjust as needed
