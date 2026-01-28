import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content, ttl, maxViews } = await req.json();

  if (!content || content.trim() === "") {
    return NextResponse.json({ error: "Empty paste" }, { status: 400 });
  }

  const expiresAt = ttl
    ? new Date(Date.now() + Number(ttl) * 1000)
    : null;

  const paste = await prisma.paste.create({
    data: {
      content,
      expiresAt,
      maxViews: maxViews ? Number(maxViews) : null,
    },
  });

  return NextResponse.json({
    id: paste.id,
    url: `/p/${paste.id}`,
  });
}
