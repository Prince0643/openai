import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testToolCallEndpoint() {
  try {
    console.log('Testing tool-call endpoint with authentication...');
    
    // Test the tool-call endpoint directly
    console.log('\nSending tool-call request with authentication...');
    const toolCallResponse = await fetch('https://openai-o3ba.onrender.com/tool-call', {
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
    
    console.log('Tool-call response status:', toolCallResponse.status);
    console.log('Tool-call response headers:', [...toolCallResponse.headers.entries()]);
    
    const toolCallData = await toolCallResponse.text();
    console.log('Tool-call response body:', toolCallData);
    
    console.log('\n=== Test completed ===');
    
  } catch (error) {
    console.error('Test failed with error:', error);
    console.error('Error stack:', error.stack);
  }
}

testToolCallEndpoint();