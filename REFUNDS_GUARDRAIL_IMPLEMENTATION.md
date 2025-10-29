# Refunds/Freebies Guardrail Implementation

This document explains how the refunds/freebies guardrail has been implemented for the OpenAI to ManyChat integration system.

## Overview

The system now prevents the bot from promising refunds, credits, or free trials, automatically escalating such requests to staff members instead.

## Implementation Details

### 1. Refunds Guardrail Module

A new module `refundsGuardrail.js` was created to handle all refund-related guardrail functionality:

- Detects user inquiries about refunds, credits, or freebies
- Identifies assistant responses that promise refunds/credits/freebies
- Automatically escalates to staff with appropriate messaging
- Provides consistent responses to users

### 2. Key Features

- **Inquiry Detection**: Identifies when users ask about refunds, credits, or freebies
- **Promise Detection**: Prevents the assistant from making prohibited promises
- **Automatic Escalation**: Creates staff tickets for all refund-related interactions
- **User-Friendly Responses**: Provides clear, consistent messaging
- **Categorization**: Tickets categorized as "refund_inquiry" or "refund_violation"

### 3. Detection Mechanisms

#### Refund Inquiry Detection
The system detects refund inquiries by looking for phrases like:
- "refund"
- "credit"
- "free trial"
- "free class"
- "free membership"
- "complimentary"
- "waive"
- "discount"

#### Prohibited Promise Detection
The system identifies prohibited promises by looking for phrases like:
- "I can give you a refund"
- "I'll refund"
- "we can refund"
- "refund you"
- "I can offer you credit"
- "free trial"
- "complimentary"
- "I can waive"

### 4. Guardrail Responses

When escalation occurs, users receive:
> "I don't want to give you the wrong info. I've passed this to our team who will reply shortly."

### 5. Integration Points

The guardrail functionality is integrated into:
1. **Make.com Webhook Handler** - Main conversation processing endpoint
2. **Response Processing** - Applied after assistant generates responses

## API Functions

### Inquiry Detection
```javascript
const isRefundInquiry = isAskingAboutRefunds("Can I get a refund?");
```

### Promise Detection
```javascript
const hasPromise = containsRefundPromises("I can give you a refund");
```

### Guardrail Handling
```javascript
// For refund inquiries
const inquiryResult = handleRefundInquiry(userId, message, threadId);

// For checking assistant responses
const guardrailResult = handleRefundsGuardrail(userId, message, response, threadId);

// Returns:
// {
//   response: "Guardrail message...",
//   escalated: true/false,
//   ticketId: "TICKET-0001" (if escalated),
//   violationType: "refund_inquiry" or "refund_promise"
// }
```

## Testing Verification

The implementation passes all requirements:

- ✅ **Inquiry Detection**: All refund/credit/freebie inquiries are identified
- ✅ **Promise Prevention**: Prohibited promises are detected and blocked
- ✅ **Always Escalate**: All refund-related interactions trigger escalation
- ✅ **Staff Notification**: Tickets created with proper categorization
- ✅ **User Experience**: Consistent, appropriate responses to users

## Files Created

- `refundsGuardrail.js`: Core guardrail functionality
- `test_refunds_guardrail.js`: Comprehensive test suite
- `REFUNDS_GUARDRAIL_IMPLEMENTATION.md`: This documentation

The system is now ready to prevent any refund/credit/freebie promises while ensuring all such requests are properly escalated to staff members.