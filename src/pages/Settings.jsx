import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Settings as SettingsIcon, 
  Building, 
  Camera, 
  Moon, 
  Sun, 
  Bell, 
  Globe
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../utils/cn';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'account', label: 'Account Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'system', label: 'System Settings', icon: Building },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Settings saved successfully.', 'success');
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 max-w-5xl mx-auto w-full relative">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage your account and hotel system configurations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm w-full text-left",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white dark:bg-emerald-50/500/10 dark:text-emerald-400 shadow-sm" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "opacity-100" : "opacity-60")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden min-h-[500px]">
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="p-8 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Profile Information</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-[#0F172A] shadow-sm"
                    />
                    <button type="button" className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-700 rounded-full shadow-md border border-slate-200 dark:border-slate-600 hover:scale-105 transition-transform text-slate-600 dark:text-slate-200">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Profile Photo</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Recommended size 400x400px. JPG, PNG or GIF.</p>
                    <div className="flex gap-3 mt-3">
                      <button type="button" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">Upload new</button>
                      <button type="button" className="text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                    <input required defaultValue="Sarah" type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-sm font-medium text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                    <input required defaultValue="Chen" type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-sm font-medium text-slate-800 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input required defaultValue="sarah.chen@optistay.com" type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-sm font-medium text-slate-800 dark:text-white" />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm shadow-slate-900/20 dark:shadow-white/10 active:scale-95">
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'account' && (
              <form onSubmit={handleSave} className="p-8 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Account Security</h2>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium text-slate-800 dark:text-white" />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Localization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Language</label>
                      <div className="relative">
                        <Globe className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium text-slate-800 dark:text-white appearance-none cursor-pointer">
                          <option>English (US)</option>
                          <option>French (FR)</option>
                          <option>Spanish (ES)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role Display</label>
                      <select disabled className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-sm font-medium text-slate-500 dark:text-slate-400 appearance-none cursor-not-allowed">
                        <option>General Manager (Admin)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm shadow-slate-900/20 dark:shadow-white/10 active:scale-95">
                    Update Security
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'preferences' && (
              <div className="p-8 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">User Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-xl">
                        {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Dark Mode</h4>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Adjust the appearance of the interface.</p>
                      </div>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className={cn(
                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
                        isDarkMode ? "bg-emerald-50/500" : "bg-slate-300 dark:bg-slate-600"
                      )}
                    >
                      <span className={cn(
                        "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                        isDarkMode ? "translate-x-6" : "translate-x-1"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-xl">
                        <Bell className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Push Notifications</h4>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Receive alerts for new bookings and messages.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={cn(
                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
                        notificationsEnabled ? "bg-emerald-50/500" : "bg-slate-300 dark:bg-slate-600"
                      )}
                    >
                      <span className={cn(
                        "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                        notificationsEnabled ? "translate-x-6" : "translate-x-1"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <form onSubmit={handleSave} className="p-8 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Hotel Configuration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pricing Base Currency</label>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 flex-1 appearance-none cursor-pointer dark:text-white">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Room Categories</label>
                  <div className="space-y-3">
                    {['Single Room', 'Double Room', 'Executive Suite'].map((category, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input defaultValue={category} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium text-slate-800 dark:text-white" />
                        <button type="button" className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors shrink-0">
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mt-2 flex items-center gap-2">
                       + Add Category
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm shadow-slate-900/20 dark:shadow-white/10 active:scale-95">
                    Save Configuration
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
