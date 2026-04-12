import React, { useState, useRef, useEffect } from 'react';
import { Plus, CalendarCheck, BedDouble, UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

export default function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const actions = [
    { label: 'New Booking', icon: CalendarCheck, path: '/bookings', color: 'bg-emerald-500 hover:bg-emerald-600', delay: 'delay-[100ms]' },
    { label: 'Add Room', icon: BedDouble, path: '/rooms', color: 'bg-blue-500 hover:bg-blue-600', delay: 'delay-[50ms]' },
    { label: 'Add Customer', icon: UserPlus, path: '/customers', color: 'bg-purple-500 hover:bg-purple-600', delay: 'delay-[0ms]' }
  ];

  return (
    <div ref={menuRef} className="fixed bottom-8 right-8 z-50 flex flex-col items-center">
      <div className={cn("flex flex-col gap-3 mb-4 transition-all duration-300 items-end", isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}>
        {actions.map((action, idx) => (
          <div key={idx} className={cn("flex items-center gap-3 transition-all duration-300 transform", isOpen ? `translate-y-0 opacity-100 ${action.delay}` : "translate-y-4 opacity-0")}>
            <span className="bg-[var(--bg-card)] text-[var(--text-primary)] px-3 py-1.5 rounded-lg text-sm font-bold shadow-md border border-[var(--border)]">{action.label}</span>
            <button 
              onClick={() => { navigate(action.path); setIsOpen(false); }}
              className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110", action.color)}
            >
              <action.icon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      >
        <div className={cn("transition-transform duration-300", isOpen ? "rotate-[135deg]" : "rotate-0")}>
          <Plus className="w-8 h-8" />
        </div>
      </button>
    </div>
  );
}
