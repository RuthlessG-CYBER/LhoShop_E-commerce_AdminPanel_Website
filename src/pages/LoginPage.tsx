import { useState } from 'react';
import {
  Eye,
  EyeOff,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BASE_URL } from '@/lib/api';
import axios from 'axios';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const highlightStats = [
    { label: 'GMV processed', value: '$82M', detail: '+18% YoY' },
    { label: 'Orders per min', value: '1.4k', detail: 'Peak throughput' },
    { label: 'Tickets resolved', value: '98%', detail: 'SLA compliance' },
    { label: 'Vendors onboarded', value: '320+', detail: 'Global merchants' },
  ];

  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaValue('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (captchaValue.toUpperCase() !== captchaCode) {
      setError('Invalid CAPTCHA code');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/admin/login`, {
        email,
        password,
      });

      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.admin.id);
      console.log(res.data.token);
      localStorage.setItem('isAuthenticated', 'true');
      window.location.href = '/dashboard';

    } catch (err) {
      setError('Invalid credentials');
      console.log(err)
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.15),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(49,46,129,0.2),_transparent_55%)]" />

      <div className="relative z-10 flex min-h-screen w-full flex-col overflow-hidden bg-background/95 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur md:flex-row">
        <div className="relative hidden w-full flex-col justify-between bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] p-12 text-white md:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%)] opacity-80" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')] opacity-10 mix-blend-overlay" />

          <div className="relative">
            <div className="flex items-center gap-3 text-lg font-semibold uppercase tracking-[0.3em] text-white/80">
              <ShoppingBag className="h-6 w-6" />
              LhoShop
            </div>
            <h2 className="mt-10 text-3xl font-semibold">LhoShop Admin Panel</h2>
            <p className="mt-4 text-sm text-white/80">
              Manage your ecommerce catalogue, payments, and fulfilment from a single command centre.
            </p>
          </div>

          <div className="relative space-y-6">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/70">
                <Sparkles className="h-5 w-5" />
                Real-time commerce telemetry
              </div>
              <p className="mt-3 text-base text-white/90">
                Inventory, revenue, CX, and risk data in one orchestrated view for decisive operators.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {highlightStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/15 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/70">
                    <TrendingUp className="h-4 w-4" />
                    {stat.label}
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-28 -left-20 hidden w-64 rounded-full bg-indigo-500/20 blur-[120px]" />
        </div>

        <div className="flex w-full items-center justify-center px-6 py-10 sm:px-12 sm:py-14">
          <div className="mx-auto max-w-lg w-full space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-8">
                <ShieldCheck className="h-4 w-4" />
                Secure workspace access
              </div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight mb-4">Welcome back</h1>
              <p className="text-sm font-medium text-muted-foreground mb-8">
                Enter your credentials to access your LhoShop admin dashboard
              </p>
            </div>

            <div className="bg-card rounded-3xl border border-border p-8 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs font-bold text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-12 rounded-xl text-sm border-border focus:border-indigo-500 bg-background text-foreground transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</Label>
                  {/* <button type="button" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-colors">
                    Forgot password?
                  </button> */}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 rounded-xl text-sm pr-12 border-border focus:border-indigo-500 bg-background text-foreground transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="captcha" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Security check</Label>
                <div className="flex gap-3">
                  <div className="flex h-12 flex-1 items-center justify-center rounded-xl px-4 font-mono text-xl font-bold tracking-[0.3em] border border-border bg-muted/50 text-indigo-600 dark:text-indigo-400">
                    {captchaCode}
                  </div>
                  <Button type="button" size="icon" variant="outline" onClick={refreshCaptcha} className="h-12 w-12 rounded-xl hover:bg-muted border-border bg-background">
                    <RefreshCw size={18} className="text-foreground"/>
                  </Button>
                </div>
                <Input
                  id="captcha"
                  value={captchaValue}
                  onChange={(e) => setCaptchaValue(e.target.value)}
                  placeholder="Enter the code above"
                  maxLength={6}
                  className="h-12 rounded-xl text-sm border-border focus:border-indigo-500 bg-background text-foreground transition-all"
                />
              </div>

              <div className="flex items-center space-x-3 text-foreground">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(c as boolean)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="remember" className="text-xs font-semibold text-muted-foreground cursor-pointer">Remember me for 30 days</Label>
              </div>

              <Button type="submit" className="h-12 w-full text-sm font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                {isLoading ? 'Signing in...' : 'Sign in to account'}
              </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
