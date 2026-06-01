import { createHmac } from "crypto";
import { fulfillOrder } from "@/lib/orders";
import { addCredits } from "@/lib/credits";

export async function POST(req: Request) {
  const body = await req.text();
  const sig  = req.headers.get("x-signature") ?? "";

  const expected = createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== sig) {
    return new Response("invalid signature", { status: 400 });
  }

  const eventName = req.headers.get("x-event-name");
  const event     = JSON.parse(body);

  if (eventName === "order_created" && event.data?.attributes?.status === "paid") {
    const custom = (event.meta?.custom_data ?? {}) as Record<string, string>;
    const { userId, orderId, quantity } = custom;

    if (orderId) {
      const result = await fulfillOrder(orderId);
      if (result) await addCredits(result.userId, result.quantity);
    } else if (userId && quantity) {
      await addCredits(userId, parseInt(quantity));
    }
  }

  return new Response("ok");
}
