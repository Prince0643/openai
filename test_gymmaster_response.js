import fetch from 'node-fetch';

async function testGymMasterResponse() {
  try {
    console.log('Testing GymMaster API response...');
    
    const url = 'https://omni.gymmasteronline.com/portal/api/v1/booking/classes/schedule?api_key=309b28e47ec3126feab3f4319c8ed8e5';
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const jsonData = await response.json();
    console.log('Response data:');
    console.log(JSON.stringify(jsonData, null, 2));
    
    console.log('\n=== Response Summary ===');
    console.log('Total classes:', jsonData.result ? jsonData.result.length : 0);
    
    if (jsonData.result && jsonData.result.length > 0) {
      console.log('\nFirst class example:');
      console.log(JSON.stringify(jsonData.result[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testGymMasterResponse();