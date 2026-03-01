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
    if (!document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Create the web component
    if (containerRef.current && !containerRef.current.querySelector('stripe-buy-button')) {
      const el = document.createElement('stripe-buy-button');
      el.setAttribute('buy-button-id', buyButtonId);
      el.setAttribute('publishable-key', publishableKey);
      containerRef.current.appendChild(el);
    }
  }, [buyButtonId, publishableKey]);

  return <div ref={containerRef} className="flex justify-center" />;
}
