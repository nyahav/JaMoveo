import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function socketMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/socket')) {
    const response = NextResponse.next()
    response.headers.append('Access-Control-Allow-Origin', '*')
    response.headers.append('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    response.headers.append('Access-Control-Allow-Headers', 'Content-Type')
    return response
  }
  return NextResponse.next()
}