// Type definitions for Stripe Web Components

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      }, HTMLElement>;
    }
  }
}

export {};
