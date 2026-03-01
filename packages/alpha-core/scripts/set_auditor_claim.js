
const admin = require('firebase-admin');

// Check arguments
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Usage: node set_auditor_claim.js <email_or_uid>');
    process.exit(1);
}

const identifier = args[0];

// Initialize Firebase Admin
// Assuming GOOGLE_APPLICATION_CREDENTIALS is set or running in an environment with default credentials
// For local emulator use, we might need specific config, but this script is intended for admin use against real or emulated auth.
if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    console.log(`Connecting to Auth Emulator at ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
    admin.initializeApp({
        projectId: process.env.GCP_PROJECT_ID || 'demo-project'
    });
} else {
    admin.initializeApp();
}

async function setAuditorClaim(id) {
    try {
        let user;
        // Try to fetch by UID first
        try {
            user = await admin.auth().getUser(id);
        } catch (e) {
            // If failed, try by email
            try {
                user = await admin.auth().getUserByEmail(id);
            } catch (e2) {
                console.error(`Error: User not found with UID or Email: ${id}`);
                process.exit(1);
            }
        }

        const currentClaims = user.customClaims || {};
        const newClaims = { ...currentClaims, auditor: true };

        await admin.auth().setCustomUserClaims(user.uid, newClaims);

        console.log(`Successfully set 'auditor' claim for user: ${user.email} (${user.uid})`);
        console.log('New claims:', newClaims);

        // Verify
        const userRecord = await admin.auth().getUser(user.uid);
        console.log('Verified claims from Auth:', userRecord.customClaims);

    } catch (error) {
        console.error('Error setting custom claim:', error);
        process.exit(1);
    }
}

setAuditorClaim(identifier);
