import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

export default function Navbar({ toggleSidebar, isOpen, openCommandPalette }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hotelMenuOpen, setHotelMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setHotelMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setHotelMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const currentHotel = "OptiStay Grand Hotel";
  const hotels = ["OptiStay Grand Hotel", "OptiStay Casablanca", "OptiStay Marrakech"];

  const notifications = [
    { id: 1, type: 'Check-in', message: 'Check-in: Karim Alaoui — Room 204', time: '2 min ago', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20' },
    { id: 2, type: 'Alert', message: 'Room 102: Maintenance requested', time: '15 min ago', icon: AlertCircle, color: 'text-amber-500 bg-amber-100 dark:bg-amber-500/20' },
    { id: 3, type: 'Booking', message: 'New booking: Anna Fischer — Suite 401', time: '1h ago', icon: Building, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20' },
  ];

  return (
    <nav ref={navRef} className={cn(
      "h-[72px] bg-white/85 dark:bg-[var(--bg-card)]/85 backdrop-blur-[12px] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300",
      isScrolled ? "border-b border-[var(--border)] shadow-sm" : "border-b border-transparent"
    )}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search / Command Button */}
        <button 
          onClick={openCommandPalette}
          className="hidden sm:flex items-center gap-2 bg-[var(--bg-main)] border border-[var(--border)] px-4 py-2 rounded-xl text-[var(--text-muted)] w-64 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-text"
        >
          <Search className="w-4 h-4 group-hover:text-[var(--text-primary)]" />
          <span className="text-sm font-medium">Search or jump to...</span>
          <div className="ml-auto flex gap-1">
            <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] shadow-sm">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] shadow-sm">K</kbd>
          </div>
        </button>

        {/* Multi-Hotel Switcher */}
        <div className="hidden lg:block relative font-sans">
          <button 
            onClick={() => { setHotelMenuOpen(!hotelMenuOpen); setProfileOpen(false); setNotificationsOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent dark:border-transparent"
          >
            <Building className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm font-bold text-[var(--text-primary)]">{currentHotel}</span>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
          </button>

          {hotelMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 py-2 z-50">
              <div className="px-4 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Switch Hotel</div>
              {hotels.map((hotel, idx) => (
                <button 
                  key={idx}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between",
                    hotel === currentHotel 
                      ? "bg-[var(--bg-main)] text-emerald-600 dark:text-emerald-400" 
                      : "text-[var(--text-primary)] hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                  onClick={() => setHotelMenuOpen(false)}
                >
                  {hotel}
                  {hotel === currentHotel && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
              <div className="border-t border-[var(--border)] mt-2 pt-2">
                <button className="w-full text-left px-4 py-2 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  + Add New Property
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-[var(--bg-main)] border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-muted)] hover:text-emerald-500 dark:hover:text-emerald-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); setHotelMenuOpen(false); }}
            className="p-2.5 rounded-full bg-[var(--bg-main)] border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-muted)] hover:text-emerald-500 dark:hover:text-emerald-400 transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[var(--bg-card)]"></span>
          </button>
          
          {notificationsOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-main)]">
                <span className="font-bold text-[var(--text-primary)]">Notifications</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 rounded-md">3 New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex gap-4 cursor-pointer">
                    <div className={cn("p-2 rounded-xl shrink-0 mt-0.5", notif.color)}>
                      <notif.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">{notif.type}</h4>
                      <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5">{notif.message}</p>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-main)] text-center">
                <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); setHotelMenuOpen(false); }}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-[var(--border)] transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-[var(--text-primary)] leading-tight capitalize">Sarah Chen</span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">General Manager</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop" 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[var(--border)] shadow-sm"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[var(--bg-card)] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[var(--border)] py-2 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-4 py-3 border-b border-[var(--border)] sm:hidden">
                <span className="block text-sm font-bold text-[var(--text-primary)] capitalize">Sarah Chen</span>
                <span className="block text-xs font-medium text-[var(--text-muted)]">General Manager</span>
              </div>
              <button 
                onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-3"
              >
                <User className="w-4 h-4" /> My Profile
              </button>
              
              <button 
                onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-3"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
