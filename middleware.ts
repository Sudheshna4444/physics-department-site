import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  type CookieOptions = Parameters<typeof response.cookies.set>[2];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!url || !key || !adminEmail) {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>
      ) {
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/admin") && (!user || user.email !== adminEmail)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
