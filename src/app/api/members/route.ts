import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET
export async function GET() {
  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(members);
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  const member = await prisma.member.create({
    data: {
      name: body.name,
      email: body.email,
      package: body.package,
    },
  });

  return NextResponse.json(member);
}

// DELETE
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.member.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

// PUT (UPDATE + PAYMENT)
export async function PUT(req: Request) {
  const body = await req.json();

  const updated = await prisma.member.update({
    where: { id: body.id },
    data: {
      name: body.name,
      email: body.email,
      package: body.package,

      // 🔥 PAYMENT UPDATE
      isPaid: body.isPaid,
      paidAt: body.isPaid ? new Date() : null,
    },
  });

  return NextResponse.json(updated);
}