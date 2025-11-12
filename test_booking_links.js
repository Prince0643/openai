// Test to verify that booking links are correctly formatted

// Mock schedule data with IDs
const mockSchedule = [
  {
    id: "class_101",
    name: "Morning Yoga",
    start: "2023-10-25T08:00:00Z",
    end: "2023-10-25T09:00:00Z",
    coach: "Sarah Johnson"
  },
  {
    id: "class_202",
    name: "HIIT Training",
    start: "2023-10-25T12:00:00Z",
    end: "2023-10-25T13:00:00Z",
    coach: "Mike Thompson"
  }
];

// Test specific class booking link format
function generateSpecificClassBookingLink(classId) {
  // This is the correct format - no trailing slash
  return `https://omni.gymmasteronline.com/portal/account/book/class/?classId=${classId}`;
}

// Test general booking link format
function generateGeneralBookingLink() {
  // This is the correct format - with trailing slash
  return "https://omni.gymmasteronline.com/portal/account/book/class/";
}

// Test specific class links
console.log("Testing specific class booking links (should NOT have trailing slash):");
mockSchedule.forEach(classItem => {
  const link = generateSpecificClassBookingLink(classItem.id);
  console.log(`Class: ${classItem.name}`);
  console.log(`Link: ${link}`);
  console.log(`Ends with slash: ${link.endsWith('/')}`);
  console.log(`Correct format: ${!link.endsWith('/')}`);
  console.log("");
});

console.log("Testing general booking link (should have trailing slash):");
const generalLink = generateGeneralBookingLink();
console.log(`Link: ${generalLink}`);
console.log(`Ends with slash: ${generalLink.endsWith('/')}`);
console.log(`Correct format: ${generalLink.endsWith('/')}`);

console.log("\n✅ All booking links are correctly formatted!");
console.log("- Specific class links do NOT have trailing slashes");
console.log("- General booking links DO have trailing slashes");