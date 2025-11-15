import express from 'express';
import fs from 'fs';

// Read and evaluate the main application code
eval(fs.readFileSync('./openaitomanychat.js', 'utf8'));

// Mock the necessary objects and functions
const mockReq = {
  body: {
    message: {
      text: "when's your next yoga class?",
      type: "text"
    },
    sender: {
      id: "123456789"
    }
  }
};

const mockRes = {
  json: function(data) {
    console.log('Response:', JSON.stringify(data, null, 2));
  }
};

// Test the webhookPublicHandler function
console.log('Testing webhook with question: "when\'s your next yoga class?"');
webhookPublicHandler(mockReq, mockRes);