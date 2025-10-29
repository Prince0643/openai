import { 
  addTemplate, 
  approveTemplate, 
  isTemplateApproved, 
  optInUser, 
  optOutUser, 
  isUserOptedIn, 
  getOptedInUsers, 
  sendBroadcast 
} from "./broadcastManager.js";

async function testBroadcastFunctionality() {
  console.log("Testing broadcast functionality...\n");
  
  // Test 1: Add templates
  console.log("=== Test 1: Adding templates ===");
  addTemplate("welcome_msg", "Welcome to Omni Gym! Check out our classes this week.", false);
  addTemplate("promo_msg", "Special offer: 20% off memberships this month!", true);
  addTemplate("reminder_msg", "Don't forget your class tomorrow at 6 PM!", false);
  
  console.log("Templates added successfully\n");
  
  // Test 2: Approve a template
  console.log("=== Test 2: Approving templates ===");
  approveTemplate("welcome_msg");
  approveTemplate("reminder_msg");
  
  console.log("Templates approved successfully\n");
  
  // Test 3: Check template approval status
  console.log("=== Test 3: Checking template approval status ===");
  console.log(`welcome_msg approved: ${isTemplateApproved("welcome_msg")}`);
  console.log(`promo_msg approved: ${isTemplateApproved("promo_msg")}`);
  console.log(`reminder_msg approved: ${isTemplateApproved("reminder_msg")}`);
  console.log(`nonexistent_msg approved: ${isTemplateApproved("nonexistent_msg")}\n`);
  
  // Test 4: Opt-in users
  console.log("=== Test 4: Opting in users ===");
  optInUser("user_001", { email: "user1@example.com", phone: "+1234567890" });
  optInUser("user_002", { email: "user2@example.com", phone: "+1234567891" });
  optInUser("user_003", { email: "user3@example.com", phone: "+1234567892" });
  
  console.log("Users opted in successfully\n");
  
  // Test 5: Check opt-in status
  console.log("=== Test 5: Checking opt-in status ===");
  console.log(`user_001 opted in: ${isUserOptedIn("user_001")}`);
  console.log(`user_002 opted in: ${isUserOptedIn("user_002")}`);
  console.log(`user_004 opted in: ${isUserOptedIn("user_004")}\n`);
  
  // Test 6: Get all opted-in users
  console.log("=== Test 6: Getting all opted-in users ===");
  const optedInUsers = getOptedInUsers();
  console.log(`Opted-in users: ${optedInUsers.join(", ")}\n`);
  
  // Test 7: Send broadcast to all opted-in users
  console.log("=== Test 7: Sending broadcast to all opted-in users ===");
  const result1 = sendBroadcast("welcome_msg");
  console.log(`Broadcast result: ${JSON.stringify(result1)}\n`);
  
  // Test 8: Send test broadcast to specific users
  console.log("=== Test 8: Sending test broadcast ===");
  const result2 = sendBroadcast("promo_msg", ["user_001", "user_002"]);
  console.log(`Test broadcast result: ${JSON.stringify(result2)}\n`);
  
  // Test 9: Try to send broadcast with unapproved template
  console.log("=== Test 9: Attempting to send unapproved template ===");
  const result3 = sendBroadcast("unapproved_template");
  console.log(`Unapproved template result: ${JSON.stringify(result3)}\n`);
  
  // Test 10: Opt-out a user and try to send broadcast
  console.log("=== Test 10: Opting out user and sending broadcast ===");
  optOutUser("user_002");
  console.log(`user_002 opted in after opt-out: ${isUserOptedIn("user_002")}`);
  
  const result4 = sendBroadcast("reminder_msg", ["user_001", "user_002", "user_003"]);
  console.log(`Broadcast after opt-out result: ${JSON.stringify(result4)}\n`);
  
  console.log("All tests completed!");
}

testBroadcastFunctionality();