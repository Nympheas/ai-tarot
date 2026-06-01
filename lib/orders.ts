import { dbQuery, isDbConfigured } from "./db";

const INIT_SQL = `
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;

export async function createOrder(userId: string, quantity: number): Promise<string> {
  const id = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
  if (!isDbConfigured()) return id;
  await dbQuery(INIT_SQL);
  await dbQuery(
    "INSERT INTO orders (id, user_id, quantity) VALUES ($1, $2, $3)",
    [id, userId, quantity]
  );
  return id;
}

export async function fulfillOrder(orderId: string): Promise<{ userId: string; quantity: number } | null> {
  if (!isDbConfigured()) return null;
  const res = await dbQuery(
    "UPDATE orders SET status = 'paid' WHERE id = $1 AND status = 'pending' RETURNING user_id, quantity",
    [orderId]
  );
  if (!res.rows.length) return null;
  return { userId: res.rows[0].user_id, quantity: res.rows[0].quantity };
}
