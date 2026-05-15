import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  "What is InventoryOS?",
  "How does multi-tenant work?",
  "What's included in the free trial?",
  "How do I integrate my warehouse?",
];

const botResponses: Record<string, string> = {
  "what is inventoryos": "InventoryOS is an enterprise-grade, multi-tenant inventory management SaaS platform built on a microservice architecture. It handles inventory tracking, order management, warehouse operations, stock movements, tenant management, and billing — all designed to scale to 100M+ users with sub-50ms response times.",
  "how does multi-tenant work": "Each tenant gets fully isolated data with row-level security. The Tenant Service manages organization provisioning, user assignments, role-based permissions, and custom configurations. Data is never shared between tenants, ensuring complete privacy and compliance.",
  "what's included in the free trial": "The free trial includes full access to all Business plan features for 14 days: up to 500,000 SKUs, 10 warehouses, 25 team members, API access, advanced analytics, and priority support. No credit card required to start.",
  "how do i integrate my warehouse": "InventoryOS provides REST APIs and webhooks for warehouse integration. You can connect barcode scanners, WMS systems, and IoT sensors through our Warehouse Service API. We also support pre-built integrations with ShipStation, EasyPost, and 30+ logistics providers.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, value] of Object.entries(botResponses)) {
    if (lower.includes(key) || key.includes(lower.slice(0, 20))) {
      return value;
    }
  }
  // Keyword matching
  if (lower.includes("pricing") || lower.includes("cost") || lower.includes("price")) {
    return "We offer three plans: Starter ($49/mo), Business ($199/mo), and Enterprise (custom). All plans include a 14-day free trial. Visit our pricing section for full details!";
  }
  if (lower.includes("security") || lower.includes("secure") || lower.includes("compliance")) {
    return "InventoryOS is SOC 2 Type II certified and GDPR compliant. We use AES-256 encryption, TLS 1.3, row-level tenant isolation, and maintain 99.99% uptime with multi-region failover.";
  }
  if (lower.includes("api") || lower.includes("integration") || lower.includes("integrate")) {
    return "We provide comprehensive REST APIs for all six microservices: Auth, Inventory, Orders, Warehouse, Tenant, and Billing. Full API documentation, SDKs for Python/Node.js/Go, and webhook support are included.";
  }
  if (lower.includes("support") || lower.includes("help")) {
    return "Starter plans include email support. Business plans get priority support with <4hr response time. Enterprise plans include 24/7 dedicated support with a named account manager. You can also reach us at support@inventoryos.com.";
  }
  return "Thanks for your question! I can help with information about InventoryOS features, pricing, integrations, security, and more. Try asking about our microservices, multi-tenant architecture, or specific features like order management or warehouse operations.";
}

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm the InventoryOS assistant. I can help you learn about our platform, features, pricing, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[380px] max-h-[520px] flex flex-col rounded-xl border bg-card shadow-lg animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-hero border-b">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-foreground">InventoryOS Assistant</p>
                <p className="text-xs text-primary-foreground/60">Ask me anything</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setIsOpen(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[280px] max-h-[340px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent mt-1">
                    <Bot className="h-3.5 w-3.5 text-accent-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-1">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent mt-1">
                  <Bot className="h-3.5 w-3.5 text-accent-foreground" />
                </div>
                <div className="bg-secondary rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-full border bg-secondary px-3 py-1 text-xs text-foreground hover:bg-accent transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t px-3 py-3 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${
          isOpen ? "bg-foreground text-background" : "bg-primary text-primary-foreground"
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </>
  );
};

export default AIChatWidget;
