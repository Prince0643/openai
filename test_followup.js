// Simple test to check if follow-up text is included
import { readFileSync } from 'fs';

const response = `Here's today's schedule:
11:14 PM: Handstands (all levels) with Mélanie Beaudette
11:14 PM: Strength Training (barbells full body) with Damion Greenaway
11:44 PM: Sunset Hatha Yoga
Let me know which day you'd like to see next.`;

console.log('Response includes follow-up text:', response.includes('Let me know which day you\'d like to see next.'));
console.log('Response line count:', response.split('\n').length);