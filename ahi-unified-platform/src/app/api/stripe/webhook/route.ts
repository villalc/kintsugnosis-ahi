import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Mapa de tier numérico a nombre de plan
const TIER_NAMES: Record<string, string> = {
  '1': 'quick',
  '2': 'technical',
  '3': 'enterprise',
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Webhook] Firma inválida:', err);
    return NextResponse.json({ error: 'Firma de webhook inválida' }, { status: 400 });
  }

  console.log(`[Webhook] Evento recibido: ${event.type}`);

  try {
    switch (event.type) {

      // ─── PAGO COMPLETADO: activar tier ──────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = parseInt(session.metadata?.tier || '0');

        if (!userId || !tier) {
          console.warn('[Webhook] checkout.session.completed sin userId o tier en metadata');
          break;
        }

        await adminDb.collection('users').doc(userId).set({
          tier,
          tierName: TIER_NAMES[String(tier)] || 'unknown',
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          subscriptionStatus: 'active',
          activatedAt: new Date().toISOString(),
          email: session.customer_email || '',
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        console.log(`[Webhook] Usuario ${userId} activado en Tier ${tier}`);
        break;
      }

      // ─── RENOVACIÓN MENSUAL: confirmar suscripción activa ─────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Buscar usuario por stripeCustomerId
        const snapshot = await adminDb
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          await userDoc.ref.update({
            subscriptionStatus: 'active',
            lastPaymentAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          console.log(`[Webhook] Renovación confirmada para customer ${customerId}`);
        }
        break;
      }

      // ─── CANCELACIÓN: revocar acceso ───────────────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const snapshot = await adminDb
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          await userDoc.ref.update({
            tier: 0,
            tierName: 'free',
            subscriptionStatus: 'cancelled',
            cancelledAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          console.log(`[Webhook] Acceso revocado para customer ${customerId}`);
        }
        break;
      }

      default:
        console.log(`[Webhook] Evento no manejado: ${event.type}`);
    }
  } catch (err) {
    console.error('[Webhook] Error procesando evento:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// Necesario para leer el raw body del webhook de Stripe
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
