// This script will apply the FAQ integration to the webhook handler
// by adding the necessary code to check FAQs before processing messages

import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'openaitomanychat.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Check if the FAQ middleware import is already there
if (!content.includes('import { handleFAQRequest } from "./faqMiddleware.js"')) {
  // Add the import statement after the faqManager import
  content = content.replace(
    'import faqManager from "./faqManager.js";',
    'import faqManager from "./faqManager.js";\nimport { handleFAQRequest } from "./faqMiddleware.js";'
  );
  console.log('✅ Added FAQ middleware import');
} else {
  console.log('ℹ️  FAQ middleware import already exists');
}

// Check if the FAQ processing code is already there
if (!content.includes('// First, check if the question is in our FAQ database')) {
  // Add the FAQ processing code after message validation
  const faqProcessingCode = `    // First, check if the question is in our FAQ database
    const faqResponse = await handleFAQRequest(message, userId, platform);
    if (faqResponse) {
      // Found an FAQ match or escalated to human agent
      return res.json(faqResponse);
    }`;
  
  content = content.replace(
    '    if (!message || message.trim() === "") {\n      return res.status(400).json({ error: true, message: "Message is required" });\n    }',
    `    if (!message || message.trim() === "") {
      return res.status(400).json({ error: true, message: "Message is required" });
    }
    
${faqProcessingCode}`
  );
  console.log('✅ Added FAQ processing code to webhook handler');
} else {
  console.log('ℹ️  FAQ processing code already exists in webhook handler');
}

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ FAQ integration applied successfully!');