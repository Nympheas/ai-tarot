import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策 · 灵镜 AI",
  description: "灵镜 AI 隐私政策 — 了解我们如何收集、使用和保护您的个人信息。",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-400 text-sm hover:text-purple-300 transition-colors mb-8 inline-block">
          ← 返回首页
        </Link>

        <h1 className="text-3xl font-light tracking-wide mb-2">隐私政策</h1>
        <p className="text-slate-500 text-sm mb-10">最后更新：2026 年 5 月 15 日</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-medium text-white mb-3">1. 概述</h2>
            <p>
              灵镜 AI（以下简称"本平台"）是一款由个人开发者运营的 AI 占卜工具。
              我们重视您的隐私，本政策说明我们收集哪些信息、如何使用，以及您拥有哪些权利。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">2. 我们收集的信息</h2>
            <ul className="space-y-3 list-none">
              <li className="flex gap-3">
                <span className="text-purple-400 mt-1">▸</span>
                <div>
                  <strong className="text-white">账号信息</strong>
                  <p className="text-slate-400 text-sm mt-1">
                    注册时通过 Clerk 收集您的邮箱地址或第三方登录账号（如 Google）。
                    我们不存储您的密码。
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 mt-1">▸</span>
                <div>
                  <strong className="text-white">占卜内容</strong>
                  <p className="text-slate-400 text-sm mt-1">
                    您在占卜时输入的问题和选项会被发送给 Google Gemini API 用于生成解读内容。
                    我们不会长期保存您的具体问题内容。
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 mt-1">▸</span>
                <div>
                  <strong className="text-white">使用记录</strong>
                  <p className="text-slate-400 text-sm mt-1">
                    我们记录您的占卜次数以实现额度管理（首次免费机制）。
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 mt-1">▸</span>
                <div>
                  <strong className="text-white">支付信息</strong>
                  <p className="text-slate-400 text-sm mt-1">
                    购买额度时，支付流程由 Stripe 处理，我们不接触也不存储您的银行卡信息。
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">3. 信息的使用</h2>
            <p className="text-slate-400 text-sm mb-3">我们使用所收集的信息用于：</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• 提供 AI 占卜解读服务</li>
              <li>• 管理用户账号和使用额度</li>
              <li>• 处理支付和发放额度</li>
              <li>• 排查技术问题、改善服务质量</li>
            </ul>
            <p className="text-slate-400 text-sm mt-4">
              我们不会将您的个人信息出售给任何第三方，也不用于广告定向。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">4. 第三方服务</h2>
            <p className="text-slate-400 text-sm mb-4">本平台使用以下第三方服务，各自适用其隐私政策：</p>
            <div className="space-y-3">
              {[
                { name: "Clerk", desc: "用户认证与账号管理", url: "https://clerk.com/privacy" },
                { name: "Google Gemini", desc: "AI 内容生成（您的输入会传输至 Google 服务器）", url: "https://policies.google.com/privacy" },
                { name: "Stripe", desc: "支付处理", url: "https://stripe.com/privacy" },
                { name: "Vercel", desc: "网站托管与日志", url: "https://vercel.com/legal/privacy-policy" },
                { name: "Neon", desc: "数据库（存储额度记录）", url: "https://neon.tech/privacy" },
              ].map((s) => (
                <div key={s.name} className="flex gap-3 text-sm">
                  <span className="text-purple-400 font-medium w-28 shrink-0">{s.name}</span>
                  <span className="text-slate-400">{s.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">5. 数据存储与安全</h2>
            <p className="text-slate-400 text-sm">
              您的账号数据存储在 Clerk 的服务器上，使用记录存储在 Neon 云数据库中，
              均采用加密传输（HTTPS）。我们会采取合理的技术措施保护您的数据，
              但无法保证绝对安全，请勿在占卜输入框中填写敏感个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">6. 未成年人</h2>
            <p className="text-slate-400 text-sm">
              本平台面向 16 岁及以上用户。如果您未满 16 岁，请在监护人陪同下使用。
              我们不会故意收集未成年人的个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">7. 您的权利</h2>
            <p className="text-slate-400 text-sm mb-3">您有权：</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• 查看我们持有的您的数据</li>
              <li>• 要求删除您的账号和相关数据</li>
              <li>• 随时注销账号</li>
            </ul>
            <p className="text-slate-400 text-sm mt-3">
              如需行使以上权利，请通过下方联系方式与我们联系。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">8. 政策更新</h2>
            <p className="text-slate-400 text-sm">
              我们可能不时更新本隐私政策。更新后会在本页面显示新的日期。
              继续使用本平台即表示您接受更新后的政策。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">9. 联系我们</h2>
            <p className="text-slate-400 text-sm">
              如有隐私相关问题，请发送邮件至：
              <a href="mailto:suyingzhang77x@gmail.com" className="text-purple-400 hover:text-purple-300 ml-1 transition-colors">
                suyingzhang77x@gmail.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <Link href="/" className="text-slate-600 text-xs hover:text-slate-500 transition-colors">
            © 2026 灵镜 AI · 仅供娱乐与自我探索
          </Link>
        </div>
      </div>
    </main>
  );
}
