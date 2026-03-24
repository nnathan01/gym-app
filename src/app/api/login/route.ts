import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const body = await req.json();

  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "123456";

  if (body.email === ADMIN_EMAIL && body.password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });

    // set cookie login
    response.cookies.set("auth", "true", {
      httpOnly: true,
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ message: "Login gagal" }, { status: 401 });
}
