import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as logger from 'firebase-functions/logger';

const BUCKET_NAME = process.env.RECEIPTS_BUCKET || 'ahi-governance-receipts';

/**
 * STATE ANCHOR - Escudo de Diamante para Transacciones Finales
 * Garantiza que cada auditoría tenga un recibo inmutable firmado.
 */
export async function anchorState(auditData: any, trackingId: string): Promise<string | null> {
    const receipt = {
        trackingId,
        timestamp: new Date().toISOString(),
        data: auditData,
        version: "v1.0-sovereign"
    };

    const receiptString = JSON.stringify(receipt);

    // Firma del Arquitecto (AETHER Root of Trust)
    // En prod, esto usaría una clave privada de KMS, aquí simulamos con el hash de identidad.
    const signature = crypto.createHash('sha256')
        .update(receiptString + '0.842-VILLA-Sovereignty')
        .digest('hex');

    const signedReceipt = {
        ...receipt,
        signature,
        attestation: "AHI-GOVERNANCE-LABS-PROD"
    };

    try {
        const bucket = admin.storage().bucket(BUCKET_NAME);
        const file = bucket.file(`receipts/${trackingId}.json`);

        await file.save(JSON.stringify(signedReceipt), {
            metadata: {
                contentType: 'application/json',
                metadata: {
                    signature,
                    trackingId
                }
            },
            resumable: false
        });

        logger.info(`[STATE ANCHOR] Receipt anchored for ${trackingId}`);
        return `gs://${BUCKET_NAME}/receipts/${trackingId}.json`;
    } catch (e) {
        logger.error(`[STATE ANCHOR FAILURE] Could not anchor state for ${trackingId}`, e);
        // Según el invariante de soberanía, si el anclaje falla, la transacción NO es válida.
        return null;
    }
}
