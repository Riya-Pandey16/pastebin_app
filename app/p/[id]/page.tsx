import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const now = new Date();

  // 1️⃣ Fetch paste
  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) notFound();

  // 2️⃣ Check expiry
  if (paste.expiresAt && paste.expiresAt <= now) {
    notFound();
  }

  // 3️⃣ Check views
  if (paste.viewsLeft === 0) {
    notFound();
  }

  // 4️⃣ Decrement views
  await prisma.paste.update({
  where: { id },
  data: {
    viewsLeft: paste.viewsLeft === null ? null : paste.viewsLeft - 1,
    viewCount: paste.viewCount + 1,
  },
});
  // 5️⃣ Show content
  return <pre>{paste.content}</pre>;
}
