import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

// loginWithProvider
const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "passcode">("email");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setStep("passcode");
  };

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || passcode.length < 4) {
      setError("Passcode must be at least 4 characters");
      return;
    }
    setError("");
    try {
      await login(email, passcode);
      // Redirect based on role from the store
      const { useAuthStore } = await import("@/stores/authStore");
      const role = useAuthStore.getState().user?.role;
      navigate(role === "super_admin" ? "/super-admin" : role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  // const handleProviderLogin = async (provider: "google" | "facebook") => {
  //   try {
  //     await loginWithProvider(provider);
  //     const { useAuthStore } = await import("@/stores/authStore");
  //     const role = useAuthStore.getState().user?.role;
  //     navigate(role === "super_admin" ? "/super-admin" : role === "admin" ? "/admin" : "/dashboard");
  //   } catch {
  //     setError("Authentication failed");
  //   }
  // };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary-foreground">InventoryOS</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-primary-foreground">
            Enterprise-grade<br />
            inventory management<br />
            at any scale.
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-md">
            Multi-tenant SaaS platform built to handle millions of SKUs, warehouses,
            and real-time stock movements across your entire supply chain.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-primary-foreground">100M+</div>
              <div className="text-sm text-primary-foreground/60">Items tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">99.99%</div>
              <div className="text-sm text-primary-foreground/60">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">50ms</div>
              <div className="text-sm text-primary-foreground/60">Avg response</div>
            </div>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/40">
          © 2026 InventoryOS. Enterprise inventory infrastructure.
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InventoryOS</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {step === "email" ? "Sign in to your account" : "Enter your password"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "email"
                ? "Use your email and password to access your dashboard"
                : `Welcome back, ${email}`}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full h-11" size="lg">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passcode"
                    type="password"
                    placeholder="Enter your password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="pl-10 h-11"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full h-11" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => { setStep("email"); setPasscode(""); setError(""); }}
                className="w-full text-sm text-primary hover:underline"
              >
                Use a different email
              </button>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              // onClick={() => handleProviderLogin("google")}
              disabled={isLoading}
              className="h-11"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              // onClick={() => handleProviderLogin("facebook")}
              disabled={isLoading}
              className="h-11"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          <div className="rounded-lg border bg-muted/50 p-3 space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Demo credentials (registered in backend):</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-mono text-primary">Email</span> → registered email address</p>
              <p><span className="font-mono text-primary">Password</span> → the password set during registration</p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
