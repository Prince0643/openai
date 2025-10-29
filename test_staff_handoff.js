import { createTicket, getTicket, getOpenTickets, assignTicket, resolveTicket, getTicketStats } from "./staffHandoffManager.js";

async function testStaffHandoff() {
  console.log("Testing staff handoff functionality...\n");
  
  // Test 1: Create tickets
  console.log("=== Test 1: Creating tickets ===");
  
  const ticket1 = createTicket({
    userId: "user_001",
    message: "I lost my water bottle at the gym yesterday around 6 PM",
    contactInfo: { email: "user1@example.com", phone: "+1234567890" },
    category: "lost_and_found",
    threadId: "thread_123"
  });
  
  console.log(`Created ticket: ${ticket1.ticketId}\n`);
  
  const ticket2 = createTicket({
    userId: "user_002",
    message: "The air conditioning in the main workout area isn't working",
    contactInfo: { email: "user2@example.com", phone: "+1234567891" },
    category: "complaint",
    threadId: "thread_456"
  });
  
  console.log(`Created ticket: ${ticket2.ticketId}\n`);
  
  const ticket3 = createTicket({
    userId: "user_003",
    message: "I'm not sure which membership plan is right for me",
    contactInfo: { email: "user3@example.com", phone: "+1234567892" },
    category: "unclear_request",
    threadId: "thread_789"
  });
  
  console.log(`Created ticket: ${ticket3.ticketId}\n`);
  
  // Test 2: Retrieve ticket
  console.log("=== Test 2: Retrieving ticket ===");
  const retrievedTicket = getTicket(ticket1.ticketId);
  console.log(`Retrieved ticket: ${retrievedTicket.ticketId}`);
  console.log(`Ticket category: ${retrievedTicket.category}`);
  console.log(`Ticket message: ${retrievedTicket.message}\n`);
  
  // Test 3: Get open tickets
  console.log("=== Test 3: Getting open tickets ===");
  const openTickets = getOpenTickets();
  console.log(`Open tickets: ${openTickets.length}`);
  openTickets.forEach(ticket => {
    console.log(`  - ${ticket.ticketId}: ${ticket.category} from ${ticket.userId}`);
  });
  console.log();
  
  // Test 4: Assign ticket
  console.log("=== Test 4: Assigning ticket ===");
  const assigned = assignTicket(ticket1.ticketId, "staff_member_001");
  console.log(`Ticket ${ticket1.ticketId} assigned: ${assigned}`);
  console.log();
  
  // Test 5: Resolve ticket
  console.log("=== Test 5: Resolving ticket ===");
  const resolved = resolveTicket(ticket2.ticketId);
  console.log(`Ticket ${ticket2.ticketId} resolved: ${resolved}`);
  console.log();
  
  // Test 6: Get updated open tickets
  console.log("=== Test 6: Getting updated open tickets ===");
  const updatedOpenTickets = getOpenTickets();
  console.log(`Open tickets after resolution: ${updatedOpenTickets.length}`);
  updatedOpenTickets.forEach(ticket => {
    console.log(`  - ${ticket.ticketId}: ${ticket.category} from ${ticket.userId} (assigned: ${ticket.assignedTo || 'no'})`);
  });
  console.log();
  
  // Test 7: Get ticket statistics
  console.log("=== Test 7: Getting ticket statistics ===");
  const stats = getTicketStats();
  console.log(`Total tickets: ${stats.total}`);
  console.log(`Open tickets: ${stats.open}`);
  console.log(`Resolved tickets: ${stats.resolved}`);
  console.log("Tickets by category:");
  Object.keys(stats.byCategory).forEach(category => {
    console.log(`  - ${category}: ${stats.byCategory[category]}`);
  });
  console.log();
  
  console.log("All tests completed!");
}

testStaffHandoff();