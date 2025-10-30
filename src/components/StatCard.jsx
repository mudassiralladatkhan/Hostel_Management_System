import React from 'react';

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className="p-3 bg-muted rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
