import { NextRequest, NextResponse } from 'next/server';

// TODO: restore when @/lib/genkit/genkit_flow is created
// import { alphaAuditorFlow } from '@/lib/genkit/genkit_flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, flowId } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Falta el prompt' }, { status: 400 });
    }

    console.log(`Llamada a la API recibida para el flujo: ${flowId || 'alphaAuditor'} (default)`);

    // --- STUB TEMPORAL (genkit_flow no disponible aún) ---
    // Reemplazar con la llamada real cuando exista @/lib/genkit/genkit_flow:
    // const result = await alphaAuditorFlow.run({ prompt });
    const result = {
      response: `[STUB] Respuesta temporal para: ${prompt}`,
      certification: null,
    };

    const responsePayload = {
      data: {
        response: result.response,
        certification: result.certification,
      },
    };

    return NextResponse.json(responsePayload);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en el gateway de la API Core (Genkit):', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
