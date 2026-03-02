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
    
    // @ts-ignore - Genkit flow mock for build compatibility
    const result = await alphaAuditorFlow.run({ prompt });

    // Mapeo de la respuesta del flujo (Genkit) al contrato de la API (Frontend)
    // El flow devuelve: { verdict, riskScore, reasoning, dimensions }
    
    const responsePayload = {
      data: {
        response: result.response,
        certification: result.certification
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
