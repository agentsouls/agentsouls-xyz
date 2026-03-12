import { lemonSqueezySetup, getProduct, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

export function setupLS() {
  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });
}

export { getProduct, createCheckout };
