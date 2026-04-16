import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  CalendarDays,
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Calendar', path: '/calendar', icon: CalendarDays },
  { name: 'Rooms', path: '/rooms', icon: BedDouble },
  { name: 'Bookings', path: '/bookings', icon: CalendarCheck },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col shadow-sm border-r",
        "bg-[var(--bg-card)] border-[var(--border)]",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-[72px] items-center justify-between px-4 border-b border-[var(--border)] shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden ml-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all hover:opacity-80">
          <div className="p-2 bg-emerald-500 rounded-xl shrink-0 shadow-sm shadow-emerald-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span
            className={cn(
              "font-bold text-xl text-[var(--text-primary)] transition-opacity duration-300 whitespace-nowrap",
              isOpen ? "opacity-100" : "opacity-0 hidden"
            )}
          >
            OptiStay
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4 no-scrollbar pb-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-3 rounded-r-xl transition-all duration-150 group text-sm font-semibold border-l-[3px] hover:translate-x-1",
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "border-transparent text-[var(--text-muted)] hover:bg-slate-50 hover:text-[var(--text-primary)] dark:hover:bg-slate-800/50",
                !isOpen && "justify-center px-0 ml-0 rounded-xl border-l-[0px]"
              )
            }
          >
            <item.icon className={cn(
              "w-5 h-5 shrink-0 transition-colors",
              !isOpen && "mx-auto"
            )} />
            {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--border)] flex flex-col gap-2 relative shrink-0">
        <div className="absolute top-[-40px] left-0 w-full h-10 bg-gradient-to-t from-[var(--bg-card)] to-transparent pointer-events-none"></div>
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-[-16px] bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full p-1 shadow-sm transition-all z-50 hidden md:block"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 p-3 w-full rounded-xl text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors font-semibold text-sm",
            !isOpen && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
