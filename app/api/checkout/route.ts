import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const PACKAGES = [
  { quantity: 1, amount: 199, label: "1 次占卜" },
  { quantity: 5, amount: 699, label: "5 次占卜" },
];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const { quantity } = await req.json();
  const pkg = PACKAGES.find((p) => p.quantity === quantity) ?? PACKAGES[0];

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "灵镜AI 占卜次数", description: pkg.label },
          unit_amount: pkg.amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/tarot`,
    metadata: { userId, quantity: String(pkg.quantity) },
  });

  return Response.json({ url: session.url });
}
