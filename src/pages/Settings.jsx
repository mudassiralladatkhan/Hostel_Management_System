import React from 'react';
import PageHeader from '../components/PageHeader';

const Settings = () => {
  return (
    <>
      <PageHeader title="Settings" subtitle="Configure system settings and manage your profile." />

      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="bg-card rounded-lg shadow-md">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Profile Settings</h3>
            <p className="text-sm text-muted-foreground">Update your personal information and password.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Admin Name</label>
              <input type="text" defaultValue="Admin" className="w-full max-w-sm bg-input border border-border rounded-md px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
              <input type="email" defaultValue="warden@hms.com" className="w-full max-w-sm bg-input border border-border rounded-md px-3 py-2 text-foreground" />
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Update Profile</button>
          </div>
        </div>

        {/* System Configuration */}
        <div className="bg-card rounded-lg shadow-md">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">System Configuration</h3>
            <p className="text-sm text-muted-foreground">General settings for the application.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Hostel Name</label>
              <input type="text" defaultValue="Dualite Alpha Hostel" className="w-full max-w-sm bg-input border border-border rounded-md px-3 py-2 text-foreground" />
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Save Configuration</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
