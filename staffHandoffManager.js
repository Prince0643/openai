import fs from 'fs';
import path from 'path';

// File to store staff handoff tickets
const TICKETS_STORAGE_FILE = path.join(process.cwd(), 'staff_tickets.json');

/**
 * Load tickets data from file
 * @returns {Object} Tickets data
 */
function loadTicketsData() {
  try {
    if (fs.existsSync(TICKETS_STORAGE_FILE)) {
      const data = fs.readFileSync(TICKETS_STORAGE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading tickets data:', error);
  }
  
  // Default structure
  return {
    tickets: {},
    nextTicketId: 1
  };
}

/**
 * Save tickets data to file
 * @param {Object} ticketsData Tickets data to save
 */
function saveTicketsData(ticketsData) {
  try {
    fs.writeFileSync(TICKETS_STORAGE_FILE, JSON.stringify(ticketsData, null, 2));
  } catch (error) {
    console.error('Error saving tickets data:', error);
  }
}

/**
 * Create a new staff handoff ticket
 * @param {Object} ticketData Ticket information
 * @param {string} ticketData.userId User ID requesting help
 * @param {string} ticketData.message User's message
 * @param {string} ticketData.contactInfo User's contact information
 * @param {string} ticketData.category Category of request (lost & found, complaints, unclear, etc.)
 * @param {string} ticketData.threadId Associated conversation thread ID
 * @returns {Object} Created ticket information
 */
function createTicket(ticketData) {
  const ticketsData = loadTicketsData();
  
  // Generate ticket ID
  const ticketId = `TICKET-${ticketsData.nextTicketId.toString().padStart(4, '0')}`;
  ticketsData.nextTicketId++;
  
  // Create ticket
  const ticket = {
    ticketId: ticketId,
    userId: ticketData.userId,
    message: ticketData.message,
    contactInfo: ticketData.contactInfo,
    category: ticketData.category,
    threadId: ticketData.threadId,
    createdAt: new Date().toISOString(),
    status: 'open',
    assignedTo: null,
    resolvedAt: null
  };
  
  // Store ticket
  ticketsData.tickets[ticketId] = ticket;
  
  // Save data
  saveTicketsData(ticketsData);
  
  // Log for staff notification (in a real implementation, this would send an actual notification)
  console.log(`=== STAFF NOTIFICATION ===`);
  console.log(`New ticket created: ${ticketId}`);
  console.log(`Category: ${ticket.category}`);
  console.log(`User: ${ticket.userId}`);
  console.log(`Message: ${ticket.message}`);
  console.log(`Contact: ${JSON.stringify(ticket.contactInfo)}`);
  console.log(`========================`);
  
  return ticket;
}

/**
 * Get ticket by ID
 * @param {string} ticketId Ticket ID
 * @returns {Object|null} Ticket information or null if not found
 */
function getTicket(ticketId) {
  const ticketsData = loadTicketsData();
  return ticketsData.tickets[ticketId] || null;
}

/**
 * Get all open tickets
 * @returns {Array} List of open tickets
 */
function getOpenTickets() {
  const ticketsData = loadTicketsData();
  return Object.values(ticketsData.tickets).filter(ticket => ticket.status === 'open');
}

/**
 * Assign ticket to staff member
 * @param {string} ticketId Ticket ID
 * @param {string} staffMember Staff member name/ID
 * @returns {boolean} Success status
 */
function assignTicket(ticketId, staffMember) {
  const ticketsData = loadTicketsData();
  
  if (ticketsData.tickets[ticketId]) {
    ticketsData.tickets[ticketId].assignedTo = staffMember;
    ticketsData.tickets[ticketId].assignedAt = new Date().toISOString();
    saveTicketsData(ticketsData);
    return true;
  }
  
  return false;
}

/**
 * Resolve ticket
 * @param {string} ticketId Ticket ID
 * @returns {boolean} Success status
 */
function resolveTicket(ticketId) {
  const ticketsData = loadTicketsData();
  
  if (ticketsData.tickets[ticketId]) {
    ticketsData.tickets[ticketId].status = 'resolved';
    ticketsData.tickets[ticketId].resolvedAt = new Date().toISOString();
    saveTicketsData(ticketsData);
    return true;
  }
  
  return false;
}

/**
 * Get ticket statistics
 * @returns {Object} Ticket statistics
 */
function getTicketStats() {
  const ticketsData = loadTicketsData();
  const allTickets = Object.values(ticketsData.tickets);
  
  const stats = {
    total: allTickets.length,
    open: allTickets.filter(t => t.status === 'open').length,
    resolved: allTickets.filter(t => t.status === 'resolved').length,
    byCategory: {}
  };
  
  // Count by category
  allTickets.forEach(ticket => {
    const category = ticket.category || 'uncategorized';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  });
  
  return stats;
}

export {
  createTicket,
  getTicket,
  getOpenTickets,
  assignTicket,
  resolveTicket,
  getTicketStats
};