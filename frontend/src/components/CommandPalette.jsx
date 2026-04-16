import React, { useState, useEffect } from 'react';
import { Search, BedDouble, CalendarCheck, Users, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

export default function CommandPalette({ isOpen, setIsOpen }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  if (!isOpen) return null;

  const actions = [
    { title: 'Add New Room', icon: Plus, action: () => navigate('/rooms') },
    { title: 'Create Booking', icon: CalendarCheck, action: () => navigate('/bookings') },
    { title: 'Go to Customers', icon: Users, action: () => navigate('/customers') },
    { title: 'Go to Settings', icon: Settings, action: () => navigate('/settings') },
    { title: 'Calendar View', icon: BedDouble, action: () => navigate('/calendar') },
  ];

  const filteroseActions = actions.filter((action) =>
    action.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
      <div 
        className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/60 dark:border-slate-800 animate-in slide-in-from-top-4 zoom-in-95" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            autoFocus 
            placeholder="Search commands or go to... (e.g. Add Room)" 
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 rounded-lg">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filteroseActions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No results found for "{query}"</div>
          ) : (
            filteroseActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-50/500/10 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{action.title}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
