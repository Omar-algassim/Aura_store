import { getUserMe } from "@/utils/services/user-services";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { User } from "./entities/user-entity";

const protectedRoutes = ["/cart/checkout", "/profile"];
const isProtectedRoute = (path: string) => {
  return protectedRoutes.some((route) => path.startsWith(route));
};

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const currentPath = request.nextUrl.pathname;
  const jwt = cookieStore.get("jwt")?.value;
  const user = await getUserMe(jwt);
  const userFromCookie = JSON.parse(
    cookieStore.get("user")?.value || "{}"
  ) as User;

  const message = {
    phone_number: "الرجاء تأكيد رقم الهاتف للمتابعة",
    email: "الرجاء تأكيد البريد الالكتروني للمتابعة",
  };

  if (isProtectedRoute(currentPath) && user.ok === false) {
    // update the last visited page cookie
    cookieStore.set("nextPage", currentPath);
    if (userFromCookie?.documentId?.length) {
      // redirect to confirm page
      if (userFromCookie.phone_number) {
        // redirect to confirm phone page
        return NextResponse.redirect(
          new URL(`/confirm-phone?message=${message.phone_number}`, request.url)
        );
      } else {
        return NextResponse.redirect(
          new URL(`/confirm-email?message=${message.email}`, request.url)
        );
      }
    }
    // /console.log("redirecting to login, next page", currentPath);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (["/login", "/register"].includes(currentPath)) {
    if (user.ok) {
      return NextResponse.redirect(new URL("/profile", request.url));
    } else if (userFromCookie?.documentId?.length) {
      if (userFromCookie.phone_number) {
        // redirect to confirm phone page
        return NextResponse.redirect(
          new URL(`/confirm-phone?message=${message.phone_number}`, request.url)
        );
      } else {
        return NextResponse.redirect(
          new URL(`/confirm-email?message=${message.email}`, request.url)
        );
      }
    }
  }

  if (
    ["/confirm-email", "/confirm-phone"].includes(currentPath) &&
    !userFromCookie.documentId
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
