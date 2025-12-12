import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
    // We can't use verifySession() directly because it uses 'server-only' functions potentially or just to be safe with Edge compatibility
    // But our session lib uses 'jose' which is edge compatible.
    // However, let's just do a simple check.

    const cookieStore = await cookies();
    const cookie = cookieStore.get('session')?.value;
    const session = await decrypt(cookie);

    const isAuth = !!session?.userId;
    const isLoginPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');

    // Protect dashboard routes
    // Allow /admin-setup to be accessed even if not admin yet (it has its own secret protection)
    if ((request.nextUrl.pathname.startsWith('/my-page') || request.nextUrl.pathname.startsWith('/admin')) && !request.nextUrl.pathname.startsWith('/admin-setup')) {
        if (!isAuth) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Admin check
        if (request.nextUrl.pathname.startsWith('/admin') && session?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/my-page', request.url)); // or 403
        }
    }

    // Redirect authenticated users away from login
    if (isLoginPage && isAuth) {
        return NextResponse.redirect(new URL('/my-page', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
