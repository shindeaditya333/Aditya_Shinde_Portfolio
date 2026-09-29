import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Building } from 'lucide-react';
import api from '../../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="bg-indigo-700 rounded-2xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-4">Find Your Next Opportunity</h1>
            <p className="text-indigo-100 mb-8 max-w-2xl text-lg">
              Explore open roles and discover where you can make an impact. We're looking for passionate people to join our team.
            </p>
            <div className="bg-white p-2 rounded-lg flex shadow-md max-w-3xl">
              <div className="flex-1 flex items-center px-4 border-r border-gray-200">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Job title or department..." 
                  className="w-full px-4 py-2 outline-none text-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-800 transition">
                Search
              </button>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
          <div className="absolute bottom-0 right-32 w-48 h-48 bg-indigo-400 opacity-20 rounded-full translate-y-1/3 blur-xl"></div>
        </div>

        {/* Job Listings */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{filteredJobs.length} Open Positions</h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading jobs...</div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <Link 
                  to={`/jobs/${job._id}`} 
                  key={job._id}
                  className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow hover:border-indigo-200 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {job.department}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {job.location} ({job.workMode})
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          {job.employmentType.replace('_', ' ')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4 text-gray-400" />
                          {job.experienceLevel}
                        </div>
                      </div>
                    </div>
                    <div className="md:text-right flex flex-row md:flex-col items-center md:items-end justify-between">
                      <div className="text-indigo-600 font-medium group-hover:underline">View Details &rarr;</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
