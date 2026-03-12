import { NextRequest, NextResponse } from 'next/server';
import { setupLS, createCheckout } from '@/lib/lemonsqueezy';

export async function POST(request: NextRequest): Promise<NextResponse> {
  setupLS();

  let body: { variantId?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { variantId, email } = body;

  if (!variantId) {
    return NextResponse.json({ error: 'variantId is required' }, { status: 400 });
  }

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const checkoutOptions: Parameters<typeof createCheckout>[2] = {
    checkoutOptions: {
      embed: false,
    },
    checkoutData: email ? { email } : undefined,
  };

  const { data, error } = await createCheckout(storeId, variantId, checkoutOptions);

  if (error || !data) {
    console.error('Lemon Squeezy checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }

  const checkoutUrl = data.data?.attributes?.url;
  if (!checkoutUrl) {
    return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
  }

  return NextResponse.json({ checkoutUrl });
}
