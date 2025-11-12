// Verify current link formats in the code

// Read the main file and check for booking links
import { readFileSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'openaitomanychat.js');
const content = readFileSync(filePath, 'utf8');

// Find all booking links
const bookingLinkRegex = /https:\/\/omni\.gymmasteronline\.com\/portal\/account\/book\/class[^\s"']*/g;
const matches = content.match(bookingLinkRegex);

console.log('Found booking links in the code:');
if (matches) {
  matches.forEach((link, index) => {
    console.log(`${index + 1}. ${link}`);
    console.log(`   Ends with slash: ${link.endsWith('/')}`);
    console.log(`   Has query params: ${link.includes('?')}`);
    console.log('');
  });
} else {
  console.log('No booking links found');
}

console.log('Links that need to be updated (should not end with slash):');
if (matches) {
  matches.forEach((link, index) => {
    if (link.endsWith('/')) {
      console.log(`${index + 1}. ${link} -> ${link.slice(0, -1)}`);
    }
  });
}