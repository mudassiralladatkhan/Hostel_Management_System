import React, { useState, useEffect } from 'react';
import { Users, BedDouble, Bed } from 'lucide-react';
import StatCard from '../components/StatCard';
import RoomOccupancyChart from '../components/RoomOccupancyChart';
import FeeStatusChart from '../components/FeeStatusChart';
import VisitorLogTable from '../components/VisitorLogTable';
import SkeletonLoader from '../components/SkeletonLoader';
import { getDashboardStats, getRoomOccupancyByBlock, getRecentVisitors } from '../lib/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [roomOccupancy, setRoomOccupancy] = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const [statsData, roomData, visitorData] = await Promise.all([
          getDashboardStats(),
          getRoomOccupancyByBlock(),
          getRecentVisitors(),
        ]);
        setStats(statsData);
        setRoomOccupancy(roomData);
        setVisitors(visitorData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error('Failed to load dashboard data.');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = stats ? [
    { title: "Total Students", value: stats.studentsCount, icon: <Users className="h-8 w-8 text-primary" /> },
    { title: "Total Rooms", value: stats.roomsCount, icon: <BedDouble className="h-8 w-8 text-primary" /> },
    { title: "Occupied Rooms", value: stats.occupiedRoomsCount, icon: <Bed className="h-8 w-8 text-primary" /> },
    { title: "Available Rooms", value: stats.availableRoomsCount, icon: <Bed className="h-8 w-8 text-green-500" /> },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-28" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
          <SkeletonLoader className="lg:col-span-3 h-[360px]" />
          <SkeletonLoader className="lg:col-span-2 h-[360px]" />
        </div>
        <SkeletonLoader className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-card p-8 rounded-lg">
            <h3 className="text-xl font-semibold text-destructive">Failed to Load Dashboard</h3>
            <p className="text-muted-foreground mt-2">There was an error fetching the required data. Please try again later.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3 bg-card p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Room Occupancy by Block</h3>
          <RoomOccupancyChart data={roomOccupancy} />
        </div>
        <div className="lg:col-span-2 bg-card p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Fee Status</h3>
          <FeeStatusChart data={stats?.feeStatus} />
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Visitor Logs</h3>
        <VisitorLogTable visitors={visitors} />
      </div>
    </div>
  );
};

export default Dashboard;
