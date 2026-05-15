import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Package,
  ShoppingCart,
  Warehouse,
  ArrowLeftRight,
  Shield,
  Zap,
  Globe,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Users,
  Server,
  Lock,
  Layers,
  CreditCard,
} from "lucide-react";
import AIChatWidget from "@/components/AIChatWidget";

const features = [
  {
    icon: Package,
    title: "Inventory Microservice",
    desc: "Track millions of SKUs in real-time with sub-50ms query performance. Multi-warehouse, multi-location support.",
  },
  {
    icon: ShoppingCart,
    title: "Order Management",
    desc: "End-to-end order lifecycle from placement to fulfillment. Automated routing and split-shipment handling.",
  },
  {
    icon: Warehouse,
    title: "Warehouse Service",
    desc: "Manage unlimited warehouses with zone-based storage, bin management, and capacity planning.",
  },
  {
    icon: ArrowLeftRight,
    title: "Movement Tracking",
    desc: "Full audit trail of every stock movement. Transfers, adjustments, receipts, and returns tracked atomically.",
  },
  {
    icon: Users,
    title: "Tenant Service",
    desc: "Complete multi-tenant isolation with configurable permissions, custom branding, and data sovereignty.",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    desc: "Usage-based billing with subscription tiers. Stripe integration, invoicing, and revenue analytics.",
  },
];

const stats = [
  { value: "100M+", label: "Users Supported" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<50ms", label: "Avg Response" },
  { value: "12M+", label: "SKUs Managed" },
];

const currencyRates: Record<string, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: "$", rate: 1, label: "🇺🇸 USD" },
  EUR: { symbol: "€", rate: 0.92, label: "🇪🇺 EUR" },
  GBP: { symbol: "£", rate: 0.79, label: "🇬🇧 GBP" },
  INR: { symbol: "₹", rate: 83.5, label: "🇮🇳 INR" },
  JPY: { symbol: "¥", rate: 149.5, label: "🇯🇵 JPY" },
  AUD: { symbol: "A$", rate: 1.53, label: "🇦🇺 AUD" },
  CAD: { symbol: "C$", rate: 1.36, label: "🇨🇦 CAD" },
  SGD: { symbol: "S$", rate: 1.34, label: "🇸🇬 SGD" },
  AED: { symbol: "د.إ", rate: 3.67, label: "🇦🇪 AED" },
  BRL: { symbol: "R$", rate: 4.97, label: "🇧🇷 BRL" },
};

