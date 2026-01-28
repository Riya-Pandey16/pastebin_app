import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PastePage({ params }: PageProps) {
  // ✅ UNWRAP params
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    notFound();
  }

  const now = new Date();

  // ⏳ TTL check
  if (paste.expiresAt && paste.expiresAt <= now) {
    notFound();
  }

  // 👀 Max views check
  if (paste.viewsLeft !== null && paste.viewsLeft <= 0) {
    notFound();
  }

  // ⬇ Decrement views
  await prisma.paste.update({
    where: { id },
    data: {
      viewsLeft:
        paste.viewsLeft !== null ? paste.viewsLeft - 1 : null,
      viewCount: paste.viewCount + 1,
    },
  });

  return <pre>{paste.content}</pre>;
}
