import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST() {
  const response = NextResponse.json({ success: true });

  // hapus cookie auth
  response.cookies.set("auth", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
