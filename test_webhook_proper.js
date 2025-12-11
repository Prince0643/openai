import http from 'http';

const data = JSON.stringify({
  message: 'hi',
  userId: 'test123',
  platform: 'manychat'
});

const options = {
  hostname: 'localhost',
  port: 10000,
  path: '/make/webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`Status: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();