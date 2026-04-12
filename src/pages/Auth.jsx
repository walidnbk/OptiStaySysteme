import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, ChevronRight, ShieldCheck, Loader2, Eye, EyeOff, Check, Hotel } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('admin@optistay.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Receptionist');
  const [errors, setErrors] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 800);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex text-slate-800 dark:text-slate-100">
      <style>
        {`
          :root {
            --bg-auth: #F8FAF9;
          }
          .dark {
            --bg-auth: var(--bg-main);
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-float-delayed { animation: float 3s ease-in-out 1.5s infinite; }
          
          .bg-dots {
            background-color: var(--bg-auth);
            background-image: radial-gradient(rgba(0,0,0,0.04) 2px, transparent 2px);
            background-size: 24px 24px;
          }
          .dark .bg-dots {
            background-image: radial-gradient(rgba(255,255,255,0.04) 2px, transparent 2px);
          }
        `}
      </style>
      
      {/* Left Split - Branding */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden animate-in fade-in slide-in-from-left-6 duration-500 fill-mode-both">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        {/* Layered Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-100 transition-opacity" 
          style={{ background: 'linear-gradient(135deg, rgba(5, 46, 22, 0.92) 0%, rgba(22, 163, 74, 0.75) 50%, rgba(5, 150, 105, 0.85) 100%)' }}
        ></div>
        {/* Noise overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAlIiBoZWlnaHQ9IjIwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjklIiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjI1Ii8+PC9zdmc+')] mix-blend-overlay"></div>
        
        <div className="relative z-10 w-full max-w-lg text-white flex flex-col h-full justify-center">
          
          {/* Logo */}
          <div className="animate-in fade-in fill-mode-both delay-[100ms] duration-500 mb-12">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-[12px] flex items-center justify-center shadow-lg border border-white/20">
                  <Building2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h1 className="text-[22px] font-bold font-serif tracking-tight text-white">OptiStay</h1>
              </div>
              <span className="text-[12px] font-sans text-white/60 ml-[60px] -mt-1 font-medium tracking-wide">Hotel Management Suite</span>
            </div>
          </div>

          {/* Headline */}
          <div className="animate-in fade-in fill-mode-both delay-[200ms] duration-500 mb-8">
            <h2 className="text-[52px] font-bold font-serif tracking-tight leading-[1.1] mb-4 text-white">
              Smart Hotel Management, <br />
              <span className="relative inline-block pb-1">
                Elevated.
                <div className="absolute bottom-1.5 left-0 w-full h-[3px] bg-emerald-400 rounded-full"></div>
              </span>
            </h2>
            <p className="font-sans text-[15px] text-white/70 font-medium">Trusted by 200+ hotels across Morocco & Africa</p>
          </div>
          
          {/* Trust Badges */}
          <div className="flex gap-4 animate-in fade-in fill-mode-both delay-[300ms] duration-500 mb-16 shrink-0 flex-wrap">
            {['🛡 Enterprise Security', '🔒 256-bit SSL', '✓ GDPR Compliant'].map(badge => (
              <div key={badge} className="px-[12px] py-[10px] rounded-full border border-white/80 flex items-center justify-center backdrop-blur-[8px] bg-white/10 text-[13px] font-semibold text-white font-sans shadow-sm">
                {badge}
              </div>
            ))}
          </div>

          {/* Testimonial & Floating Stats */}
          <div className="relative animate-in fade-in fill-mode-both delay-[400ms] duration-500 w-full max-w-md">
            <div className="backdrop-blur-[16px] bg-white/10 border border-white/20 rounded-[16px] p-6 shadow-xl">
              <div className="text-amber-400 text-sm mb-3">★★★★★</div>
              <p className="font-sans text-[15px] font-medium text-white leading-relaxed mb-4">
                "OptiStay transformed how we manage our 3 hotel properties. Check-in time dropped by 60%."
              </p>
              <p className="font-sans text-xs text-white/70 font-semibold">— Youssef Amrani, General Manager — Kenzi Hotels, Casablanca</p>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-12 -right-8 animate-in fade-in zoom-in-90 fill-mode-both delay-[500ms] duration-500">
              <div className="animate-float bg-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-xl border border-slate-100">
                <span className="text-emerald-700 text-[13px] font-bold font-sans flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-emerald-500" /> 1,240 rooms managed today
                </span>
              </div>
            </div>
            <div className="absolute bottom-8 -right-16 animate-in fade-in zoom-in-90 fill-mode-both delay-[600ms] duration-500">
              <div className="animate-float-delayed bg-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-xl border border-slate-100">
                <span className="text-emerald-700 text-[13px] font-bold font-sans flex items-center gap-2">
                  <span className="text-base">📋</span> 98 bookings processed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Split - Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 relative bg-dots h-screen overflow-y-auto">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-6 duration-500 delay-[200ms] fill-mode-both flex flex-col items-center my-auto">
          
          <div className="w-10 h-10 bg-[var(--bg-card)] rounded-[12px] flex items-center justify-center shadow-sm border border-[var(--border)] mb-[12px] md:hidden shrink-0">
            <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
          </div>
          
          <div className="text-center w-full mb-8">
            <h2 className="text-[32px] font-bold font-serif text-[var(--text-primary)] tracking-tight">Welcome Back</h2>
            <p className="font-sans text-[14px] text-[var(--text-muted)] mt-1.5 font-medium">Sign in to your OptiStay workspace.</p>
            <div className="w-[40px] h-[2px] bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 w-full">
            
            {/* Hotel Selector */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[300ms] fill-mode-both">
              <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Your Property</label>
              <div className="relative">
                <Hotel className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-emerald-500" />
                <select className="w-full pl-11 pr-4 py-[12px] bg-white dark:bg-[var(--bg-card)] border-[1.5px] border-slate-200 dark:border-[var(--border)] rounded-[10px] focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)] text-[14px] font-sans font-medium text-[var(--text-primary)] transition-all appearance-none cursor-pointer shadow-sm">
                  <option>OptiStay Grand Hotel</option>
                  <option>OptiStay Casablanca</option>
                  <option>OptiStay Marrakech</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>

            {/* Role Selector */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms] fill-mode-both">
              <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sign in as</label>
              <div className="flex w-full gap-2">
                {['Manager', 'Receptionist', 'Housekeeping'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex-1 py-[7px] px-1 rounded-[8px] text-[13px] font-semibold transition-all duration-150 border whitespace-nowrap",
                      role === r 
                        ? "bg-emerald-500 text-white border-transparent shadow-sm" 
                        : "bg-white dark:bg-[var(--bg-card)] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {r === 'Manager' && '👔'} {r === 'Receptionist' && '🛎'} {r === 'Housekeeping' && '🧹'} <span className="hidden sm:inline">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[500ms] fill-mode-both space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@optistay.com"
                    className={cn(
                      "w-full pl-11 pr-4 py-[12px] bg-white dark:bg-[var(--bg-card)] border-[1.5px] rounded-[10px] focus:outline-none text-[14px] font-sans font-medium text-[var(--text-primary)] transition-all duration-200 shadow-sm",
                      errors.email 
                        ? "border-rose-500 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]" 
                        : "border-slate-200 dark:border-[var(--border)] focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)]"
                    )}
                  />
                </div>
                {errors.email && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full pl-11 pr-11 py-[12px] bg-white dark:bg-[var(--bg-card)] border-[1.5px] rounded-[10px] focus:outline-none text-[14px] font-sans font-medium text-[var(--text-primary)] transition-all duration-200 shadow-sm",
                      errors.password 
                        ? "border-rose-500 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]" 
                        : "border-slate-200 dark:border-[var(--border)] focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)]"
                    )}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none focus:text-emerald-500"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.password}</p>}
              </div>

              <div className="flex justify-between items-center px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="w-[16px] h-[16px] border border-slate-300 dark:border-slate-600 rounded-[4px] bg-white dark:bg-[var(--bg-card)] peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors"></div>
                    <Check className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[13px] font-sans font-medium text-slate-700 dark:text-slate-300 select-none group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-[13px] font-sans text-emerald-600 dark:text-emerald-500 font-semibold hover:underline transition-all">Forgot password?</a>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms] fill-mode-both pt-2">
              <button 
                type="submit"
                disabled={isLoading || success}
                className={cn(
                  "w-full h-[52px] rounded-[10px] text-[15px] font-sans font-semibold text-white transition-all duration-200 shadow-[0_4px_14px_0_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 group relative overflow-hidden",
                  success ? "bg-emerald-500" : "bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] active:scale-[0.98] disabled:opacity-80 disabled:pointer-events-none"
                )}
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
                ) : success ? (
                  <><Check className="w-5 h-5" /> Success!</>
                ) : (
                  <>Sign In to Workspace <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                <span className="text-[12px] font-sans text-slate-400 font-medium whitespace-nowrap px-1">or continue with</span>
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
              </div>

              <button type="button" className="w-full h-[44px] bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-[var(--border)] rounded-[10px] mt-6 flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-[14px] font-sans font-medium text-slate-700 dark:text-slate-300">Sign in with Google</span>
              </button>
            </div>
          </form>

          <div className="w-full mt-auto pt-10">
            <p className="text-[13px] font-sans text-slate-400 font-medium text-center">
              Don't have an account? <a href="#" className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">Contact your administrator</a>
            </p>
            <p className="mt-5 mb-2 text-[11px] font-sans text-slate-300 dark:text-slate-500 text-center tracking-wide">
              © 2026 OptiStay · Privacy Policy · Terms of Service
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
