import { prisma } from "../../../../lib/prisma";
import { getNow } from "../../../../lib/time";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const now = getNow(req);

  try {
    const paste = await prisma.$transaction(async (tx: any) => {
      const paste = await tx.paste.findUnique({
        where: { id },
      });

      if (!paste) throw new Error("404");
      if (paste.expiresAt && now > paste.expiresAt) throw new Error("404");
      if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
        throw new Error("404");
      }

      return await tx.paste.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    });

    return Response.json({
      content: paste.content,
      remaining_views:
        paste.maxViews === null ? null : paste.maxViews - paste.viewCount,
      expires_at: paste.expiresAt,
    });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
