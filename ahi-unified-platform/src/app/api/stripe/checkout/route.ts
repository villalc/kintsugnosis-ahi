import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia',
});

// ─── IMPORTANTE: Reemplaza estos valores con los Price IDs reales de tu Stripe Dashboard
// Ve a: stripe.com/dashboard → Products → clic en el producto → copia el "Price ID" (price_xxx)
// Los Price IDs son DIFERENTES a los Buy Button IDs (buy_btn_xxx)
const TIER_PRICE_MAP: Record<string, { priceId: string; tier: number; name: string }> = {
  quick:      { priceId: process.env.STRIPE_PRICE_TIER1 || 'REEMPLAZAR_CON_PRICE_ID_TIER1', tier: 1, name: 'Auditoría Rápida' },
  technical:  { priceId: process.env.STRIPE_PRICE_TIER2 || 'REEMPLAZAR_CON_PRICE_ID_TIER2', tier: 2, name: 'Auditoría Técnica' },
  enterprise: { priceId: process.env.STRIPE_PRICE_TIER3 || 'REEMPLAZAR_CON_PRICE_ID_TIER3', tier: 3, name: 'Enterprise' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tierKey, userEmail, userId } = body;

    if (!tierKey || !TIER_PRICE_MAP[tierKey]) {
      return NextResponse.json({ error: 'Tier inválido' }, { status: 400 });
    }

    const { priceId, tier, name } = TIER_PRICE_MAP[tierKey];

    if (priceId.startsWith('REEMPLAZAR')) {
      return NextResponse.json(
        { error: 'Price IDs de Stripe no configurados. Agrega STRIPE_PRICE_TIER1/2/3 como variables de entorno.' },
        { status: 500 }
      );
    }

    const origin = request.headers.get('origin') || 'https://ahigovernance.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userEmail || undefined,
      success_url: `${origin}/onboarding?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${origin}/pricing?cancelled=true`,
      metadata: {
        userId: userId || '',
        tier: String(tier),
        tierName: name,
      },
      subscription_data: {
        metadata: {
          userId: userId || '',
          tier: String(tier),
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[Stripe Checkout Error]', error);
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 }
    );
  }
}
