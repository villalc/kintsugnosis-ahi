'use client';

import { useEffect, useRef } from 'react';

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey: string;
}

/**
 * Wrapper for Stripe's <stripe-buy-button> Web Component.
 * Loads the Stripe JS script once and renders the web component.
 */
export function StripeBuyButton({ buyButtonId, publishableKey }: StripeBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Stripe Buy Button script (idempotent)
    const scriptSrc = 'https://js.stripe.com/v3/buy-button.js';
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    // @ts-ignore - Stripe Web Component definition
    <stripe-buy-button
      buy-button-id={buyButtonId}
      publishable-key={publishableKey}
    />
  );
}
