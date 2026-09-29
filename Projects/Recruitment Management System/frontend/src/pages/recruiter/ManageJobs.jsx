import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, MoreVertical, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`);
        setJobs(jobs.filter(job => job._id !== id));
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/jobs/${id}/status`, { status });
      setJobs(jobs.map(job => job._id === id ? data : job));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Jobs</h2>
        <Link to="/recruiter/jobs/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Job
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.location} &middot; {job.workMode}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    value={job.status} 
                    onChange={(e) => updateStatus(job._id, e.target.value)}
                    className={`text-xs font-semibold rounded-full px-3 py-1 outline-none appearance-none cursor-pointer ${
                      job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                      job.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <Link to={`/recruiter/jobs/${job._id}/applications`} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded">
                      <Briefcase className="w-4 h-4" /> Apps
                    </Link>
                    <Link to={`/recruiter/jobs/edit/${job._id}`} className="text-gray-600 hover:text-gray-900">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteJob(job._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                  No jobs found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageJobs;
