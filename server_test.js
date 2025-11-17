// Simple server test to check if the server can start
import express from "express";
import dotenv from "dotenv";

// Load environment variables
const dotenvResult = dotenv.config();

console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT || 8080);

const app = express();

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString()
  });
});

const PORT = parseInt(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`Test server up on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('Server failed to start:', err.message);
});