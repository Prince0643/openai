# Conversation Memory Implementation

This document explains how persistent conversation memory has been implemented for returning users in the OpenAI to ManyChat integration system.

## Overview

The system now maintains persistent thread IDs for each user (identified by their IG sender ID), ensuring that returning users are greeted by name and previous context is remembered across server restarts.

## Implementation Details

### 1. Persistent Storage Module

A new module `threadStorage.js` was created to handle persistent storage of user-thread mappings:

- Uses a JSON file (`user_threads.json`) to store mappings
- Provides functions for getting, setting, and deleting user threads
- Automatically loads and saves data to ensure persistence

### 2. Key Functions

- `getUserThread(userId)`: Retrieves the thread ID for a user
- `setUserThread(userId, threadId)`: Stores a thread ID for a user
- `deleteUserThread(userId)`: Removes a user's thread mapping
- `loadUserThreads()`: Loads all user-thread mappings from storage

### 3. Integration with Webhook Handler

The `/make/webhook` endpoint was updated to use persistent storage:

1. When a message arrives, the system checks for an existing thread ID for the user
2. If found, it retrieves the existing thread from OpenAI
3. If not found, it creates a new thread and stores the mapping
4. All interactions are appended to the same thread for context continuity

### 4. Benefits

- **Persistence Across Restarts**: Thread information survives server restarts
- **Context Continuity**: Returning users maintain conversation context
- **Personalized Greetings**: Users can be greeted by name with reference to previous interactions
- **Flow Continuation**: Previous conversation topics are remembered (e.g., "PT inquiry yesterday → continues flow")

## Testing

Several test scripts were created to verify the implementation:

1. `test_persistent_threads.js` - Tests basic storage and retrieval
2. `test_conversation_memory.js` - Simulates multi-turn conversations
3. `demonstrate_persistence.js` - Shows persistence across "server restarts"

## How It Works

1. **First Interaction**:
   - User sends a message
   - No existing thread found for user
   - New thread created and stored
   - Response generated with fresh context

2. **Returning Interaction**:
   - User sends another message
   - Existing thread found for user
   - Thread retrieved from OpenAI
   - New message appended to thread
   - Response generated with full conversation history

3. **Server Restart**:
   - All thread mappings loaded from `user_threads.json`
   - Returning users continue with their existing threads
   - No loss of conversation context

## Files Modified

- `openaitomanychat.js`: Updated imports and removed in-memory storage
- `threadStorage.js`: New module for persistent storage
- `user_threads.json`: Automatically generated storage file

## Verification

The implementation passes all requirements:
- ✅ Uses a persistent thread_id per user (IG sender ID)
- ✅ Appends messages to that thread for context continuity
- ✅ Returning users are greeted by name
- ✅ Previous context is remembered (e.g., "PT inquiry yesterday → continues flow")
- ✅ Thread information persists across server restarts