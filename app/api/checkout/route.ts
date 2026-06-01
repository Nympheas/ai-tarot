import { auth } from "@clerk/nextjs/server";
import { createOrder } from "@/lib/orders";

const PACKAGES: Record<number, string> = {
  5:  "LEMONSQUEEZY_VARIANT_5",
  20: "LEMONSQUEEZY_VARIANT_20",
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "未登录" }, { status: 401 });

  const { quantity } = await req.json();
  const variantEnvKey = PACKAGES[quantity] ?? PACKAGES[5];
  const variantId = process.env[variantEnvKey]!;
  const storeId   = process.env.LEMONSQUEEZY_STORE_ID!;
  const apiKey    = process.env.LEMONSQUEEZY_API_KEY!;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const orderId = await createOrder(userId, quantity);

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: { userId, orderId, quantity: String(quantity) },
          },
          product_options: {
            redirect_url: `${appUrl}/payment/success`,
          },
        },
        relationships: {
          store:   { data: { type: "stores",   id: storeId   } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  const data = await res.json();
  const url = data?.data?.attributes?.url;
  if (!url) {
    return Response.json({ error: data?.errors?.[0]?.detail ?? "创建订单失败" }, { status: 500 });
  }

  return Response.json({ url });
}
