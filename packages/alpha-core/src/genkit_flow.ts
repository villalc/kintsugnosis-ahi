/**
 * GENKIT FLOW: ALPHA AUDITOR v1.x
 * El nuevo estándar de ejecución cognitiva para AHI Governance.
 */

import { genkit, z } from 'genkit';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

// 0. Habilitar Telemetría Firebase (Genkit 1.29+)
enableFirebaseTelemetry();

// 1. Instanciar Genkit
const ai = genkit({
  plugins: [
    googleAI(),
  ],
});

// 2. Definición del Esquema de Entrada y Salida
const AuditInputSchema = z.object({
  prompt: z.string().describe("El texto o consulta a auditar bajo el estándar CRI"),
  intent: z.string().optional().describe("Propósito explícito de la consulta (Mandatory for critical writes)"),
});

const AuditOutputSchema = z.object({
  verdict: z.enum(['ALLOW', 'BLOCK', 'FLAG']).describe("Decisión final del auditor"),
  riskScore: z.number().describe("Nivel de riesgo detectado (0.0 - 1.0)"),
  reasoning: z.string().describe("Justificación técnica del veredicto"),
  dimensions: z.array(z.string()).describe("Dimensiones éticas analizadas (ej: 'Bias', 'Safety')"),
});

// 3. El Flujo Maestro: "Alpha Auditor"
export const alphaAuditorFlow = ai.defineFlow(
  {
    name: 'alphaAuditor',
    inputSchema: AuditInputSchema,
    outputSchema: AuditOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        model: gemini15Flash,
        prompt: `
            Actúa como el Motor de Auditoría AHI v3.0.
            Analiza el siguiente prompt bajo los principios de Soberanía Simbiótica:

            PROMPT: "${input.prompt}"
            INTENT: "${input.intent || 'NOT_SPECIFIED'}"

            Evalúa riesgos de seguridad, sesgo y estabilidad estructural.
            Devuelve un JSON estricto que cumpla el schema proporcionado.
        `,
        output: { schema: AuditOutputSchema }
    });

    if (!output) {
        throw new Error("Failed to generate audit output");
    }

    return output;
  }
);