const basePlans = [
  {
    name: "Tenant",
    basePrice: 49,
    desc: "For teams managing inventory operations",
    features: ["Up to 10,000 SKUs", "2 Warehouses", "5 Team Members", "Email Support", "Basic Analytics", "Order Management", "Movement Tracking"],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Admin",
    basePrice: 299,
    desc: "Full admin panel with tenant oversight & analytics",
    features: ["Up to 1M SKUs", "Unlimited Warehouses", "50 Team Members", "Priority Support", "Advanced Analytics Dashboard", "API Access & Integrations", "Multi-Tenant Management", "Alert Service & Rules Engine", "AI Inventory Agents"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    basePrice: 0,
    desc: "Super Admin control with platform-wide governance",
    features: ["Unlimited Everything", "Super Admin Dashboard", "Platform Telemetry & Monitoring", "24/7 Dedicated Support", "Custom SLA & Uptime Guarantee", "On-Premise / Private Cloud", "SSO, SAML & RBAC", "Agent Fleet Management", "White-Label Options"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const formatPrice = (basePrice: number, currency: string): string => {
  if (basePrice === 0) return "Custom";
  const { symbol, rate } = currencyRates[currency];
  const converted = Math.round(basePrice * rate);
  return `${symbol}${converted.toLocaleString()}`;
};

const useCases = [
  {
    icon: Globe,
    title: "E-Commerce",
    desc: "Sync inventory across Shopify, Amazon, WooCommerce, and 50+ platforms in real-time.",
  },
  {
    icon: Layers,
    title: "Manufacturing",
    desc: "Raw materials tracking, BOM management, and production order integration.",
  },
  {
    icon: Server,
    title: "3PL & Logistics",
    desc: "Multi-client warehouse management with tenant-isolated operations and billing.",
  },
  {
    icon: BarChart3,
    title: "Retail Chains",
    desc: "Cross-location inventory visibility, inter-store transfers, and demand forecasting.",
  },
];

const LandingPage: React.FC = () => {
  const [currency, setCurrency] = useState("USD");
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">InventoryOS</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#use-cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(212_100%_50%_/_0.15),_transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/90 mb-6">
              <Zap className="h-3.5 w-3.5" />
              Trusted by 2,000+ businesses worldwide
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight">
              Inventory Management
              <br />
              Software That
              <br />
              <span className="text-info">Scales With You</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/70 max-w-xl leading-relaxed">
              Automate stock tracking, streamline order fulfillment, and manage warehouses across locations — 
              with real-time analytics, AI-powered agents, and multi-tenant architecture built for growing businesses.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button size="lg" className="h-12 px-8 text-base bg-info hover:bg-info/90 text-info-foreground">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-info/40 text-primary-foreground bg-info/10 hover:bg-info/20 hover:text-primary-foreground">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl lg:text-4xl font-bold text-primary-foreground">{s.value}</div>
                <div className="text-sm text-primary-foreground/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Banner */}
      <section className="border-b bg-card py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Microservice Architecture</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Six Core Services. One Unified Platform.</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {["Auth Service", "Inventory Service", "Order Service", "Warehouse Service", "Tenant Service", "Billing Service"].map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-lg border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground">
                <div className="h-2 w-2 rounded-full bg-success" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Features</p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-foreground">
              Everything you need to manage inventory at scale
            </h2>
            <p className="mt-4 text-muted-foreground">
              Each microservice is independently scalable, fault-tolerant, and designed for high-throughput operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent group-hover:bg-primary/10 transition-colors">
                  <f.icon className="h-6 w-6 text-accent-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <a className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline cursor-pointer">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Use Cases</p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-foreground">Built for every industry</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((uc) => (
              <div key={uc.title} className="flex gap-5 rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <uc.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{uc.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-wider">Security & Compliance</p>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-foreground">Enterprise-grade security built in</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                SOC 2 Type II certified, GDPR compliant, and built with zero-trust architecture. 
                Your data is encrypted at rest and in transit with AES-256 and TLS 1.3.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Multi-tenant data isolation with row-level security",
                  "Third-party auth (Google, Facebook) via OAuth 2.0",
                  "Role-based access control with granular permissions",
                  "Full audit logging and compliance reporting",
                  "99.99% uptime SLA with multi-region failover",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: "SOC 2 Type II", sub: "Certified" },
                { icon: Lock, label: "AES-256", sub: "Encryption" },
                { icon: Globe, label: "GDPR", sub: "Compliant" },
                { icon: Server, label: "Multi-Region", sub: "Failover" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center justify-center rounded-xl border bg-card p-6 text-center hover:shadow-md transition-shadow">
                  <b.icon className="h-8 w-8 text-primary mb-3" />
                  <div className="text-sm font-semibold text-foreground">{b.label}</div>
                  <div className="text-xs text-muted-foreground">{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Pricing</p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-foreground">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Currency:</span>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-32 h-8 border-0 bg-transparent"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(currencyRates).map(([code, { label }]) => (
                    <SelectItem key={code} value={code}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {basePlans.map((plan) => {
              const price = formatPrice(plan.basePrice, currency);
              return (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-8 flex flex-col ${
                    plan.highlighted
                      ? "bg-card border-primary shadow-lg ring-1 ring-primary/20 relative"
                      : "bg-card"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <div className="text-sm font-medium text-muted-foreground">{plan.name}</div>
                  <div className="mt-2 text-4xl font-bold text-foreground">
                    {price}
                    {price !== "Custom" && <span className="text-base font-normal text-muted-foreground">/mo</span>}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
                  <ul className="mt-6 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/login" className="mt-8">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
            Start managing inventory smarter today
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/70 max-w-xl mx-auto">
            Join 2,000+ businesses using InventoryOS to reduce stockouts, automate reordering, and scale warehouse operations effortlessly.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="h-12 px-8 text-base bg-info hover:bg-info/90 text-info-foreground">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Package className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">InventoryOS</span>
              </div>
              <p className="text-xs text-muted-foreground">Enterprise inventory infrastructure for modern commerce.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Integrations", "API Docs"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-foreground mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
            © 2026 InventoryOS. All rights reserved.
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIChatWidget />
    </div>
  );
};

export default LandingPage;
