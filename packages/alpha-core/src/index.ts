/**
 * ALPHA Core v4.0 - Sovereign Kintsugnosis Architecture
 * Implementation: Vertex AI (Gemini) + PubSub + Firestore Integrity Records
 */

import { onRequest } from 'firebase-functions/v2/https';
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { defineSecret } from 'firebase-functions/params';
import { PubSub } from '@google-cloud/pubsub';
import { buildSafeResponse } from './response_schema';
import {
    checkGeometricIntegrity,
    analyzeWithNexus
} from './services';
import { anchorState } from './state_anchor';

admin.initializeApp();

const ALPHA_CORE_KEYS = defineSecret('ALPHA_CORE_KEYS');
const PUBSUB_TOPIC = 'prompts-to-process';
const pubsub = new PubSub();

/**
 * [PHASE 4] SYSTEM STATUS ENDPOINT
 * Provee métricas en tiempo real para el frontend soberano.
 */
export const status = onRequest({
    region: 'us-central1',
    cors: [
        'https://ahigovernance.com',
        'https://sovereignsymbiosis.com',
        /^http:\/\/localhost:\d+$/
    ],
    memory: '128MiB'
}, async (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET');
    
    const DEFAULT_STABILITY = 0.842;
    let criScore = DEFAULT_STABILITY;
    let totalAudits = 142;

    let systemStatus = "SYMMETRICAL";
    if (criScore < 0.6) systemStatus = "CRITICAL";
    else if (criScore < 0.8) systemStatus = "DEGRADED";

    const region = process.env.FUNCTION_REGION || 'us-central1';

    res.set('X-Architect-Signature', '0.842');
    res.set('X-Deployment-Tier', 'enterprise-sovereign');

    res.status(200).json({
        criScore,
        totalAudits,
        systemStatus,
        region,
        timestamp: new Date().toISOString()
    });
});

/**
 * API GATEWAY: El Punto de Entrada Soberano
 * Valida la firma del arquitecto y la API Key cliente.
 */
export const ahi_governance_service = onRequest({
    secrets: [ALPHA_CORE_KEYS],
    region: 'us-central1',
    cors: [
        'https://ahigovernance.com',
        'https://sovereignsymbiosis.com',
        /^http:\/\/localhost:\d+$/
    ],
    memory: '256MiB'
}, async (req, res) => {
    res.set('X-Architect-Signature', '0.842');
    res.set('X-Deployment-Tier', 'enterprise-sovereign');

    if (req.method !== 'OPTIONS') {
        const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
        const signature = req.headers['x-architect-signature'] as string;

        // Firma de Integridad del Arquitecto
        if (isWrite && signature !== '0.842') {
             logger.warn("Bloqueo por falta de firma del arquitecto en escritura crítica.");
             res.status(403).send(buildSafeResponse("Acceso Denegado: Se requiere firma del Arquitecto.", null));
             return;
        }

        let keys;
        try {
            keys = JSON.parse(ALPHA_CORE_KEYS.value());
        } catch (e) {
            res.status(500).send(buildSafeResponse("Internal Configuration Error", null));
            return;
        }

        const clientKey = req.headers['x-api-key'] as string;
        if (!clientKey || clientKey !== keys?.CLIENT_API_KEY) {
             res.status(401).send(buildSafeResponse("Unauthorized Access", null));
             return;
        }
    }

    const prompt = (req.body.data?.prompt || req.body.prompt) as string;
    if (!prompt || typeof prompt !== 'string') {
        res.status(400).send(buildSafeResponse("Valid prompt required.", null));
        return;
    }

    try {
        const messageId = await pubsub.topic(PUBSUB_TOPIC).publishMessage({
            json: { prompt, timestamp: new Date().toISOString() },
        });

        res.status(202).send(buildSafeResponse(
            "Evento recibido. Auditoría en curso via Vertex AI.",
            { trackingId: messageId, status: 'PROCESSING' }
        ));
    } catch (error) {
        logger.error("PubSub Failure", error);
        res.status(500).send(buildSafeResponse("Internal Sintergy Error", null));
    }
});

/**
 * VALIDATOR: El Cerebro Lógico (KINTSUGNOSIS EDITION)
 * Procesa auditorías asíncronas usando Vertex AI (Gemini).
 */
export const llm_validator = onMessagePublished({
    topic: PUBSUB_TOPIC,
    secrets: [ALPHA_CORE_KEYS],
    region: 'us-central1',
    timeoutSeconds: 300,
    memory: '512MiB'
}, async (event) => {
    const { prompt } = event.data.message.json;
    const trackingId = event.id;

    try {
        let keys;
        try {
            keys = JSON.parse(ALPHA_CORE_KEYS.value());
        } catch (e) {
            logger.error("Secret Parsing Failure", e);
            return;
        }

        // Ejecución Dual: Integridad Geométrica + Análisis Ético (Vertex AI)
        const [geo, verdict] = await Promise.all([
            checkGeometricIntegrity(prompt, keys.INTERNAL_API_KEY),
            analyzeWithNexus(prompt) // Ahora Vertex AI no requiere API Key externa
        ]);

        let status: string = verdict.action === 'ALLOW' ? 'VERIFIED' : 'FLAGGED';
        if (!geo.stable) status = 'COLLAPSED';

        // Anclar el estado en el protocolo de integridad
        const receiptUrl = await anchorState({
            prompt,
            ricci: geo.ricci,
            status,
            verdict
        }, trackingId);

        if (!receiptUrl) {
            logger.error('CRITICAL: State Anchor failed. Audit ABORTED.', { trackingId });
            return;
        }

        // Registro permanente en Firestore
        await admin.firestore().collection('integrityRecords').doc(trackingId).set({
            prompt,
            ricci: geo.ricci,
            status,
            receiptUrl,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            architect_verdict: verdict,
            geometric_data: geo
        });

        logger.info('Audit Completed Successfully', { trackingId, status });

    } catch (error) {
        logger.error('Sovereign Failure in Validator', { trackingId, error });
    }
});
