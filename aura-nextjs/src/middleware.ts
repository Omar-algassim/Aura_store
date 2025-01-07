import { getUserMe } from "@/utils/services/user-services";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/checkout", "/profile"];
const isProtectedRoute = (path: string) => {
  return protectedRoutes.some((route) => path.includes(route));
};

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const currentPath = request.nextUrl.pathname;
  const jwt = cookieStore.get("jwt")?.value;
  const user = await getUserMe(jwt);

  if (isProtectedRoute(currentPath) && user.ok === false) {
    // update the last visited page cookie
    cookieStore.set("nextPage", currentPath);
    console.log("redirecting to login, next page", currentPath);
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
