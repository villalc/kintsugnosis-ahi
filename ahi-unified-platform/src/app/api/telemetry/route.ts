import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Use GEOMETRY_FN_URL (Cloud Function) if available, otherwise fallback to TELEMETRY_API_URL (Legacy)
  const GEOMETRY_FN_URL = process.env.NEXT_PUBLIC_GEOMETRY_FN_URL;
  const TELEMETRY_API_URL = process.env.TELEMETRY_API_URL || 'http://localhost:8000';
  
  // Forward App Check Token if present in request headers
  const appCheckToken = request.headers.get('X-Firebase-AppCheck');

  try {
    const start = Date.now();
    let response;
    let endpoint;

    if (GEOMETRY_FN_URL) {
        // Target: Cloud Function (New Architecture)
        endpoint = GEOMETRY_FN_URL; // Assuming endpoint is configured directly
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (appCheckToken) {
            headers['X-Firebase-AppCheck'] = appCheckToken;
        }

        // We use POST for /audit-ricci usually, but check if GET is supported or we need to send empty body
        // Based on analysis, audit_ricci supports GET for health check but POST for metrics.
        // Let's assume we want metrics, so we might need to POST empty data or use a specific action.
        // However, for a simple dashboard viewer, maybe we just want status.
        // Let's try to mimic the "DAILY_PULSE" action if possible, or just GET metrics/ricci from legacy if FN not ready.
        // For now, to be safe and "The Eye" compatible, let's stick to legacy GET if no specific FN URL,
        // OR if FN URL is set, assume it handles GET or we adapt.
        
        // REVISION: The user said /audit-ricci intercepts invalid traffic. 
        // Let's try to hit it with a payload if we are "The Eye".
        response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ action: "DAILY_PULSE" }) // Request real pulse
        });

    } else {
        // Target: Legacy Telemetry API
        endpoint = `${TELEMETRY_API_URL}/metrics/ricci`;
        response = await fetch(endpoint, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const latency = Date.now() - start;

    if (!response.ok) {
      // If 401, it might be App Check failure
      if (response.status === 401) {
          throw new Error(`Security Handshake Failed (App Check): ${response.statusText}`);
      }
      throw new Error(`Telemetry Service Error (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    
    // Enrich with latency check for monitoring
    return NextResponse.json({
      ...data,
      _meta: {
        latency_ms: latency,
        proxy: true,
        source: GEOMETRY_FN_URL ? 'CLOUD_FN' : 'LEGACY_API'
      }
    });

  } catch (error: unknown) {
    console.error("Telemetry Bridge Error:", error);
    
    // Fallback/Error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        current: 0.0,
        ricci_curvature: 0.0,
        fisher_gap: 0.0, 
        status: "UNREACHABLE", 
        integrity: "UNKNOWN",
        error: errorMessage 
      },
      { status: 503 }
    );
  }
}
