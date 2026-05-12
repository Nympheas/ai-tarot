"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingOutputProps {
  content: string;
  isStreaming: boolean;
  onFollowUp: (question: string) => void;
}

export function ReadingOutput({ content, isStreaming, onFollowUp }: ReadingOutputProps) {
  const [followUp, setFollowUp] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [content, isStreaming]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!followUp.trim() || isStreaming) return;
    onFollowUp(followUp.trim());
    setFollowUp("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto flex flex-col gap-5"
    >
      {/* Main reading card */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Glow border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-purple-500/20 via-transparent to-indigo-500/10 pointer-events-none" />
        <div className="absolute inset-px rounded-3xl bg-[#0e0b1f] pointer-events-none" />

        <div className="relative px-7 py-8">
          {/* Decorative top */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
            <span className="text-purple-400/60 text-xs tracking-[0.3em] uppercase">解读</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
          </div>

          {/* Markdown content */}
          <div className="reading-prose">
            <ReactMarkdown
              components={{
                h3: ({ children }) => (
                  <h3 className="text-purple-200 font-medium text-base mt-8 mb-3 first:mt-0 flex items-center gap-2">
                    {children}
                  </h3>
                ),
                h2: ({ children }) => (
                  <h2 className="text-purple-100 font-semibold text-lg mt-8 mb-4 first:mt-0">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-slate-300 text-sm leading-[1.9] mb-4">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="text-purple-200 font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-indigo-300 not-italic">{children}</em>
                ),
                hr: () => (
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent" />
                    <span className="text-purple-500/40 text-xs">✦</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent" />
                  </div>
                ),
                ol: ({ children }) => (
                  <ol className="flex flex-col gap-3 my-4 counter-reset-list">{children}</ol>
                ),
                ul: ({ children }) => (
                  <ul className="flex flex-col gap-2 my-4">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-slate-300 text-sm leading-relaxed pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-purple-500/50">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-purple-500/40 pl-4 my-4 text-slate-400 text-sm italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Streaming cursor */}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-purple-400 rounded-sm animate-pulse ml-0.5 align-middle" />
          )}

          {/* Decorative bottom */}
          {!isStreaming && content && (
            <div className="flex items-center gap-3 mt-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              <span className="text-purple-500/40 text-xs">✦ ✦ ✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Follow-up input */}
      <AnimatePresence>
        {!isStreaming && content && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            <p className="text-slate-600 text-xs text-center tracking-wide">还有疑惑？继续追问</p>
            <div className="flex gap-2">
              <input
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="例如：这意味着我应该放弃吗？"
                className="flex-1 rounded-2xl bg-slate-900/60 border border-purple-500/20 text-white placeholder:text-slate-600 px-5 py-3 text-sm outline-none focus:border-purple-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!followUp.trim()}
                className="px-5 py-3 rounded-2xl bg-purple-600/80 hover:bg-purple-600 text-white text-sm font-medium disabled:opacity-30 transition-all cursor-pointer"
              >
                问
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
