/**
 * GymMaster API Integration Module
 * This module provides functions to interact with the GymMaster API
 */

import fetch from "node-fetch";

class GymMasterAPI {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Make a request to the GymMaster API
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'User-Agent': 'curl/7.55.1', // Use the same User-Agent as curl
        'Accept': '*/*'
      }
    };
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };
    
    try {
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, mergedOptions);
      const text = await response.text();
      
      // Check if response is HTML (error page)
      if (text.startsWith('<!doctype') || text.startsWith('<html')) {
        throw new Error(`Received HTML error page instead of JSON. Status: ${response.status}. Response preview: ${text.substring(0, 200)}...`);
      }
      
      // Try to parse JSON
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        throw new Error(`Invalid JSON response from GymMaster API: ${parseError.message}. Response: ${text.substring(0, 200)}...`);
      }
      
      if (!response.ok) {
        throw new Error(`GymMaster API error: ${response.status} - ${data.error || 'Unknown error'}. Response: ${JSON.stringify(data)}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Failed to call GymMaster API endpoint ${endpoint}:`, error.message);
      throw new Error(`Failed to call GymMaster API: ${error.message}`);
    }
  }

  /**
   * Login as a member
   * POST /portal/api/v1/login
   */
  async loginMember(email, password) {
    const formData = new URLSearchParams();
    formData.append('api_key', this.apiKey);
    formData.append('email', email);
    formData.append('password', password);
    
    const response = await this.makeRequest('/portal/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    
    return {
      token: response.token,
      memberId: response.member_id,
      name: response.member_name
    };
  }

  /**
   * Get member profile
   * GET /portal/api/v1/member/profile
   */
  async getMemberProfile(token) {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      token: token
    });
    
    const response = await this.makeRequest(`/portal/api/v1/member/profile?${params.toString()}`, {
      method: 'GET'
    });
    
    return response.result;
  }

  /**
   * Get member memberships
   * GET /portal/api/v1/member/memberships
   */
  async getMemberMemberships(token) {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      token: token
    });
    
    const response = await this.makeRequest(`/portal/api/v1/member/memberships?${params.toString()}`, {
      method: 'GET'
    });
    
    return response.result.map(membership => ({
      membershipName: membership.name,
      status: membership.status,
      expiry: membership.expiry_date,
      creditsRemaining: membership.credits_remaining
    }));
  }

  /**
   * Get class schedule
   * GET /portal/api/v1/booking/classes/schedule
   */
  async getClassSchedule(week, companyId = null) {
    // Ensure week is in YYYY-MM-DD format
    let formattedWeek = week;
    console.log("Original week parameter:", week);
    
    if (week && !/^\d{4}-\d{2}-\d{2}$/.test(week)) {
      // If not in correct format, try to convert
      try {
        const date = new Date(week);
        formattedWeek = date.toISOString().split('T')[0];
        console.log("Converted week parameter:", formattedWeek);
      } catch (e) {
        // If conversion fails, use today's date
        formattedWeek = new Date().toISOString().split('T')[0];
        console.log("Using today's date:", formattedWeek);
      }
    }
    
    // If no week provided, use today
    if (!formattedWeek) {
      formattedWeek = new Date().toISOString().split('T')[0];
      console.log("No week provided, using today:", formattedWeek);
    }
    
    const params = new URLSearchParams({
      api_key: this.apiKey,
      week: formattedWeek
    });
    
    if (companyId) {
      params.append('companyid', companyId);
    }
    
    console.log(`Calling GymMaster API with week: ${formattedWeek}`);
    const response = await this.makeRequest(`/portal/api/v1/booking/classes/schedule?${params.toString()}`, {
      method: 'GET'
    });
    
    console.log("GymMaster API response:", JSON.stringify(response, null, 2));
    
    return response.result.map(classItem => ({
      classId: classItem.id,
      name: classItem.bookingname || classItem.name,
      coach: classItem.staffname || null,
      branch: classItem.companyname || null,
      start: `${classItem.arrival_iso}T${classItem.starttime}`,
      end: `${classItem.arrival_iso}T${classItem.endtime}`,
      seatsAvailable: classItem.spacesfree
    }));
  }

  /**
   * Get available seats for a class
   * GET /portal/api/v1/booking/classes/seats
   */
  async getClassSeats(bookingId, token = null) {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      bookingid: bookingId
    });
    
    if (token) {
      params.append('token', token);
    }
    
    const response = await this.makeRequest(`/portal/api/v1/booking/classes/seats?${params.toString()}`, {
      method: 'GET'
    });
    
    return {
      classId: bookingId,
      seatsAvailable: response.result.length
    };
  }

  /**
   * Book a class
   * POST /portal/api/v2/booking/classes
   */
  async bookClass(token, classId) {
    const formData = new URLSearchParams();
    formData.append('api_key', this.apiKey);
    formData.append('token', token);
    formData.append('classid', classId);
    
    const response = await this.makeRequest('/portal/api/v2/booking/classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    
    return {
      bookingId: response.result,
      status: 'confirmed'
    };
  }

  /**
   * Cancel a booking
   * POST /portal/api/v1/member/cancelbooking
   */
  async cancelBooking(token, bookingId) {
    const formData = new URLSearchParams();
    formData.append('api_key', this.apiKey);
    formData.append('token', token);
    formData.append('bookingid', bookingId);
    
    const response = await this.makeRequest('/portal/api/v1/member/cancelbooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    
    return {
      bookingId: bookingId,
      status: 'cancelled'
    };
  }

  /**
   * Create a prospect (lead capture)
   * POST /portal/api/v1/prospect/create
   */
  async createProspect(name, email, phone, interest) {
    const formData = new URLSearchParams();
    formData.append('api_key', this.apiKey);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('notes', interest);
    
    const response = await this.makeRequest('/portal/api/v1/prospect/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    
    return {
      leadId: response.result
    };
  }

  /**
   * List available memberships
   * GET /portal/api/v1/memberships
   */
  async listMemberships() {
    const params = new URLSearchParams({
      api_key: this.apiKey
    });
    
    const response = await this.makeRequest(`/portal/api/v1/memberships?${params.toString()}`, {
      method: 'GET'
    });
    
    return response.result;
  }

  /**
   * List clubs
   * GET /portal/api/v1/companies
   */
  async listClubs() {
    const params = new URLSearchParams({
      api_key: this.apiKey
    });
    
    const response = await this.makeRequest(`/portal/api/v1/companies?${params.toString()}`, {
      method: 'GET'
    });
    
    return response.result;
  }
}

export default GymMasterAPI;