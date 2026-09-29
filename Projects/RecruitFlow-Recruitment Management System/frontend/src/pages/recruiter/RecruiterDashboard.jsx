import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, Users, FileText, CheckCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, applications: 0, interviews: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [jobRes, intRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/interviews')
        ]);
        
        setStats({
          jobs: jobRes.data.length,
          applications: 0, // Mock, needs a specific endpoint or aggregate
          interviews: intRes.data.length
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recruiter Dashboard</h2>
        <Link to="/recruiter/jobs/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Post New Job
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mr-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.jobs}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 mr-4">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Candidates</p>
            <p className="text-3xl font-bold text-gray-900">24</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-purple-100 p-4 rounded-full text-purple-600 mr-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Interviews Scheduled</p>
            <p className="text-3xl font-bold text-gray-900">{stats.interviews}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/recruiter/jobs" className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition text-center group">
            <Briefcase className="w-8 h-8 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-800">Manage Jobs</span>
          </Link>
          <Link to="/recruiter/interviews" className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition text-center group">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-800">Interviews</span>
          </Link>
          <Link to="/recruiter/assistant" className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition text-center group">
            <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-800">AI Screening</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
