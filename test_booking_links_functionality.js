import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testBookingLinksFunctionality() {
  try {
    console.log('Testing booking links functionality...');
    
    // Test the book_class tool call with a mock class ID
    console.log('\n=== Testing book_class tool call ===');
    const toolCallResponse = await fetch('https://openai-o3ba.onrender.com/tool-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`
      },
      body: JSON.stringify({
        tool_name: "book_class",
        tool_args: {
          classId: "test_class_123"
        }
      })
    });
    
    console.log('Book class response status:', toolCallResponse.status);
    
    if (toolCallResponse.ok) {
      const responseData = await toolCallResponse.json();
      console.log('Book class response data:', JSON.stringify(responseData, null, 2));
      
      // Check if the response contains a booking link
      if (responseData.message && responseData.message.includes('https://')) {
        console.log('✅ Booking link found in response');
        
        // Check if the link format is correct (no trailing slash)
        if (responseData.message.includes('https://omni.gymmasteronline.com/portal/account/book/class?classId=')) {
          console.log('✅ Booking link format is correct (no trailing slash)');
        } else if (responseData.message.includes('https://omni.gymmasteronline.com/portal/account/book/class/?classId=')) {
          console.log('⚠️  Booking link has trailing slash in path (should be removed)');
        } else {
          console.log('⚠️  Booking link format may need verification');
        }
      } else {
        console.log('❌ No booking link found in response');
      }
    } else {
      const errorText = await toolCallResponse.text();
      console.log('Book class error response:', errorText);
    }
    
    // Test a specific class request through the webhook
    console.log('\n=== Testing specific class request through webhook ===');
    const webhookResponse = await fetch('https://openai-o3ba.onrender.com/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "I want to book a yoga class",
        userId: "test_user_123",
        platform: "manychat"
      })
    });
    
    console.log('Webhook response status:', webhookResponse.status);
    
    if (webhookResponse.ok) {
      const webhookData = await webhookResponse.json();
      console.log('Webhook response data:', JSON.stringify(webhookData, null, 2));
      
      // Check if the response contains booking information
      if (webhookData.response && (webhookData.response.includes('https://') || webhookData.response.includes('booking'))) {
        console.log('✅ Booking information found in webhook response');
      } else {
        console.log('ℹ️  No booking information in webhook response (may be handled by assistant)');
      }
    } else {
      const errorText = await webhookResponse.text();
      console.log('Webhook error response:', errorText);
    }
    
    console.log('\n=== Booking Links Test Completed ===');
    
  } catch (error) {
    console.error('Test failed with error:', error);
    console.error('Error stack:', error.stack);
  }
}

testBookingLinksFunctionality();