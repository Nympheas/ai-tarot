import { createHash } from "crypto";

export function createMd5(params: Record<string, string>, appSecret: string): string {
  const sorted = Object.keys(params)
    .filter((k) => k !== "hash" && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("md5").update(`${sorted}&key=${appSecret}`).digest("hex");
}

export function verifyMd5(params: Record<string, string>, appSecret: string): boolean {
  const received = params.hash;
  if (!received) return false;
  return createMd5(params, appSecret) === received;
}
