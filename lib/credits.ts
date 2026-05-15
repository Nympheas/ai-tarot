import { dbQuery, isDbConfigured } from "./db";

export type CreditStatus = {
  freeUsed: boolean;
  credits: number;
  canRead: boolean;
};

export async function getUserCreditStatus(userId: string): Promise<CreditStatus> {
  if (!isDbConfigured()) return { freeUsed: false, credits: 0, canRead: true };

  const result = await dbQuery(
    "SELECT free_used, credits FROM user_credits WHERE user_id = $1",
    [userId]
  );

  if (result.rows.length === 0) return { freeUsed: false, credits: 0, canRead: true };

  const { free_used, credits } = result.rows[0];
  return { freeUsed: free_used, credits, canRead: !free_used || credits > 0 };
}

export async function consumeCredit(userId: string): Promise<boolean> {
  if (!isDbConfigured()) return true;

  const status = await getUserCreditStatus(userId);

  if (!status.freeUsed) {
    await dbQuery(
      `INSERT INTO user_credits (user_id, free_used, credits)
       VALUES ($1, TRUE, 0)
       ON CONFLICT (user_id) DO UPDATE SET free_used = TRUE`,
      [userId]
    );
    return true;
  }

  if (status.credits > 0) {
    const result = await dbQuery(
      `UPDATE user_credits SET credits = credits - 1
       WHERE user_id = $1 AND credits > 0 RETURNING credits`,
      [userId]
    );
    return result.rows.length > 0;
  }

  return false;
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  if (!isDbConfigured()) return;

  await dbQuery(
    `INSERT INTO user_credits (user_id, free_used, credits)
     VALUES ($1, FALSE, $2)
     ON CONFLICT (user_id) DO UPDATE SET credits = user_credits.credits + $2`,
    [userId, amount]
  );
}
