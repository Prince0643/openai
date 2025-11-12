// Script to fix the formatting in openaitomanychat.js
import { readFileSync, writeFileSync } from 'fs';

// Read the file
const content = readFileSync('d:\\from drive c\\openaitomanychat\\openaitomanychat.js', 'utf8');

// Replace all instances of the old format with the new format
const updatedContent = content.replace(
  /responseText \+= `\$\{classTime\} - \$\{classItem\.name\}`;/g,
  'responseText += `\\n${classTime}: ${classItem.name}`;'
);

// Write the updated content back to the file
writeFileSync('d:\\from drive c\\openaitomanychat\\openaitomanychat.js', updatedContent);

console.log('Formatting updated successfully!');