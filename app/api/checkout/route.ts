import { auth } from "@clerk/nextjs/server";
import { createMd5 } from "@/lib/xunhupay";
import { createOrder } from "@/lib/orders";

const PACKAGES = [
  { quantity: 5,  amount: "9.90",  label: "灵镜AI · 5次占卜" },
  { quantity: 20, amount: "29.90", label: "灵镜AI · 20次占卜" },
];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "未登录" }, { status: 401 });

  const { quantity, type = "wechat" } = await req.json();
  const pkg = PACKAGES.find((p) => p.quantity === quantity) ?? PACKAGES[0];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const appid      = process.env.XUNHUPAY_APPID!;
  const appSecret  = process.env.XUNHUPAY_APP_SECRET!;
  const outTradeNo = await createOrder(userId, pkg.quantity);
  const nonceStr   = Math.random().toString(36).slice(2, 18);

  const params: Record<string, string> = {
    appid,
    type,
    out_trade_no: outTradeNo,
    notify_url:   `${appUrl}/api/webhook`,
    return_url:   `${appUrl}/payment/success`,
    name:         pkg.label,
    money:        pkg.amount,
    nonce_str:    nonceStr,
  };

  params.hash = createMd5(params, appSecret);

  const res = await fetch("https://api.xunhupay.com/payment/do.html", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (data.errcode !== 0) {
    return Response.json({ error: data.errmsg ?? "创建订单失败" }, { status: 500 });
  }

  return Response.json({ url: data.url });
}
