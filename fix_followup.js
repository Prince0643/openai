// Script to fix the follow-up text in the get_schedule handler
import { readFileSync, writeFileSync } from 'fs';

// Read the file
const content = readFileSync('d:\\from drive c\\openaitomanychat\\openaitomanychat.js', 'utf8');

// Replace the specific line with the new format
const updatedContent = content.replace(
  /responseText \+= "\\nWhich day are you interested in\?";/g,
  'responseText += "\\n\\nLet me know which day you\'d like to see next.";'
);

// Write the updated content back to the file
writeFileSync('d:\\from drive c\\openaitomanychat\\openaitomanychat.js', updatedContent);

console.log('Follow-up text updated successfully!');