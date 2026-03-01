import * as crypto from 'crypto';
import OpenAI from 'openai';
import * as logger from 'firebase-functions/logger';
import {
    CONSTITUTIONAL_SYSTEM_PROMPT,
    ETHICAL_ANALYSIS_PROMPT,
} from './constitutional_prompts';

// Configuración de Sintergia Regional
// URL must be set via GEOMETRY_AUDIT_URL environment variable (Cloud Run endpoint)
export const GEOMETRY_AUDIT_URL = process.env.GEOMETRY_AUDIT_URL || "";

// --- Interfaces Evolucionadas ---

export interface EthicalVerdict {
    action: 'ALLOW' | 'ASK' | 'BLOCK';
    category: 'clean' | 'ambiguous' | 'adversarial' | 'harmful';
    confidence: number;
    reasoning: string;
    flags: string[];
    specialist_target?: 'ENTROPY' | 'SAP' | 'LOGIC' | 'SHIELD';
}

export interface CertificationResult {
    hash: string;
    stability: number;
    ricci_curvature?: number;
    status: 'VERIFIED' | 'FLAGGED' | 'BLOCKED' | 'COLLAPSED';
    verdict: EthicalVerdict;
    trackingId?: string;
}

// --- Helpers de Integridad ---

export const generateIntegrityHash = (data: string) => crypto.createHash('sha256').update(data).digest('hex');

export async function checkGeometricIntegrity(prompt: string, internalKey?: string): Promise<{ ricci: number, stable: boolean, fisher_gap: number, geometric_lock_status: string }> {
    // Vectorización simple para el protocolo GIP 125D
    const tensorData = new Array(125).fill(0);
    const limit = Math.min(prompt.length, 125);
    for (let i = 0; i < limit; i++) {
        tensorData[i] = (prompt.charCodeAt(i) % 255) / 127.5 - 1;
    }

    try {
        const headers: any = { 'Content-Type': 'application/json' };
        if (internalKey) {
            headers['X-Server-Auth'] = internalKey;
        }

        const response = await fetch(GEOMETRY_AUDIT_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ data: tensorData })
        });
        if (!response.ok) return { ricci: 0, stable: false, fisher_gap: 0, geometric_lock_status: 'ERROR' };
        const result = await response.json() as any;
        return {
            ricci: result.ricci_curvature || 0,
            stable: result.integrity === 'STABLE',
            fisher_gap: result.fisher_gap || 0,
            geometric_lock_status: result.geometric_lock_status || 'UNKNOWN'
        };
    } catch (e) {
        logger.error("Geometric Sentinel Unavailable", e);
        return { ricci: 0, stable: false, fisher_gap: 0, geometric_lock_status: 'UNAVAILABLE' };
    }
}

export async function analyzeWithNexus(prompt: string, apiKey: string): Promise<EthicalVerdict> {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Actuando como Router (Gemma-9B-Nexus proxy)
        messages: [
            { role: 'system', content: CONSTITUTIONAL_SYSTEM_PROMPT + "\nDetermine which specialist v4 should handle this: ENTROPY, SAP, LOGIC, or SHIELD." },
            { role: 'user', content: ETHICAL_ANALYSIS_PROMPT(prompt) }
        ],
        response_format: { type: 'json_object' }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
}
