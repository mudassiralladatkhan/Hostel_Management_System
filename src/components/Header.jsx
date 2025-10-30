import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { profile } = useAuth();

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 border-b border-border bg-card">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h2>
        <p className="text-sm text-muted-foreground">Here's a summary of your hostel's activity.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <button className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary ring-2 ring-card"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
