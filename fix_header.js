// Script to fix the header format in openaitomanychat.js
import { readFileSync, writeFileSync } from 'fs';

// Read the file
const content = readFileSync('d:\\from drive c\\openaitomanychat\\openaitomanychat.js', 'utf8');

// Replace the specific line with the new format
const updatedContent = content.replace(
  /responseText = "Here's today's schedule:\\n";/g,
  'responseText = "Here\'s today\'s schedule:";'
);

// Write the updated content back to the file
writeFileSync('d:\\from drive c\\openaitomanychat\\openaitomanychat.js', updatedContent);

console.log('Header format updated successfully!');