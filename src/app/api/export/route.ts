import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // 🔥 TAMBAHAN PENTING
export async function GET() {
  const members = await prisma.member.findMany();

  // 🔥 FORMAT DATA
  const data = members.map((m) => {
    const start = new Date(m.startDate);
    const now = new Date();

    const expiredDate = new Date(start);
    expiredDate.setDate(expiredDate.getDate() + 30);

    const diff = expiredDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    let status = "Aktif";
    if (days <= 0) status = "Expired";
    else if (days <= 3) status = "Hampir Expired";

    return {
      Nama: m.name,
      Email: m.email,
      Paket: m.package,
      Status: status,
      Pembayaran: m.isPaid ? "Lunas" : "Belum",
      "Tanggal Gabung": start.toLocaleDateString(),
      "Tanggal Bayar": m.paidAt ? new Date(m.paidAt).toLocaleDateString() : "-",
    };
  });

  // 🔥 BUAT EXCEL
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": "attachment; filename=members.xlsx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
