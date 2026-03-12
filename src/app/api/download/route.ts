import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { supabase } from '@/lib/supabase';

const SUPPORT_EMAIL = 'support@clawbuilt.ai';

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID!;
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const licenseKey = searchParams.get('license_key') ?? '';
  const email = searchParams.get('email') ?? '';

  if (!licenseKey || !email) {
    return NextResponse.json(
      { error: 'Missing license_key or email', support: SUPPORT_EMAIL },
      { status: 400 }
    );
  }

  // Validate license
  const { data: license, error: fetchError } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_key', licenseKey)
    .eq('email', email)
    .single();

  if (fetchError || !license) {
    return NextResponse.json(
      { error: 'Invalid license key or email', support: SUPPORT_EMAIL },
      { status: 403 }
    );
  }

  if (license.download_count >= license.download_limit) {
    return NextResponse.json(
      {
        error: 'Download limit reached. Contact support to reset.',
        support: SUPPORT_EMAIL,
      },
      { status: 403 }
    );
  }

  // Increment download count
  const { error: updateError } = await supabase
    .from('licenses')
    .update({ download_count: license.download_count + 1 })
    .eq('license_key', licenseKey);

  if (updateError) {
    console.error('Failed to update download count:', updateError);
    return NextResponse.json(
      { error: 'Internal error. Please try again or contact support.', support: SUPPORT_EMAIL },
      { status: 500 }
    );
  }

  // Generate signed R2 URL
  const bucket = 'clawbuilt-configs';
  const key = `${license.vertical}/${license.vertical}-claw-${license.tier}.zip`;

  try {
    const r2 = getR2Client();
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
    return NextResponse.redirect(signedUrl, 302);
  } catch (err) {
    console.error('R2 signed URL error:', err);
    return NextResponse.json(
      { error: 'Failed to generate download link. Contact support.', support: SUPPORT_EMAIL },
      { status: 500 }
    );
  }
}
