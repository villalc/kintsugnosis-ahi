const { buildSafeResponse } = require('../lib/response_schema');

// Generate a sample response that mimics a real API response
const response = buildSafeResponse("This is a sample response generated for contract verification.", {
    hash: "00000000000000000000000000000000",
    stability: 0.99,
    status: "VERIFIED",
    verdict: {
        action: "ALLOW",
        category: "clean",
        confidence: 0.99,
        reasoning: "Sample reasoning",
        flags: []
    }
});

console.log(JSON.stringify(response, null, 2));
