// Debug file to check content
import { readFileSync } from 'fs';

// Read the file and check the exact content
const content = readFileSync('d:\\from drive c\\openaitomanychat\\openaitomanychat.js', 'utf8');

// Find the specific lines we're trying to replace
const lines = content.split('\n');
const startIndex = lines.findIndex(line => line.includes('dailySchedule.forEach(classItem => {'));

if (startIndex !== -1) {
  console.log('Found start line at index:', startIndex);
  console.log('Start line:', JSON.stringify(lines[startIndex]));
  
  // Show the next few lines
  for (let i = 0; i < 5; i++) {
    if (startIndex + i < lines.length) {
      console.log(`Line ${startIndex + i}:`, JSON.stringify(lines[startIndex + i]));
    }
  }
}