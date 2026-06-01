import { verifyMd5 } from "@/lib/xunhupay";
import { fulfillOrder } from "@/lib/orders";
import { addCredits } from "@/lib/credits";

export async function POST(req: Request) {
  return handle(req);
}

export async function GET(req: Request) {
  return handle(req);
}

async function handle(req: Request) {
  // 虎皮椒可能用 GET query string 或 POST form/json 发回调
  let params: Record<string, string> = {};

  const url = new URL(req.url);
  url.searchParams.forEach((v, k) => { params[k] = v; });

  if (req.method === "POST") {
    try {
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        Object.assign(params, await req.json());
      } else {
        const text = await req.text();
        new URLSearchParams(text).forEach((v, k) => { params[k] = v; });
      }
    } catch { /* ignore */ }
  }

  const appSecret = process.env.XUNHUPAY_APP_SECRET!;
  if (!verifyMd5(params, appSecret)) {
    return new Response("invalid signature", { status: 400 });
  }

  if (params.status !== "OD") {
    return new Response("success");
  }

  const result = await fulfillOrder(params.out_trade_no);
  if (result) {
    await addCredits(result.userId, result.quantity);
  }

  return new Response("success");
}
