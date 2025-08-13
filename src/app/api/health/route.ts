export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

type GcsHealth = {
  ts?: number | string;
  ir1?: string;
  ir2?: string;
  defect?: string;
  classify?: string;
  overall?: string;
  timestamp?: string;
  [k: string]: unknown;
};

const PROJECT_ID = process.env.GCP_PROJECT_ID ?? '';
const BUCKET = process.env.HEALTH_BUCKET ?? '';
const OBJECT = process.env.HEALTH_OBJECT ?? '';

const storage = new Storage({
  projectId: PROJECT_ID || undefined,
  credentials:
    process.env.GCP_SA_CLIENT_EMAIL && process.env.GCP_SA_PRIVATE_KEY
      ? {
          client_email: process.env.GCP_SA_CLIENT_EMAIL,
          private_key: process.env.GCP_SA_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
      : undefined, // GCP 런타임이면 ADC 사용
});

function parseTs(val: unknown): number {
  // 숫자면 ms/초 구분해서 ms로 반환
  if (typeof val === 'number') return val < 1e12 ? val * 1000 : val;
  if (typeof val === 'string') {
    const n = Number(val);
    if (!Number.isNaN(n)) return n < 1e12 ? n * 1000 : n;
  }
  return Date.now();
}

export async function GET() {
  if (!BUCKET || !OBJECT) {
    return NextResponse.json(
      { ok: false, error: 'HEALTH_BUCKET/HEALTH_OBJECT env가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const [buf] = await storage.bucket(BUCKET).file(OBJECT).download();

    let data: GcsHealth;
    try {
      data = JSON.parse(buf.toString('utf-8')) as GcsHealth;
    } catch {
      return NextResponse.json(
        { ok: false, error: 'GCS 객체의 JSON 파싱에 실패했습니다.' },
        { status: 500 }
      );
    }

    const tsMs = parseTs(data.ts ?? data.timestamp);
    const body: GcsHealth = { ...data, timestamp: new Date(tsMs).toISOString() };

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'gcs read failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
