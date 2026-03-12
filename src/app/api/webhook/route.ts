import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

function parseVerticalAndTier(productName: string): { vertical: string; tier: string } {
  const lower = productName.toLowerCase();

  let vertical = 'unknown';
  if (lower.includes('dental')) vertical = 'dental';
  else if (lower.includes('style')) vertical = 'style';
  else if (lower.includes('trades')) vertical = 'trades';

  let tier = 'starter';
  if (lower.includes('agency')) tier = 'agency';
  else if (lower.includes('pro')) tier = 'pro';
  else if (lower.includes('starter')) tier = 'starter';

  return { vertical, tier };
}

function verticalDisplayName(vertical: string): string {
  const map: Record<string, string> = {
    dental: 'DentalClaw',
    style: 'StyleClaw',
    trades: 'TradesClaw',
  };
  return map[vertical] ?? 'ClawBuilt';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text();
  const signature = request.headers.get('X-Signature') ?? '';
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? '';

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventName = (payload.meta as Record<string, unknown>)?.event_name as string;
  if (eventName !== 'order_created') {
    return NextResponse.json({ received: true });
  }

  const data = (payload.data as Record<string, unknown>) ?? {};
  const attributes = (data.attributes as Record<string, unknown>) ?? {};
  const firstOrderItem = ((attributes.first_order_item as Record<string, unknown>) ?? {});

  const email = (attributes.user_email as string) ?? '';
  const orderId = String(data.id ?? '');
  const productName = (firstOrderItem.product_name as string) ?? '';

  const { vertical, tier } = parseVerticalAndTier(productName);
  const licenseKey = crypto.randomUUID();

  // Insert into Supabase
  const { error: dbError } = await supabase.from('licenses').insert({
    email,
    ls_order_id: orderId,
    vertical,
    tier,
    harness: 'hermes',
    license_key: licenseKey,
    download_count: 0,
    download_limit: 5,
  });

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Build download URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://clawbuilt.ai';
  const downloadUrl = `${appUrl}/api/download?license_key=${encodeURIComponent(licenseKey)}&email=${encodeURIComponent(email)}`;

  // Send email via Resend
  const verticalName = verticalDisplayName(vertical);
  await getResend().emails.send({
    from: 'ClawBuilt <hello@clawbuilt.ai>',
    to: email,
    subject: `Your ${verticalName} config is ready — ClawBuilt`,
    html: `
      <h2>Your ${verticalName} config is ready 🎉</h2>
      <p>Thanks for your purchase! Here are your details:</p>
      <p><strong>License Key:</strong> <code>${licenseKey}</code></p>
      <p><strong>Download Link:</strong> <a href="${downloadUrl}">${downloadUrl}</a></p>
      <p>This link allows up to 5 downloads and expires after each use.</p>
      <h3>Quick Start</h3>
      <p>1. Download and unzip your config package.<br/>
         2. Follow the README inside to install the Hermes harness.<br/>
         3. Drop your license key in when prompted.</p>
      <p>Questions? Reply to this email or contact <a href="mailto:support@clawbuilt.ai">support@clawbuilt.ai</a>.</p>
      <p>— ClawBuilt Team</p>
    `,
  });

  return NextResponse.json({ received: true });
}
