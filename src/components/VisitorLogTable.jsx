import React from 'react';

const VisitorLogTable = ({ visitors = [] }) => {

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked In':
        return 'bg-green-500/20 text-green-400';
      case 'Checked Out':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };
  
  const formatTime = (time) => {
    if (!time) return 'N/A';
    return new Date(time).toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-muted-foreground">
        <thead className="text-xs uppercase bg-muted/50">
          <tr>
            <th scope="col" className="px-6 py-3">Visitor Name</th>
            <th scope="col" className="px-6 py-3">Student Visited</th>
            <th scope="col" className="px-6 py-3">In-Time</th>
            <th scope="col" className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {visitors.length > 0 ? visitors.map((visitor) => (
            <tr key={visitor.id} className="border-b border-border hover:bg-muted">
              <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{visitor.name}</td>
              <td className="px-6 py-4">{visitor.student?.profile?.full_name || 'N/A'}</td>
              <td className="px-6 py-4">{formatTime(visitor.in_time)}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(visitor.out_time ? 'Checked Out' : 'Checked In')}`}>
                  {visitor.out_time ? 'Checked Out' : 'Checked In'}
                </span>
              </td>
            </tr>
          )) : (
            <tr>
                <td colSpan="4" className="text-center py-8">No recent visitors found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorLogTable;
