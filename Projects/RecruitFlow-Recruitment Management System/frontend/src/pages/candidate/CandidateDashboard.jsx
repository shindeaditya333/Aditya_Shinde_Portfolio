import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
  const [stats, setStats] = useState({ applications: 0, interviews: 0, offers: 0 });
  const [loading, setLoading] = useState(true);
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [appRes, intRes, offRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/interviews/my'),
          api.get('/offers/my')
        ]);
        
        setStats({
          applications: appRes.data.length,
          interviews: intRes.data.length,
          offers: offRes.data.length
        });
        
        setRecentApps(appRes.data.slice(0, 3));
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Candidate Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mr-4">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{stats.applications}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 mr-4">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Upcoming Interviews</p>
            <p className="text-3xl font-bold text-gray-900">{stats.interviews}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-green-100 p-4 rounded-full text-green-600 mr-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Offers Received</p>
            <p className="text-3xl font-bold text-gray-900">{stats.offers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Recent Applications</h3>
          <Link to="/candidate/applications" className="text-indigo-600 text-sm font-medium hover:underline">View All</Link>
        </div>
        
        <div className="space-y-4">
          {recentApps.length === 0 ? (
            <p className="text-gray-500">No applications yet.</p>
          ) : (
            recentApps.map(app => {
              const isOffered = app.status === 'OFFERED';
              const Container = isOffered ? Link : 'div';
              const containerProps = isOffered ? { to: '/candidate/offers' } : {};
              
              return (
                <Container 
                  key={app._id} 
                  {...containerProps}
                  className={`flex justify-between items-center p-4 border border-gray-100 rounded-lg ${isOffered ? 'hover:bg-indigo-50 cursor-pointer transition-colors' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-md text-gray-500">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{app.job.title}</h4>
                      <p className="text-sm text-gray-500">{app.job.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {app.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                </Container>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
