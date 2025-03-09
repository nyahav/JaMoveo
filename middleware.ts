import { clerkMiddleware } from '@clerk/nextjs/server'
import { socketMiddleware } from './socketmiddleware' 
import { NextFetchEvent } from 'next/server';
import { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  // First, check for socket routes
  const socketResponse = socketMiddleware(req);
  
  // If socket middleware returns a non-200 response, stop processing
  if (socketResponse.status !== 200) {
    return socketResponse;
  }

  // Otherwise, apply Clerk authentication middleware
  return clerkMiddleware(req, {} as NextFetchEvent);
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};