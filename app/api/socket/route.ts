import { NextResponse } from 'next/server';
import { initSocketIO } from '@/lib/socket';
import { createServer } from 'http';

const httpServer = createServer();
let isInitialized = false;

export async function GET() {
  if (!isInitialized) {
    initSocketIO(httpServer);
    httpServer.listen(3002);
    isInitialized = true;
  }

  return NextResponse.json({ success: true });
}