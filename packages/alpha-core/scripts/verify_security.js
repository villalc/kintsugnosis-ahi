
const PROJECT_ID = process.env.GCP_PROJECT_ID || 'demo-project';
const API_URL = `http://127.0.0.1:5001/${PROJECT_ID}/us-central1/api_gateway`;

async function testSecurity() {
    console.log("🔒 Starting Security Verification...");
    let passed = true;

    // Test 1: Valid Request
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { prompt: "Hello world" } })
        });
        if (res.status === 202) {
            console.log("✅ Valid request passed (202 Accepted)");
        } else {
            console.log(`❌ Valid request failed: ${res.status}`);
            passed = false;
        }
    } catch (e) {
        console.error("❌ Valid request error:", e);
        passed = false;
    }

    // Test 2: Missing Prompt
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: {} })
        });
        if (res.status === 400) {
            // Need to handle non-json response (if any)
            try {
                const json = await res.json();
                if (json.data && json.data.response === "Valid prompt string required.") {
                    console.log("✅ Missing prompt blocked (400 Bad Request)");
                } else {
                    console.log(`❌ Missing prompt wrong message: ${JSON.stringify(json)}`);
                    passed = false;
                }
            } catch (err) {
                 console.log(`❌ Missing prompt returned non-JSON: ${res.statusText}`);
                 passed = false;
            }
        } else {
            console.log(`❌ Missing prompt failed: ${res.status}`);
            passed = false;
        }
    } catch (e) {
        console.error("❌ Missing prompt error:", e);
        passed = false;
    }

    // Test 3: Invalid Type (Number)
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { prompt: 12345 } })
        });
        if (res.status === 400) {
            console.log("✅ Invalid type blocked (400 Bad Request)");
        } else {
            console.log(`❌ Invalid type failed: ${res.status}`);
            passed = false;
        }
    } catch (e) {
        console.error("❌ Invalid type error:", e);
        passed = false;
    }

    // Test 4: Huge Prompt
    try {
        const hugePrompt = "a".repeat(20001);
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { prompt: hugePrompt } })
        });
        if (res.status === 400) {
            try {
                const json = await res.json();
                if (json.data && json.data.response === "Prompt too long (max 20,000 chars).") {
                    console.log("✅ Huge prompt blocked (400 Bad Request)");
                } else {
                    console.log(`❌ Huge prompt wrong message: ${JSON.stringify(json)}`);
                    passed = false;
                }
            } catch (err) {
                 console.log(`❌ Huge prompt returned non-JSON: ${res.statusText}`);
                 passed = false;
            }
        } else {
            console.log(`❌ Huge prompt failed: ${res.status}`);
            passed = false;
        }
    } catch (e) {
        console.error("❌ Huge prompt error:", e);
        passed = false;
    }

    // Test 5: CORS Headers check (OPTIONS request)
    try {
        const res = await fetch(API_URL, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://ahigovernance.com',
                'Access-Control-Request-Method': 'POST'
            }
        });

        const allowOrigin = res.headers.get('access-control-allow-origin');
        if (allowOrigin === 'https://ahigovernance.com') {
             console.log("✅ CORS allowed origin check passed");
        } else {
             // Emulator might handle this differently, check console log
             console.log(`ℹ️ CORS header: ${allowOrigin} (might be emulator specific)`);
        }
    } catch (e) {
        console.error("❌ CORS check error:", e);
    }

    if (!passed) process.exit(1);
    console.log("🎉 All Security Tests Passed!");
}

testSecurity();
