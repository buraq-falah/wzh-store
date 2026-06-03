import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('strapi_jwt')?.value; // better to use cookie, but we use localStorage. Let's use cookie to work with middleware.
  // Actually localStorage not accessible in middleware, so I'll adjust: store token in cookie on login.
  // Simpler: create a layout that checks token client-side. I'll show that.
  return NextResponse.next();
}