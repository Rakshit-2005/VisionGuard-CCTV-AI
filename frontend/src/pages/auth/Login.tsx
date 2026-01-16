import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on role
      const stored = localStorage.getItem('safetyai_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.role === 'platform_admin') {
          navigate('/platform');
        } else {
          navigate('/company');
        }
      }
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = async (type: 'platform' | 'company') => {
    setIsLoading(true);
    const email = type === 'platform' ? 'admin@safetyai.com' : 'john@techforge.com';
    const result = await login(email, 'demo');
    
    if (result.success) {
      navigate(type === 'platform' ? '/platform' : '/company');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center glow-primary">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">SafetyAI</h1>
              <p className="text-primary font-medium">Compliance Monitoring Platform</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            AI-Powered Safety<br />Compliance Monitoring
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Real-time PPE detection and safety compliance tracking for industrial environments. 
            Protect your workforce with intelligent monitoring.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            {[
              { label: 'Companies', value: '500+' },
              { label: 'Cameras', value: '10K+' },
              { label: 'Detections/Day', value: '1M+' },
              { label: 'Compliance Rate', value: '94%' },
            ].map((stat) => (
              <div key={stat.label} className="glass-panel p-4">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SafetyAI</h1>
              <p className="text-xs text-muted-foreground">Compliance Platform</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground mt-1">
                Sign in to your account to continue
              </p>
            </div>

            {/* Demo buttons */}
            <div className="glass-panel p-4 space-y-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Quick Demo Access
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDemoLogin('platform')}
                  disabled={isLoading}
                >
                  Platform Admin
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDemoLogin('company')}
                  disabled={isLoading}
                >
                  Company Admin
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12"
                variant="glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register your company
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
