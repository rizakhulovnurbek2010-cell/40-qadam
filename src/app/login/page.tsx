"use client";

import { useState } from "react";
import { TrendingUp, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/server/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if (res && !res.success) {
      setError(res.error || "Tizimga kirishda xatolik");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Apex CRM Pro
          </h1>
          <p className="text-xs text-zinc-400">
            B2B savdo bo'limi boshqaruv paneliga xush kelibsiz
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Tizimga kirish</h2>
            <p className="text-xs text-zinc-400">
              Menejer hisob ma'lumotlaringizni kiriting
            </p>
          </div>

          {error && (
            <div className="p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Email manzil
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  name="email"
                  type="email"
                  required
                  defaultValue="admin@crm.uz"
                  className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500"
                  placeholder="admin@crm.uz"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Parol
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  name="password"
                  type="password"
                  required
                  defaultValue="password123"
                  className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 h-auto cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <>
                  Kirish
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Seed demo hints */}
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1 text-[11px] text-zinc-400">
            <span className="font-semibold text-zinc-300 block">
              Dastlabki hisob (Demo):
            </span>
            <div>Login: <code className="text-blue-400">admin@crm.uz</code></div>
            <div>Parol: <code className="text-blue-400">password123</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
