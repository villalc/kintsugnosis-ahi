import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

// Mapa de tiers a Price IDs de Stripe
const TIER_PRICE_MAP: Record<string, { priceId: string; tier: number; name: string }> = {
  quick:     { priceId: 'price_1T5cmg3fWVYxfUSDuH0roD9A_recurrent', tier: 1, name: 'Auditoría Rápida' },
  technical: { priceId: 'price_1T5clo3fWVYxfUSDmxJcs9K3_recurrent', tier: 2, name: 'Auditoría Técnica' },
  enterprise:{ priceId: 'price_1T5chZ3fWVYxfUSDy7SjAWk9_recurrent', tier: 3, name: 'Enterprise' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tierKey, userEmail, userId } = body;

    if (!tierKey || !TIER_PRICE_MAP[tierKey]) {
      return NextResponse.json({ error: 'Tier inválido' }, { status: 400 });
    }

    const { priceId, tier, name } = TIER_PRICE_MAP[tierKey];
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
