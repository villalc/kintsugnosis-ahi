import { NextRequest, NextResponse } from 'next/server';
import { alphaAuditorFlow } from '@/lib/genkit/genkit_flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, flowId } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Falta el prompt' }, { status: 400 });
    }

    console.log(`Llamada a la API recibida para el flujo: ${flowId || 'alphaAuditor'} (default)`);

    // --- EJECUCIÓN DEL NÚCLEO GENKIT ---
    // Invocamos el flujo real de auditoría (alphaAuditorFlow)
    // Este flujo utiliza Gemini 1.5 Flash configurado en genkit_flow.ts
    
    const result = await alphaAuditorFlow({ prompt });

    // Mapeo de la respuesta del flujo (Genkit) al contrato de la API (Frontend)
    // El flow devuelve: { verdict, riskScore, reasoning, dimensions }
    
    const responsePayload = {
      data: {
        response: result.reasoning, // La explicación técnica es la respuesta principal
        certification: {
          hash: "genkit-hash-" + Date.now().toString(16), // Hash temporal
          stability: Number((1 - result.riskScore).toFixed(4)), // Estabilidad inversa al riesgo
          status: result.verdict === 'ALLOW' ? 'VERIFIED' : 'FLAGGED',
          verdict: { 
            action: result.verdict, 
            category: result.riskScore > 0.8 ? 'critical' : (result.riskScore > 0.4 ? 'warning' : 'clean') 
          },
          dimensions: result.dimensions,
          raw_score: result.riskScore
        }
      }
    };

    return NextResponse.json(responsePayload);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en el gateway de la API Core (Genkit):', error);
    return NextResponse.json({ 
      error: 'Error en el procesamiento neuronal',
      details: errorMessage
    }, { status: 500 });
  }
}
