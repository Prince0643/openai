import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testYogaClassRequest() {
  try {
    console.log('Testing yoga class request scenario...');
    
    // Test a specific yoga class request through the webhook
    console.log('\n=== Testing yoga class request through webhook ===');
    const webhookResponse = await fetch('https://openai-o3ba.onrender.com/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "What yoga classes do you have today?",
        userId: "test_user_yoga_123",
        platform: "manychat"
      })
    });
    
    console.log('Webhook response status:', webhookResponse.status);
    
    if (webhookResponse.ok) {
      const webhookData = await webhookResponse.json();
      console.log('Webhook response data:', JSON.stringify(webhookData, null, 2));
      
      // Check if the response contains booking information
      if (webhookData.response) {
        console.log('Response text:', webhookData.response);
        
        // Check for booking links
        if (webhookData.response.includes('https://omni.gymmasteronline.com/portal/account/book/class?classId=')) {
          console.log('✅ Specific class booking link found in response');
        } else if (webhookData.response.includes('https://omni.gymmasteronline.com/portal/account/book/class/')) {
          console.log('⚠️  General booking link found in response');
        } else {
          console.log('ℹ️  No direct booking link in response (assistant may handle this)');
        }
      }
    } else {
      const errorText = await webhookResponse.text();
      console.log('Webhook error response:', errorText);
    }
    
    // Test the get_schedule_public tool call to see what data we get
    console.log('\n=== Testing get_schedule_public tool call ===');
    const scheduleResponse = await fetch('https://openai-o3ba.onrender.com/tool-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`
      },
      body: JSON.stringify({
        tool_name: "get_schedule_public",
        tool_args: {
          date_from: new Date().toISOString().split('T')[0]
        }
      })
    });
    
    console.log('Schedule response status:', scheduleResponse.status);
    
    if (scheduleResponse.ok) {
      const scheduleData = await scheduleResponse.json();
      console.log('Schedule response data preview:', JSON.stringify(scheduleData, null, 2).substring(0, 500) + '...');
      
      // Check if the response contains class information
      if (scheduleData.message) {
        console.log('Schedule message preview:', scheduleData.message.substring(0, 200) + '...');
        
        // Check for booking links
        if (scheduleData.message.includes('https://omni.gymmasteronline.com/portal/account/book/class?classId=')) {
          console.log('✅ Specific class booking link found in schedule response');
        } else if (scheduleData.message.includes('https://omni.gymmasteronline.com/portal/account/book/class/')) {
          console.log('⚠️  General booking link found in schedule response');
        } else {
          console.log('ℹ️  No booking link in schedule response (expected for general schedule views)');
        }
      }
    } else {
      const errorText = await scheduleResponse.text();
      console.log('Schedule error response:', errorText);
    }
    
    console.log('\n=== Yoga Class Request Test Completed ===');
    
  } catch (error) {
    console.error('Test failed with error:', error);
    console.error('Error stack:', error.stack);
  }
}

testYogaClassRequest();