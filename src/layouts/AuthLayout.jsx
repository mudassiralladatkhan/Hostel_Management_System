import React from 'react';
import { Outlet } from 'react-router-dom';
import { Building } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-3">
        <Building className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Hostel Management System</h1>
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
