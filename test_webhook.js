// Remove the import since we'll use the built-in fetch API

async function testWebhook() {
  try {
    // Test daily schedule request
    const response = await fetch('http://localhost:10001/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'today'
      })
    });
    
    const data = await response.json();
    console.log('Daily schedule response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Test specific class request
    const yogaResponse = await fetch('http://localhost:10001/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'yoga'
      })
    });
    
    const yogaData = await yogaResponse.json();
    console.log('\nYoga class response:');
    console.log(JSON.stringify(yogaData, null, 2));
    
    // Test weekly schedule request
    const weeklyResponse = await fetch('http://localhost:10001/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'this week'
      })
    });
    
    const weeklyData = await weeklyResponse.json();
    console.log('\nWeekly schedule response:');
    console.log(JSON.stringify(weeklyData, null, 2));
    
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

testWebhook();