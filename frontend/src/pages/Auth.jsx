import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, ChevronRight, Check, Hotel, User, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function parseAuthError(err) {
  const status = err.response?.status;
  const data = err.response?.data ?? {};
  const fieldErrors = {};
  if (data.errors && typeof data.errors === 'object') {
    for (const [key, value] of Object.entries(data.errors)) {
      fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
    }
  }
  let message = '';
  if (status === 401) {
    message = data.message || 'Invalid credentials.';
  } else if (status === 422) {
    message = data.message || 'Please check the highlighted fields.';
  } else if (data.message) {
    message = data.message;
  } else if (err.code === 'ERR_NETWORK') {
    message = 'Cannot reach the server. Is Laravel running on http://127.0.0.1:8000?';
  } else {
    message = err.message || 'Something went wrong. Please try again.';
  }
  return { message, fieldErrors };
}

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, resetPassword } = useAuth();
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setGeneralError('');
    setFieldErrors({});
  }, [view]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const { message, fieldErrors: fe } = parseAuthError(err);
      setGeneralError(message);
      setFieldErrors(fe);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});
    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role: 'receptionist',
      });
      navigate('/dashboard');
    } catch (err) {
      const { message, fieldErrors: fe } = parseAuthError(err);
      setGeneralError(message);
      setFieldErrors(fe);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});
    setIsLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setView('login');
      }, 800);
    } catch (err) {
      setGeneralError(err.message || 'Please enter a valid email.');
    } finally {
      setIsLoading(false);
    }
  };

  const variants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen flex text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-500/30">
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
      <div className="hidden md:flex fixed inset-y-0 left-0 w-1/2 flex-col items-center justify-center p-12 overflow-hidden animate-in fade-in slide-in-from-left-6 duration-500 fill-mode-both z-10">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        {/* Layered Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-100 transition-opacity" 
          style={{ background: 'linear-gradient(135deg, rgba(5, 46, 22, 0.92) 0%, rgba(22, 163, 74, 0.75) 50%, rgba(5, 150, 105, 0.85) 100%)' }}
        ></div>
        {/* Noise overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAlIiBoZWlnaHQ9IjIwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjAuMjUiLz48L3N2Zz4=')] mix-blend-overlay"></div>
        
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

      {/* RIGHT PANEL: Dynamic form zone, scrollable */}
      <div className="w-full md:w-1/2 md:ml-[50%] min-h-screen flex flex-col justify-center p-6 sm:p-12 relative bg-dots overflow-y-auto">
        <div className="w-full max-w-[420px] mx-auto py-12 relative z-10">
          <AnimatePresence mode="wait">
            
            {/* ---------------- LOGIN VIEW ---------------- */}
            {view === 'login' && (
              <motion.div
                key="login"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <div className="text-center mb-10">
                  <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm border border-zinc-200 dark:border-zinc-800 mx-auto mb-6 md:hidden">
                    <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-bold font-serif text-zinc-900 dark:text-white tracking-tight">Welcome Back</h2>
                  <p className="font-sans text-[14px] text-zinc-500 dark:text-zinc-400 mt-2">Sign in to your OptiStay workspace.</p>
                </div>

                <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/50 border border-white dark:border-zinc-800 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                  <form onSubmit={handleLogin} className="space-y-5">
                    {generalError ? (
                      <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/30 px-3 py-2.5 text-[13px] font-medium text-rose-700 dark:text-rose-300">
                        {generalError}
                      </div>
                    ) : null}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined })); }}
                            className={cn(
                              "w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-zinc-950/50 border rounded-xl focus:outline-none focus:ring-2 text-[14px] font-sans font-medium text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400",
                              fieldErrors.email
                                ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                                : "border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500/20 focus:border-emerald-500"
                            )}
                            placeholder="admin@optistay.com"
                          />
                        </div>
                        {fieldErrors.email ? (
                          <p className="text-[12px] font-medium text-rose-600 dark:text-rose-400 mt-1.5 ml-1">{fieldErrors.email}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined })); }}
                            className={cn(
                              "w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-zinc-950/50 border rounded-xl focus:outline-none focus:ring-2 text-[14px] font-sans font-medium text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400",
                              fieldErrors.password
                                ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                                : "border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500/20 focus:border-emerald-500"
                            )}
                            placeholder="••••••••"
                          />
                        </div>
                        {fieldErrors.password ? (
                          <p className="text-[12px] font-medium text-rose-600 dark:text-rose-400 mt-1.5 ml-1">{fieldErrors.password}</p>
                        ) : null}
                      </div>

                      <div className="flex justify-between items-center px-1 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="checkbox" className="peer sr-only" defaultChecked />
                            <div className="w-4 h-4 border border-zinc-300 dark:border-zinc-700 rounded bg-white/50 dark:bg-zinc-950/50 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors"></div>
                            <Check className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[13px] font-sans font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Remember me</span>
                        </label>
                        <button type="button" onClick={() => setView('forgot')} className="text-[13px] font-sans text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                          Forgot password?
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                          "w-full h-[52px] rounded-[10px] text-[15px] font-sans font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 group relative overflow-hidden",
                          "bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 hover:-translate-y-[1px] shadow-[0_4px_14px_0_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                        )}
                      >
                        {isLoading ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
                        ) : (
                          <>Sign in to Workspace <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </button>

                      <div className="mt-6 flex items-center justify-center gap-3">
                        <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
                        <span className="text-[12px] font-sans text-zinc-400 font-medium whitespace-nowrap px-1">or continue with</span>
                        <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
                      </div>

                      <button type="button" className="w-full h-[44px] bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-[var(--border)] rounded-[10px] mt-6 flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="text-[14px] font-sans font-medium text-zinc-700 dark:text-zinc-300">Sign in with Google</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="text-center mt-8">
                  <p className="text-[14px] text-zinc-500 dark:text-zinc-400">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setView('register')} className="font-semibold text-zinc-900 dark:text-white hover:underline transition-all">
                      Create one
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ---------------- REGISTER VIEW ---------------- */}
            {view === 'register' && (
              <motion.div
                key="register"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold font-serif text-zinc-900 dark:text-white tracking-tight">Join OptiStay</h2>
                  <p className="font-sans text-[14px] text-zinc-500 dark:text-zinc-400 mt-2">Create your workspace administration account.</p>
                </div>

                <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/50 border border-white dark:border-zinc-800 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                  <form onSubmit={handleRegister} className="space-y-4">
                    {generalError ? (
                      <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/30 px-3 py-2.5 text-[13px] font-medium text-rose-700 dark:text-rose-300">
                        {generalError}
                      </div>
                    ) : null}
                    <div>
                      <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => { setName(e.target.value); if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined })); }}
                          className={cn(
                            "w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-zinc-950/50 border rounded-xl focus:outline-none focus:ring-2 text-[14px] font-sans font-medium text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400",
                            fieldErrors.name
                              ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                              : "border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500/20 focus:border-emerald-500"
                          )}
                          placeholder="John Doe"
                        />
                      </div>
                      {fieldErrors.name ? (
                        <p className="text-[12px] font-medium text-rose-600 dark:text-rose-400 mt-1.5 ml-1">{fieldErrors.name}</p>
                      ) : null}
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined })); }}
                          className={cn(
                            "w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-zinc-950/50 border rounded-xl focus:outline-none focus:ring-2 text-[14px] font-sans font-medium text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400",
                            fieldErrors.email
                              ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                              : "border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500/20 focus:border-emerald-500"
                          )}
                          placeholder="admin@optistay.com"
                        />
                      </div>
                      {fieldErrors.email ? (
                        <p className="text-[12px] font-medium text-rose-600 dark:text-rose-400 mt-1.5 ml-1">{fieldErrors.email}</p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined })); }}
                          className={cn(
                            "w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-zinc-950/50 border rounded-xl focus:outline-none focus:ring-2 text-[14px] font-sans font-medium text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400",
                            fieldErrors.password
                              ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                              : "border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500/20 focus:border-emerald-500"
                          )}
                          placeholder="Create a strong password"
                        />
                      </div>
                      {fieldErrors.password ? (
                        <p className="text-[12px] font-medium text-rose-600 dark:text-rose-400 mt-1.5 ml-1">{fieldErrors.password}</p>
                      ) : null}
                      {fieldErrors.password_confirmation ? (
                        <p className="text-[12px] font-medium text-rose-600 dark:text-rose-400 mt-1.5 ml-1">{fieldErrors.password_confirmation}</p>
                      ) : null}
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                          "w-full h-[52px] rounded-[10px] text-[15px] font-sans font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden",
                          "bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 hover:-translate-y-[1px] shadow-[0_4px_14px_0_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                        )}
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="text-center mt-8">
                  <p className="text-[14px] text-zinc-500 dark:text-zinc-400">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setView('login')} className="font-semibold text-zinc-900 dark:text-white hover:underline transition-all">
                      Sign in
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ---------------- FORGOT PASSWORD VIEW ---------------- */}
            {view === 'forgot' && (
              <motion.div
                key="forgot"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <div className="mb-8">
                  <button type="button" onClick={() => setView('login')} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-6 shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-3xl font-bold font-serif text-zinc-900 dark:text-white tracking-tight">Reset Password</h2>
                  <p className="font-sans text-[14px] text-zinc-500 dark:text-zinc-400 mt-2">Enter your email to receive a reset link.</p>
                </div>

                <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/50 border border-white dark:border-zinc-800 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                  <form onSubmit={handleForgot} className="space-y-4">
                    {generalError ? (
                      <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/30 px-3 py-2.5 text-[13px] font-medium text-rose-700 dark:text-rose-300">
                        {generalError}
                      </div>
                    ) : null}
                    <div>
                      <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-[14px] font-sans font-medium text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400"
                          placeholder="Enter your registered email"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isLoading || success}
                        className={cn(
                          "w-full h-[52px] rounded-[10px] text-[15px] font-sans font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden",
                          success ? "bg-emerald-500 shadow-[0_4px_14px_0_rgba(16,185,129,0.2)]" : "bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 hover:-translate-y-[1px] shadow-[0_4px_14px_0_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                        )}
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? "Link Sent!" : "Send Reset Link"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="text-center mt-8">
                  <button type="button" onClick={() => setView('login')} className="font-semibold text-[14px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
                    Back to Login
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
