import * as assert from 'node:assert';
import { buildSafeResponse, validateResponseContract, enforceResponseContract } from './response_schema';

console.log('--- AHI 3.0 (BABEL) INTEGRITY AUDIT: 20 TESTS ---');

// Test 1: Validate buildSafeResponse defaults
console.log('Test 1: buildSafeResponse defaults');
const res1 = buildSafeResponse("Error message", null);
assert.strictEqual(res1.data.response, "Error message");
assert.strictEqual(res1.data.certification.hash, "00000000000000000000000000000000");
assert.strictEqual(res1.data.certification.stability, 0.0);
assert.ok(validateResponseContract(res1));

// Test 2: Validate full response
console.log('Test 2: full response');
const cert = { hash: 'abc', stability: 0.9, status: 'VERIFIED' };
const res2 = buildSafeResponse("Success", cert);
assert.strictEqual(res2.data.response, "Success");
assert.strictEqual(res2.data.certification.hash, "abc");
assert.strictEqual(res2.data.certification.stability, 0.9);
assert.ok(validateResponseContract(res2));

// Test 3: Validate invalid schema detection
console.log('Test 3: Invalid schema detection');
assert.strictEqual(validateResponseContract(null), false);
assert.strictEqual(validateResponseContract({}), false);
assert.strictEqual(validateResponseContract({ data: {} }), false);
assert.strictEqual(validateResponseContract({ data: { response: 123 } }), false);
assert.strictEqual(validateResponseContract({ data: { response: 'ok' } }), false);
assert.strictEqual(validateResponseContract({ data: { response: 'ok', certification: {} } }), false);

// Test 4: Extras inclusion
console.log('Test 4: Extras');
const res4 = buildSafeResponse("Err", null, { code: 500 });
assert.strictEqual(res4.data['code'], 500);
assert.ok(validateResponseContract(res4));

// Test 5: Enforce Contract (Coercion)
console.log('Test 5: Enforce Contract (Coercion)');
const enforced1 = enforceResponseContract(null);
assert.ok(validateResponseContract(enforced1));
assert.strictEqual(enforced1.data.response, "");

// Test 6: Golden Test (Real Example from CONTRACT.md)
console.log('Test 6: Golden Test');
const goldenPayload = {
  data: {
    response: "[ALPHA NODE - VERIFICADO ✅]: El prompt ha sido validado...",
    certification: {
      hash: "a1b2c3d4e5f6...",
      stability: 0.95,
      status: "VERIFIED",
      verdict: { action: "ALLOW", category: "clean", confidence: 0.95 }
    }
  }
};
assert.ok(validateResponseContract(goldenPayload));

// Test 7: Edge Cases - Type Coercion
console.log('Test 7: Edge Cases - Type Coercion');
const numRes = enforceResponseContract({ data: { response: 12345 } });
assert.strictEqual(numRes.data.response, "");

// Test 8: Deep Extras Preservation
console.log('Test 8: Deep Extras Preservation');
const deepRes = enforceResponseContract({ response: "ok", certification: { hash: "h", stability: 1 }, meta: { timestamp: 12345 } });
assert.strictEqual(deepRes.data['meta'].timestamp, 12345);

// Test 9: Primitive Payloads
console.log('Test 9: Primitive Payloads');
assert.ok(validateResponseContract(enforceResponseContract("just a string")));

// Test 10: Malformed Data Wrapper
console.log('Test 10: Malformed Data Wrapper');
assert.ok(validateResponseContract(enforceResponseContract({ data: null })));

// Test 11: Partial Certification Preservation
console.log('Test 11: Partial Certification');
const preservedRes = enforceResponseContract({ response: "ok", certification: { status: "VERIFIED" } });
assert.strictEqual(preservedRes.data.certification.hash, "00000000000000000000000000000000");

// --- NEW BABEL EXPANSION TESTS (12-20) ---

// Test 12: Ethical Limit - Social Engineering Attempt
console.log('Test 12: Ethical Limit - Social Engineering (BLOCK)');
const socialEng = buildSafeResponse("Access Denied", { hash: "ethical-001", stability: 0.0, status: "BLOCK", verdict: { action: "BLOCK", category: "social_engineering" } });
assert.strictEqual(socialEng.data.certification.verdict.action, "BLOCK");
assert.ok(validateResponseContract(socialEng));

// Test 13: Ricci Curvature Threshold Check (Low Stability)
console.log('Test 13: Ricci Curvature (DISTORTION)');
const lowRicci = buildSafeResponse("Unstable structure", { hash: "ricci-low", stability: 0.05, status: "DISTORTION" });
assert.ok(lowRicci.data.certification.stability < 0.0927);
assert.ok(validateResponseContract(lowRicci));

// Test 14: Weyl Resonance (ASK) - Ambiguity handling
console.log('Test 14: Weyl Resonance (ASK)');
const askRes = buildSafeResponse("Clarification needed", { hash: "weyl-amb", stability: 0.5, status: "ASK" });
assert.strictEqual(askRes.data.certification.status, "ASK");

// Test 15: Cross-Site Integrity - Sovereign Symbiosis Terms
console.log('Test 15: Cross-Site Integrity (Privacy/Terms)');
const termsCheck = buildSafeResponse("Terms verified", { hash: "symbiosis-v1", stability: 1.0, status: "VERIFIED" }, { site: "sovereignsymbiosis.com" });
assert.strictEqual(termsCheck.data['site'], "sovereignsymbiosis.com");

// Test 16: Massive Payload Stress
console.log('Test 16: Massive Payload Stress');
const bigData = "A".repeat(10000);
const massiveRes = buildSafeResponse(bigData, { hash: "big", stability: 0.9 });
assert.strictEqual(massiveRes.data.response.length, 10000);

// Test 17: Unicode and Babel Script Integrity
console.log('Test 17: Unicode/Babel Script Integrity (Greek/Math)');
const babelRes = buildSafeResponse("Ω = ∫ Ricci(g) dv", { hash: "Ω-001", stability: 0.99 });
assert.ok(babelRes.data.response.includes("Ω"));

// Test 18: Response Coercion - Missing response field
console.log('Test 18: Coercion - Missing response field');
const missingField = enforceResponseContract({ data: { certification: { hash: "h", stability: 1 } } });
assert.strictEqual(missingField.data.response, "");
assert.ok(validateResponseContract(missingField));

// Test 19: Response Coercion - Invalid Stability (String instead of Number)
console.log('Test 19: Coercion - Invalid Stability Type');
const badStability = enforceResponseContract({ data: { response: "ok", certification: { hash: "h", stability: "high" } } });
assert.strictEqual(badStability.data.certification.stability, 0.0);

// Test 20: Final Integrity Check - Complete OMEGA Envelope
console.log('Test 20: OMEGA Final Envelope');
const omegaFinal = buildSafeResponse("OMEGA SYSTEM ONLINE", { 
    hash: "BABEL-AHI-3.0", 
    stability: 0.927, 
    status: "VERIFIED",
    verdict: { action: "ALLOW", category: "sovereign_core" } 
});
assert.strictEqual(omegaFinal.data.certification.stability, 0.927);
assert.ok(validateResponseContract(omegaFinal));

console.log('\n--- AUDIT COMPLETE: 20/20 PASSES ---');
process.exit(0);
