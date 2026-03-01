/**
 * STRICT RESPONSE CONTRACT VALIDATOR
 *
 * Enforces strict JSON schema compliance for all Alpha Node responses.
 * Implements fail-safe coercion to ensure no upstream errors break the
 * API contract defined in CONTRACT.md.
 */

export interface StrictCertification {
    hash: string;
    stability: number;
    fisher_gap?: number;
    status?: string;
    verdict?: any;
    [key: string]: any;
}

export interface StrictResponseData {
    response: string;
    certification: StrictCertification;
    error?: string;
    message?: string;
    [key: string]: any;
}

export interface StrictResponse {
    data: StrictResponseData;
}

/**
 * Builds a response that strictly adheres to the contract.
 * @param responseMsg The main response string (or error message if degraded).
 * @param certification Partial certification data.
 * @param extras Additional fields (e.g., error codes).
 */
export function buildSafeResponse(
    responseMsg: string,
    certification: Partial<StrictCertification> | null | undefined,
    extras: Record<string, any> = {}
): StrictResponse {
    // 1. Start with defaults
    const safeCert: StrictCertification = {
        hash: '00000000000000000000000000000000',
        stability: 0.0,
        ...certification
    };

    // 2. Force types for critical fields to ensure contract compliance
    // even if certification object has bad types (like stability: "high")
    if (typeof safeCert.hash !== 'string') {
        safeCert.hash = certification?.hash ? String(certification.hash) : '00000000000000000000000000000000';
    }

    if (typeof safeCert.stability !== 'number') {
        safeCert.stability = 0.0;
    }

    return {
        data: {
            response: responseMsg || "",
            certification: safeCert,
            ...extras
        }
    };
}

/**
 * Validates if a response strictly adheres to the contract.
 */
export function validateResponseContract(payload: any): boolean {
    try {
        if (!payload || typeof payload !== 'object') return false;
        if (!payload.data || typeof payload.data !== 'object') return false;

        const { response, certification } = payload.data;

        if (typeof response !== 'string') return false;
        if (!certification || typeof certification !== 'object') return false;

        if (typeof certification.hash !== 'string') return false;
        if (typeof certification.stability !== 'number') return false;

        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Enforces the response contract by coercing invalid inputs into a valid StrictResponse.
 * @param payload The potentially invalid payload
 * @returns A strictly valid response object
 */
export function enforceResponseContract(payload: any): StrictResponse {
    // 1. If it's already valid, return it.
    if (validateResponseContract(payload)) {
        return payload as StrictResponse;
    }

    // 2. Try to salvage parts
    let response = "";
    let certification: Partial<StrictCertification> = {};
    let extras: Record<string, any> = {};

    if (payload && typeof payload === 'object') {
        const data = (payload.data && typeof payload.data === 'object') ? payload.data : payload;

        if (typeof data.response === 'string') {
            response = data.response;
        } else if (typeof data.message === 'string') {
            response = data.message;
        }

        if (data.certification && typeof data.certification === 'object') {
            certification = data.certification;
        }

        extras = { ...data };
        delete extras['response'];
        delete extras['certification'];
        delete extras['data'];
    }

    // 3. Rebuild safely
    return buildSafeResponse(response, certification, extras);
}
