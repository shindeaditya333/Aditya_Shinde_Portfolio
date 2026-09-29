import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Briefcase, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, jobsRes] = await Promise.all([
          api.get('/users'),
          api.get('/jobs')
        ]);
        
        const activeJobsCount = jobsRes.data.filter(job => job.status === 'OPEN').length;
        
        setStats({
          users: usersRes.data.length,
          jobs: activeJobsCount // or jobsRes.data.length if all jobs
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mr-4">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 mr-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.jobs}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-green-100 p-4 rounded-full text-green-600 mr-4">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">System Status</p>
            <p className="text-xl font-bold text-green-600">Healthy</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/users" className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition text-center group">
            <Users className="w-8 h-8 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-800">Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
