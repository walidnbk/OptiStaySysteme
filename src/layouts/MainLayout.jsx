import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import CommandPalette from '../components/CommandPalette';
import FloatingActionMenu from '../components/FloatingActionMenu';
import { cn } from '../utils/cn';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // We can open the command palette from the layout layer. 
  // It also controls the navbar shortcut if we pass the state setter down.
  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-20",
          "max-md:ml-0" 
        )}
      >
        <Navbar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} openCommandPalette={() => setIsCommandOpen(true)} />
        
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden relative">
          <Outlet />
        </main>
      </div>

      <CommandPalette isOpen={isCommandOpen} setIsOpen={setIsCommandOpen} />
      <FloatingActionMenu />
    </div>
  );
}
