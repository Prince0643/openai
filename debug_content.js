// Debug file to check content
import { readFileSync } from 'fs';

// Read the file and check the exact content
const content = readFileSync('d:\\from drive c\\openaitomanychat\\openaitomanychat.js', 'utf8');

// Find the specific line we're trying to replace
const lines = content.split('\n');
const targetLine = lines.find(line => line.includes('responseText += `${classTime} - ${classItem.name}`'));

console.log('Found line:');
console.log(JSON.stringify(targetLine));
console.log('Line number:', lines.indexOf(targetLine) + 1);