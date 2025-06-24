import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { getUserMe } from '@/utils/services/user-services';
import { User } from './entities/user-entity';

const protectedRoutes = ['/cart/checkout', '/profile', '/dashboard'];
const isProtectedRoute = (path: string) => {
  return protectedRoutes.some((route) => path.startsWith(route));
};

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const currentPath = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const jwt = cookieStore.get('jwt')?.value;
  const user = await getUserMe(jwt);
  const nextPage = cookieStore.get('nextPage')?.value;
  const userFromCookie = JSON.parse(
    cookieStore.get('user')?.value || '{}'
  ) as User;

  if (currentPath.startsWith('/dashboard')) {
    if (user.ok && 'data' in user) {
      // check if the user is logged as editor
      if (
        user.data.role.name !== 'editor' &&
        user.data.role.name !== 'admin'
      ) {
        // redirect to public dashboard
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    } else {
      // if the user is not logged in, redirect to login page
      cookieStore.set('nextPage', currentPath);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  const message = {
    phone_number: 'الرجاء تأكيد رقم الهاتف للمتابعة',
    email: 'الرجاء تأكيد البريد الالكتروني للمتابعة',
  };

  // there are no jwt
  if (isProtectedRoute(currentPath) && user.ok === false) {
    // console.log('there is no jwt');
    // update the last visited page cookie
    cookieStore.set('nextPage', currentPath);
    // if the user is logged in but not verified
    // redirect to confirm page
    if (userFromCookie?.documentId?.length) {
      // console.log('user is logged in but not verified');
      // if the user has a phone number and is not verified
      // redirect to confirm phone page
      if (
        userFromCookie.phone_number &&
        !userFromCookie.phoneNumberConfirmed
      ) {
        // redirect to confirm phone page
        return NextResponse.redirect(
          new URL(`/confirm-phone?msg=${message.phone_number}`, request.url)
        );
      } else if (userFromCookie.email && !userFromCookie.emailConfirmed) {
        return NextResponse.redirect(
          new URL(`/confirm-email?msg=${message.email}`, request.url)
        );
      }
    }
    // console.log('user not logged in, redirecting to login');
    return NextResponse.redirect(new URL('/login?msg="الرجاء تسجيل الدخول"', request.url));
  }

  if (['/login', '/register'].includes(currentPath)) {
    if (user.ok) {
      if (nextPage) {
        // redirect to the last visited page
        return NextResponse.redirect(new URL(nextPage, request.url));
      }
      // redirect to profile page
      return NextResponse.redirect(new URL('/profile', request.url));
    } else if (
      userFromCookie?.documentId?.length &&
      // when redirecting from confirm email or phone
      !searchParams.has('msg', 'account-confirmed')
    ) {
      if (userFromCookie.phone_number) {
        // redirect to confirm phone page
        return NextResponse.redirect(
          new URL(
            `/confirm-phone?message=${message.phone_number}`,
            request.url
          )
        );
      } else {
        return NextResponse.redirect(
          new URL(`/confirm-email?message=${message.email}`, request.url)
        );
      }
    }
  }

  if (
    ['/confirm-email', '/confirm-phone'].includes(currentPath) &&
    !userFromCookie.documentId
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
