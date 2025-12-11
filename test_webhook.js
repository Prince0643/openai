import fetch from 'node-fetch';

const testWebhook = async () => {
  try {
    const response = await fetch('http://localhost:10000/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'hi',
        userId: 'test123',
        platform: 'manychat'
      })
    });

    const data = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

testWebhook();