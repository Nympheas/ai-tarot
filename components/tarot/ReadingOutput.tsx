"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto flex flex-col gap-6"
    >
      <div className="rounded-2xl border border-purple-500/20 bg-slate-900/60 backdrop-blur p-6">
        <div className="prose prose-invert prose-purple max-w-none text-sm leading-relaxed">
          <ReactMarkdown>{content}</ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1 rounded-sm" />
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {!isStreaming && content && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder="继续追问，例如：这意味着我应该怎么做？"
            className="flex-1 rounded-full bg-slate-800/80 border border-purple-500/30 text-white placeholder:text-slate-500 px-5 py-3 text-sm outline-none focus:border-purple-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!followUp.trim()}
            className="px-6 py-3 rounded-full bg-purple-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-purple-500 transition-colors cursor-pointer"
          >
            追问
          </button>
        </form>
      )}
    </motion.div>
  );
}
