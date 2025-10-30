import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Building, LayoutDashboard, Users, BedDouble, CircleDollarSign, 
  UserCheck, FileText, Settings, LogOut, ShieldAlert, Megaphone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Logout failed:', error.message);
    } else {
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, name: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, name: 'Students', path: '/students' },
    { icon: <BedDouble size={20} />, name: 'Rooms', path: '/rooms' },
    { icon: <CircleDollarSign size={20} />, name: 'Fees', path: '/fees' },
    { icon: <UserCheck size={20} />, name: 'Visitors', path: '/visitors' },
    { icon: <ShieldAlert size={20} />, name: 'Complaints', path: '/complaints' },
    { icon: <Megaphone size={20} />, name: 'Announcements', path: '/announcements' },
    { icon: <FileText size={20} />, name: 'Reports', path: '/reports' },
    { icon: <Settings size={20} />, name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex-col hidden md:flex">
      <div className="flex items-center justify-center h-20 border-b border-border">
        <Building className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold ml-2 text-foreground">HMS</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            {item.icon}
            <span className="ml-4">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover bg-muted"
            src={profile?.avatar_url || `https://i.pravatar.cc/150?u=${profile?.id}`}
            alt={profile?.full_name || 'User'}
          />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.role || 'Role'}</p>
          </div>
          <button onClick={handleLogout} className="ml-auto flex-shrink-0 p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
