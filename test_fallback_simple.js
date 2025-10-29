import { isNonsenseOrUnknown, handleFallback } from "./fallbackManager.js";

// Test specific cases
console.log("Testing fallback functionality...\n");

// Test nonsense detection
console.log("=== Nonsense Detection ===");
const testCases = [
  { input: "asdf", expected: true },
  { input: "12345", expected: true },
  { input: "!!!!", expected: true },
  { input: "aaaaa", expected: true },
  { input: "99999", expected: true },
  { input: "a", expected: true },
  { input: "hi", expected: false },
  { input: "hello", expected: false },
  { input: "what classes do you have", expected: false }
];

testCases.forEach(test => {
  const result = isNonsenseOrUnknown(test.input);
  console.log(`"${test.input}" -> Nonsense: ${result} (expected: ${test.expected})`);
});

console.log();

// Test fallback handling
console.log("=== Fallback Handling ===");

// Test 1: Nonsense query
console.log("Test 1: Nonsense query");
const result1 = handleFallback("user123", "asdf123", "I don't understand", "thread123");
console.log(`Response: ${result1.response}`);
console.log(`Escalated: ${result1.escalated}`);
console.log();

// Test 2: Low confidence response
console.log("Test 2: Low confidence response");
const result2 = handleFallback("user456", "What is your policy?", "I don't know about that", "thread456");
console.log(`Response: ${result2.response}`);
console.log(`Escalated: ${result2.escalated}`);
console.log();

// Test 3: Normal response
console.log("Test 3: Normal response");
const result3 = handleFallback("user789", "What classes do you have?", "We have yoga on Mondays", "thread789");
console.log(`Response: ${result3.response}`);
console.log(`Escalated: ${result3.escalated}`);