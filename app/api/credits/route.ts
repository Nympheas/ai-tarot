import { auth } from "@clerk/nextjs/server";
import { getUserCreditStatus } from "@/lib/credits";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "未登录" }, { status: 401 });

  const status = await getUserCreditStatus(userId);
  return Response.json(status);
}
