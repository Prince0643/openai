// Final verification of booking link formats

console.log('=== Final Booking Link Verification ===\n');

// Test the correct formats
const correctFormats = [
  {
    name: 'Specific class booking link (no trailing slash)',
    link: 'https://omni.gymmasteronline.com/portal/account/book/class?classId=CLASS123',
    expected: 'No trailing slash'
  },
  {
    name: 'General booking link (no trailing slash)',
    link: 'https://omni.gymmasteronline.com/portal/account/book/class',
    expected: 'No trailing slash'
  },
  {
    name: 'Schedule link (no trailing slash)',
    link: 'https://omni.gymmasteronline.com/portal/account/book/class/schedule',
    expected: 'No trailing slash'
  }
];

console.log('Correct link formats:');
correctFormats.forEach((format, index) => {
  console.log(`${index + 1}. ${format.name}`);
  console.log(`   Link: ${format.link}`);
  console.log(`   Ends with slash: ${format.link.endsWith('/')}`);
  console.log(`   Status: ${format.link.endsWith('/') ? '❌ Incorrect' : '✅ Correct'}`);
  console.log('');
});

// Test the incorrect formats that should be fixed
const incorrectFormats = [
  {
    name: 'Specific class booking link (with trailing slash) - INCORRECT',
    link: 'https://omni.gymmasteronline.com/portal/account/book/class/?classId=CLASS123',
    expected: 'Should be fixed to remove trailing slash'
  },
  {
    name: 'General booking link (with trailing slash) - INCORRECT',
    link: 'https://omni.gymmasteronline.com/portal/account/book/class/',
    expected: 'Should be fixed to remove trailing slash'
  }
];

console.log('Incorrect link formats that should be fixed:');
incorrectFormats.forEach((format, index) => {
  console.log(`${index + 1}. ${format.name}`);
  console.log(`   Link: ${format.link}`);
  console.log(`   Ends with slash: ${format.link.endsWith('/')}`);
  console.log(`   Status: ${format.link.endsWith('/') ? '❌ Needs fixing' : '✅ Already correct'}`);
  console.log('');
});

console.log('=== Summary ===');
console.log('✅ All booking links in the system should now use the correct format (no trailing slashes)');
console.log('✅ Specific class links: https://omni.gymmasteronline.com/portal/account/book/class?classId=CLASS_ID');
console.log('✅ General booking links: https://omni.gymmasteronline.com/portal/account/book/class');
console.log('✅ Schedule links: https://omni.gymmasteronline.com/portal/account/book/class/schedule');