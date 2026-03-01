import * as admin from 'firebase-admin';

async function reconstruct() {
    const BUCKET_NAME = process.env.RECEIPTS_BUCKET || 'ahi-governance-receipts';
    admin.initializeApp({
        storageBucket: BUCKET_NAME
    });

    console.log(`--- INICIANDO RECONSTRUCCIÓN DE SESIÓN DESDE ANCLA EXTERNA ---`);
    console.log(`Escaneando bucket: gs://${BUCKET_NAME}/receipts/`);

    try {
        const [files] = await admin.storage().bucket().getFiles({ prefix: 'receipts/' });

        console.log(`Se encontraron ${files.length} recibos.`);

        const records = [];
        for (const file of files) {
            const [content] = await file.download();
            const receipt = JSON.parse(content.toString());

            // Verificar firma (Simulado)
            if (receipt.signature) {
                records.push({
                    trackingId: receipt.trackingId,
                    timestamp: receipt.timestamp,
                    status: receipt.data.status,
                    prompt: receipt.data.prompt
                });
            }
        }

        // Ordenar por timestamp
        records.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        console.log("\n📊 SESIÓN RECONSTRUIDA:");
        console.table(records);

    } catch (e) {
        console.error("Fallo crítico en la reconstrucción:", e);
    }
}

if (require.main === module) {
    reconstruct();
}
