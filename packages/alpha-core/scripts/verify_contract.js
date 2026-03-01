// Script para verificar el Contrato de Soberanía del API Gateway
// Uso: node verify_contract.js

const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

const PROJECT_ID = 'ahi-governance-production'; // TODO: Update based on env
const REGION = 'us-central1';
const FUNCTION_ID = 'ahi_governance_service';
const URL = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_ID}`;

async function verifyContract() {
    console.log(`[VERIFY] Iniciando verificación de contrato para: ${FUNCTION_ID}`);
    
    // 1. Verificar Headers de Firma
    try {
        const auth = new GoogleAuth();
        const client = await auth.getIdTokenClient(URL);
        
        // Simular llamada de OPTIONs (CORS Check)
        const response = await axios.options(URL);
        
        const signature = response.headers['x-architect-signature'];
        if (signature === '0.842') {
            console.log("✅ [PASSED] Firma del Arquitecto verificada (0.842)");
        } else {
            console.error("❌ [FAILED] Firma del Arquitecto ausente o incorrecta.");
        }

        const tier = response.headers['x-deployment-tier'];
        if (tier === 'enterprise-sovereign') {
            console.log("✅ [PASSED] Deployment Tier verificado (enterprise-sovereign)");
        } else {
             console.error("❌ [FAILED] Tier de despliegue incorrecto.");
        }

    } catch (error) {
        console.error("⚠️ [WARNING] No se pudo conectar al endpoint. Asegúrate de que esté desplegado.", error.message);
    }
}

verifyContract();
