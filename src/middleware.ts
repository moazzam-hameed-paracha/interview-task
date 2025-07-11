import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PAGE_URLS } from "@/constants/PAGE_URLS";
import { API_ROUTES } from "@/constants/API_URL";
import { RouteConfig, Role } from "@/types/api";

const routeConfigs: RouteConfig[] = [
  // Authenticated routes
  {
    path: PAGE_URLS.DASHBOARD,
    protection: "auth-only",
    allowedRoles: ["user", "admin"],
    isApi: false,
  },
  {
    path: PAGE_URLS.ADMIN,
    protection: "auth-only",
    allowedRoles: ["admin"],
    isApi: false,
  },
  { path: API_ROUTES.AUTH_LOGOUT, protection: "auth-only", isApi: true },
  { path: API_ROUTES.AUTH_ME, protection: "auth-only", isApi: true },
  {
    path: "/api/tasks",
    protection: "auth-only",
    allowedRoles: ["user", "admin"],
    isApi: true,
  },
  {
    path: "/api/users",
    protection: "auth-only",
    allowedRoles: ["admin"],
    isApi: true,
  },

  // unauth-only routes (e.g., login, register)
  { path: API_ROUTES.AUTH_LOGIN, protection: "unauth-only", isApi: true },
  { path: API_ROUTES.AUTH_REGISTER, protection: "unauth-only", isApi: true },
  { path: PAGE_URLS.LOGIN, protection: "unauth-only", isApi: false },
  { path: PAGE_URLS.REGISTER, protection: "unauth-only", isApi: false },
  { path: PAGE_URLS.HOME, protection: "unauth-only", isApi: false },
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.cookies.get("token")?.value;
  const userRole = req.cookies.get("role")?.value as Role | undefined;

  const routeConfig = routeConfigs.find((config) =>
    pathname.startsWith(config.path)
  );

  // Default to public if no config found
  if (!routeConfig) {
    return NextResponse.next();
  }

  const { protection, allowedRoles, isApi } = routeConfig;

  if (protection === "unauth-only") {
    if (isLoggedIn) {
      if (isApi) {
        return new NextResponse("Already authenticated", { status: 403 });
      }
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = PAGE_URLS.DASHBOARD;
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (protection === "auth-only") {
    if (!isLoggedIn) {
      if (isApi) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = PAGE_URLS.LOGIN;
      return NextResponse.redirect(loginUrl);
    }

    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
      if (isApi) {
        return new NextResponse("Forbidden", { status: 403 });
      }
      const unauthorizedUrl = req.nextUrl.clone();
      unauthorizedUrl.pathname = PAGE_URLS.HOME;
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|static).*)"],
};
