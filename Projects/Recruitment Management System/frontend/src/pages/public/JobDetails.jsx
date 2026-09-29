import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Building, ArrowLeft, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal & Application state
  const [showModal, setShowModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({ name: '', email: '', contactNumber: '' });
  const [resumeFile, setResumeFile] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error('Failed to fetch job', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleOpenModal = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      contactNumber: ''
    });
    setResumeFile(null);
    setApplyMsg({ text: '', type: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setApplyMsg({ text: 'Please upload a resume (PDF/DOC/DOCX).', type: 'error' });
      return;
    }
    
    setApplying(true);
    setApplyMsg({ text: '', type: '' });
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('contactNumber', formData.contactNumber);
    data.append('resume', resumeFile);

    try {
      await api.post(`/applications/${id}/apply`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setApplyMsg({ text: 'Application submitted successfully!', type: 'success' });
      setShowModal(false);
    } catch (error) {
      setApplyMsg({ text: error.response?.data?.message || 'Failed to apply.', type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!job) return <div className="text-center py-20 text-red-500">Job not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/jobs" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
        </Link>

        {applyMsg.text && !showModal && (
          <div className={`mb-6 p-4 rounded-lg ${applyMsg.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {applyMsg.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <span className="bg-indigo-50 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                  {job.department}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
                
                <div className="flex flex-wrap gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{job.location} ({job.workMode})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span className="capitalize">{job.employmentType.replace('_', ' ').toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-gray-400" />
                    <span>{job.experienceLevel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {!user ? (
                  <Link to="/login" className="block w-full text-center bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
                    Login to Apply
                  </Link>
                ) : user.role === 'CANDIDATE' ? (
                  <button 
                    onClick={handleOpenModal}
                    className="block w-full text-center bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose max-w-none text-gray-700">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About the Role</h3>
              <div className="whitespace-pre-line mb-8">{job.description}</div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h3>
              <div className="whitespace-pre-line mb-8">{job.responsibilities}</div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
              <ul className="list-disc pl-5 mb-8 space-y-2">
                {job.requiredSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>

              {job.preferredSkills && job.preferredSkills.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Preferred Skills</h3>
                  <ul className="list-disc pl-5 mb-8 space-y-2">
                    {job.preferredSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Apply for {job.title}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {applyMsg.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${applyMsg.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {applyMsg.text}
                </div>
              )}
              
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF, DOC, DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm disabled:opacity-70"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
