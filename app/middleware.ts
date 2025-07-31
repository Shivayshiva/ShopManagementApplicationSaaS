// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = req.nextUrl.pathname;

  // Public pages
  const publicPaths = ['/', '/signin', '/signup', '/about'];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If not logged in
  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  const role = token.role;

  // BLOCK STAFF from accessing non-staff routes
  if (role === 'staff') {
    const allowedStaffPaths = ['/staff'];

    const isAllowed = allowedStaffPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // SUPERADMIN & TENANT role-based restrictions
  if (role === 'superadmin' && pathname.startsWith('/tenant')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (role === 'tenant' && pathname.startsWith('/superadmin')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // Protect everything except static/image
  ],
};
