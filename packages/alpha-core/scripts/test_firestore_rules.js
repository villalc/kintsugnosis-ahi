
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'demo-project';

// Load rules from root
const rules = fs.readFileSync(path.resolve(__dirname, '../../../firestore.rules'), 'utf8');

describe('Firestore Rules - Biopsy Creation', () => {
    let testEnv;

    before(async () => {
        testEnv = await initializeTestEnvironment({
            projectId: PROJECT_ID,
            firestore: {
                rules: rules,
                host: '127.0.0.1',
                port: 8080
            }
        });
    });

    after(async () => {
        await testEnv.cleanup();
    });

    beforeEach(async () => {
        await testEnv.clearFirestore();
    });

    it('should DENY creating biopsy if authenticated without auditor claim', async () => {
        const alice = testEnv.authenticatedContext('alice');
        await assertFails(alice.firestore().collection('biopsies').doc('test_1').set({
            biopsy_id: 'test_1',
            status: 'pending',
            metrics: {},
            timestamp: new Date().toISOString()
        }));
    });

    it('should ALLOW creating biopsy if authenticated with auditor claim', async () => {
        const bob = testEnv.authenticatedContext('bob', { auditor: true });
        await assertSucceeds(bob.firestore().collection('biopsies').doc('test_2').set({
            biopsy_id: 'test_2',
            status: 'pending',
            metrics: {},
            timestamp: new Date().toISOString()
        }));
    });

    it('should DENY creating biopsy if unauthenticated', async () => {
        const unauth = testEnv.unauthenticatedContext();
        await assertFails(unauth.firestore().collection('biopsies').doc('test_3').set({
            biopsy_id: 'test_3',
            status: 'pending',
            metrics: {},
            timestamp: new Date().toISOString()
        }));
    });
});
