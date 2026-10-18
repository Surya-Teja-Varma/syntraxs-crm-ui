import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Users, BarChart3, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import backgroundImage from '../assets/login-background.png';
import logoImage from '../assets/zoopiter-logo.png';
import { ParallaxGraphCard } from './ParallaxGraphCard';
import './Login.css';

interface LoginProps {
  onLogin: (email: string, password: string, role?: 'admin' | 'sales') => Promise<boolean>;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'sales'>('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const quickAccounts = [
    { role: 'admin' as const, label: 'Admin (Krishnaprasad)', email: 'krishnaprasad@bristletech.com' },
    { role: 'admin' as const, label: 'Admin (Zoopiter)', email: 'admin@zoopiter.com' },
    { role: 'sales' as const, label: 'Sales (Masthan Vali)', email: 'mastanvali@bristletech.com' },
    { role: 'sales' as const, label: 'Sales (Rajesh)', email: 'rajesh@bristletech.com' },
  ];

  const handleSelectQuickAccount = (account: typeof quickAccounts[0]) => {
    setEmail(account.email);
    setPassword('random123');
    setSelectedRole(account.role);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter an email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Login API check is removed: any password is accepted
      const passToUse = password.trim() || 'random123';
      const success = await onLogin(email.trim(), passToUse, selectedRole);
      if (!success) {
        setError('Login failed. Please check the details and try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding & Interactive Parallax Showcase */}
      <div className="hidden lg:flex lg:flex-1 bg-[#090D1A] text-white p-8 px-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle radial glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1e293b40_0%,transparent_70%)]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <img src={logoImage} alt="Zoopiter" className="h-12" />
            <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              Live Interactive Preview
            </span>
          </div>
          <h2 className="mb-2 login-title">
            Streamline Your Sales Process
          </h2>
          <p className="login-subtitle text-slate-400 text-sm max-w-lg">
            Manage leads, track performance, and drive revenue growth with real-time analytics.
          </p>
        </div>

        {/* 3D Parallax Graph Block Showcase */}
        <div className="relative z-20 my-2">
          <ParallaxGraphCard />
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
          <div className="flex items-start space-x-3">
            <div className="mt-1 p-2.5 bg-[#1B2338] rounded-xl border border-slate-700/50">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="mb-0.5 text-white font-semibold text-xs">Team Management</h3>
              <p className="text-[#8B92A8] text-[11px]">
                Assign leads & track performance effectively.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-1 p-2.5 bg-[#1B2338] rounded-xl border border-slate-700/50">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="mb-0.5 text-white font-semibold text-xs">Performance Analytics</h3>
              <p className="text-[#8B92A8] text-[11px]">
                Deep insights with real-time conversion reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div
        className="flex-1 flex items-center justify-center p-8 relative overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat'
        }}
      >
        <div className="w-full max-w-md space-y-4 relative z-10">
          <div className="text-center lg:hidden mb-4">
            <div className="mb-2">
              <h1 className="text-[#5BFF7D] bg-[#0B0F1F] inline-block px-4 py-2 rounded-lg mobile-logo">
                Zoopiter
              </h1>
            </div>
          </div>

          <Card className="border-border/50 shadow-2xl bg-white/85 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center welcome-title">Welcome Back</CardTitle>
              <CardDescription className="text-center welcome-description">
                Sign in with any email and random password
              </CardDescription>
              <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-emerald-600 font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                <span>API password check disabled — any password works</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email (e.g. admin@zoopiter.com)"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (e.target.value.toLowerCase().includes('admin')) {
                        setSelectedRole('admin');
                      }
                    }}
                    required
                    className="bg-[#F5F6F8] border-gray-200 h-11 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <span className="text-[11px] text-emerald-600 font-medium">Any random password accepted</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter any password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#F5F6F8] border-gray-200 h-11 focus:bg-white transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role selection for custom emails */}
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-xs font-semibold">Sign in as Role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                        selectedRole === 'admin'
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      🛡️ Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('sales')}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                        selectedRole === 'sales'
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      💼 Sales Member
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[rgb(0,0,0)] hover:bg-[#0B0F1F] text-white transition-colors" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick test accounts */}
          <Card className="border-border/50 bg-white/90 backdrop-blur-sm shadow-md">
            <CardHeader className="py-2.5 px-4 pb-2">
              <CardTitle className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Quick Test Accounts (1-Click)
              </CardTitle>
              <CardDescription className="text-[11px] text-gray-500">
                Click any account to populate email & password
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                {quickAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleSelectQuickAccount(account)}
                    className="text-left p-2 rounded-lg bg-[#F5F6F8] hover:bg-gray-200/70 transition-colors border border-gray-200/60"
                  >
                    <div className="text-xs font-semibold text-gray-800 truncate">{account.label}</div>
                    <div className="text-[11px] text-gray-500 truncate">{account.email}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}