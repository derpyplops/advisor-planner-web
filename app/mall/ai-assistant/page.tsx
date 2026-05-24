"use client";

import MallDashboardLayout from "@/components/mall/MallDashboardLayout";
import { AIChatBox, Message } from "@/components/mall/AIChatBox";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Trash2, Bot } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "What's the optimal staffing for a 50,000 sqft mall during peak hours?",
  "How should I handle marble floor staining near the F&B zone?",
  "Our cleaning budget was cut 20%. How do I re-optimize?",
  "What inspection checklist should I use for washrooms?",
  "Recommend a deep cleaning schedule for high-traffic corridors",
  "How do I assess whether a surface needs repair vs replacement?",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Load chat history
  useEffect(() => {
    fetch("/api/mall/chat")
      .then((res) => res.json())
      .then((history) => {
        if (history && history.length > 0) {
          setMessages(
            history.map((m: any) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleSend = async (content: string) => {
    setMessages((prev) => [...prev, { role: "user", content }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/mall/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error: any) {
      toast.error("Failed to get response: " + error.message);
      // Remove the optimistic user message
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      const res = await fetch("/api/mall/chat", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear");
      setMessages([]);
      toast.success("Chat history cleared");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setClearing(false);
    }
  };

  return (
    <MallDashboardLayout>
      <div className="space-y-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20">
              <Bot className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                Retail Asset Manager
              </h1>
              <p className="text-xs text-slate-400">
                AI-powered operations advisory — direct, opinionated, operationally grounded
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 disabled:opacity-50"
              onClick={handleClear}
              disabled={clearing}
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </button>
          )}
        </div>

        {/* Chat Box */}
        <div className="flex-1 min-h-0">
          <AIChatBox
            messages={messages}
            onSendMessage={handleSend}
            isLoading={isLoading}
            placeholder="Ask about staffing, cleaning methods, asset preservation, inspections..."
            height="100%"
            emptyStateMessage="Ask the Retail Asset Manager anything about mall operations"
            suggestedPrompts={SUGGESTED_PROMPTS}
            className="border-blue-500/20"
          />
        </div>
      </div>
    </MallDashboardLayout>
  );
}
