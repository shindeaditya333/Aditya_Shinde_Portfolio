import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/applications/my');
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div>Loading applications...</div>;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPLIED': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">Applied</span>;
      case 'SCREENING': return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">In Review</span>;
      case 'SHORTLISTED': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">Shortlisted</span>;
      case 'INTERVIEW': return <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">Interview</span>;
      case 'OFFER_EXTENDED': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Offer Extended</span>;
      case 'HIRED': return <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold">Hired</span>;
      case 'REJECTED': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">Rejected</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h2>
      
      {applications.length === 0 ? (
        <div className="bg-white p-10 rounded-lg text-center border border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-6">You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{app.job.title}</span>
                      <span className="text-sm text-gray-500">{app.job.department} &middot; {app.job.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/jobs/${app.job._id}`} className="text-indigo-600 hover:text-indigo-900">
                      View Job
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CandidateApplications;
