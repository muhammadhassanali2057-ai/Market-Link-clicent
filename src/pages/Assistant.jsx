import React, { useState } from "react";
import { Sparkles, Send, Bot, User } from "lucide-react";
import api from "../api/axios.js";

const SUGGESTIONS = [
  "Which markets are open this weekend?",
  "Where can I find tomatoes?",
  "What pickup times are available?",
  "Which farmers sell dairy products?",
];

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm the MarketLink assistant. Ask me about markets, farmers, products, or how pickup works." },
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(q) {
    const text = q ?? question;
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await api.post("/assistant/ask", { question: text });
      setMessages((m) => [...m, { role: "assistant", text: res.data.answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, I couldn't process that right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Lighting Effects */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2 flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-7 h-7" />
            </div>
            Ask MarketLink
          </h1>
          <p className="text-xs sm:text-sm text-sage-300">
            Get quick answers about markets, farmers, products and pickup — grounded in real, current listings.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="text-xs px-3.5 py-2 rounded-xl bg-forest-900/60 border border-white/10 text-sage-300 hover:text-white hover:border-emerald-500/40 hover:bg-forest-900/90 transition duration-300 backdrop-blur-md shadow-3d-card"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chat Messages Container */}
        <div className="bg-gradient-card backdrop-blur-xl border border-white/10 rounded-3xl p-5 h-[450px] overflow-y-auto flex flex-col gap-4 mb-4 shadow-3d-card scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${isUser ? "self-end flex-row-reverse" : "self-start"}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUser
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                      : "bg-forest-900/80 border-white/10 text-mint-300"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`whitespace-pre-line text-xs sm:text-sm px-4 py-3 rounded-2xl leading-relaxed shadow-3d-card ${
                    isUser
                      ? "bg-gradient-btn text-white font-medium rounded-tr-none"
                      : "bg-forest-900/60 border border-white/10 text-sage-200 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-sage-300 self-start bg-forest-900/40 border border-white/10 px-4 py-2.5 rounded-2xl rounded-tl-none animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              Thinking...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask();
          }}
          className="p-2 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center gap-2"
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm text-white placeholder-sage-300/50 focus:outline-none"
          />
          <button
            type="submit"
            className="p-3 rounded-xl bg-gradient-btn text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-3d-card"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}