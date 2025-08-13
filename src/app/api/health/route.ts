import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const PROJECT_ID = process.env.GCP_PROJECT_ID!;
const BUCKET = 'zezeone_health';
const OBJECT = 'health_check/status.json';

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_SA_CLIENT_EMAIL,
    private_key: process.env.GCP_SA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export async function GET() {
  try {
    const [buf] = await storage.bucket(BUCKET).file(OBJECT).download();
    const data = JSON.parse(buf.toString('utf-8')) as {
      ts?: number;
      ir1?: string; ir2?: string; defect?: string; classify?: string; overall?: string;
      [k: string]: any;
    };

   
    const tsMs = typeof data.ts === 'number' ? data.ts * 1000 : Date.now();
    const iso = new Date(tsMs).toISOString();

    return NextResponse.json(
      { ...data, timestamp: iso },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'gcs read failed' },
      { status: 500 }
    );
  }
}
