import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, FileText, CheckCircle, XCircle, Brain, Calendar, MessageSquare, Star } from 'lucide-react';

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Interview Form State
  const [interviewers, setInterviewers] = useState([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewData, setInterviewData] = useState({ interviewer: '', date: '' });

  // Offer Form State
  const [offerForm, setOfferForm] = useState(null);
  const [offerData, setOfferData] = useState({ salary: '', benefits: '', joiningDate: '' });

  // AI Report Modal State
  const [selectedAiReport, setSelectedAiReport] = useState(null);

  // Interview Feedback Modal State
  const [feedbackModal, setFeedbackModal] = useState(null); // holds { appId, interviews: [] }

  useEffect(() => {
    if (selectedAiReport) {
      // Use setTimeout to ensure the modal has been rendered in the DOM before we attempt to scroll it.
      setTimeout(() => {
        const modal = document.getElementById('ai-report-modal');
        if (modal) modal.scrollTop = 0;
      }, 10);
    }
  }, [selectedAiReport]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, jobRes, userRes] = await Promise.all([
          api.get(`/applications/job/${jobId}`),
          api.get(`/jobs/${jobId}`),
          api.get('/users')
        ]);
        setApplications(appRes.data.filter(app => app.candidate));
        setJob(jobRes.data);
        setInterviewers(userRes.data.filter(u => u.role === 'INTERVIEWER'));
      } catch (error) {
        console.error('Failed to fetch', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const refreshApplications = async () => {
    try {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplications(data.filter(app => app.candidate));
    } catch (error) {
      console.error('Failed to refresh applications', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/applications/${id}/status`, { status });
      setApplications(applications.map(app => app._id === id ? data : app));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnalyze = async (id) => {
    try {
      setApplications(applications.map(app => 
        app._id === id ? { ...app, aiStatus: 'ANALYZING' } : app
      ));
      
      const { data } = await api.post(`/applications/${id}/analyze`);
      setApplications(applications.map(app => app._id === id ? data : app));
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'AI analysis failed. Please try again.';
      alert(`Error: ${errorMessage}`);
      setApplications(applications.map(app => 
        app._id === id ? { ...app, aiStatus: 'FAILED', aiError: errorMessage } : app
      ));
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/interviews', {
        application: selectedApp._id,
        candidate: selectedApp.candidate._id,
        interviewer: interviewData.interviewer,
        date: interviewData.date
      });
      alert("Interview scheduled successfully!");
      setShowInterviewModal(false);
      setSelectedApp(null);
      setInterviewData({ interviewer: '', date: '' });
      refreshApplications();
    } catch (error) {
      console.error(error);
      alert("Failed to schedule interview");
    }
  };

  const handleViewFeedback = async (app) => {
    try {
      const { data } = await api.get(`/interviews/application/${app._id}`);
      setFeedbackModal({ app, interviews: data });
    } catch (error) {
      console.error(error);
      alert('Failed to load interview feedback');
    }
  };

  const handleRecruiterDecision = async (appId, decision) => {
    try {
      await updateStatus(appId, decision);
      setFeedbackModal(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateOffer = async (appId, candidateId) => {
    try {
      await api.post('/offers', {
        application: appId,
        candidate: candidateId,
        job: jobId,
        salary: Number(offerData.salary),
        benefits: offerData.benefits,
        joiningDate: offerData.joiningDate
      });
      alert('Offer extended successfully!');
      setOfferForm(null);
      setOfferData({ salary: '', benefits: '', joiningDate: '' });
      refreshApplications();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to generate offer');
    }
  };

  const getRecommendationColor = (rec) => {
    switch(rec) {
      case 'SHORTLIST': return 'text-green-600 bg-green-50 border-green-200';
      case 'STRONG_MATCH': return 'text-green-600 bg-green-50 border-green-200';
      case 'GOOD_MATCH': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'CONSIDER': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'POTENTIAL_MATCH': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'WEAK_MATCH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'REJECT': return 'text-red-600 bg-red-50 border-red-200';
      case 'NOT_RECOMMENDED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'APPLIED': return 'Applied';
      case 'SCREENING': return 'Screening';
      case 'SHORTLISTED': return 'Shortlisted';
      case 'INTERVIEW': return 'Interview';
      case 'SELECTED': return 'Selected';
      case 'ON_HOLD': return 'On Hold';
      case 'OFFERED': return 'Offered';
      case 'OFFER_EXTENDED': return 'Offered';
      case 'HIRED': return 'Hired';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'APPLIED': return 'bg-gray-100 text-gray-800';
      case 'SCREENING': return 'bg-blue-100 text-blue-800';
      case 'SHORTLISTED': return 'bg-indigo-100 text-indigo-800';
      case 'INTERVIEW': return 'bg-purple-100 text-purple-800';
      case 'SELECTED': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'OFFERED': return 'bg-emerald-100 text-emerald-800';
      case 'OFFER_EXTENDED': return 'bg-emerald-100 text-emerald-800';
      case 'HIRED': return 'bg-green-200 text-green-900';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <Link to="/recruiter/jobs" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Applications: {job?.title}</h2>
        <p className="text-gray-500">{applications.length} candidates applied</p>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-lg border border-gray-200 text-gray-500">
            No applications received yet.
          </div>
        ) : (
          applications.map(app => (
            <div key={app._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {/* Header: Candidate name + Status badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{app.candidate?.name}</h3>
                      <p className="text-sm text-gray-500">{app.candidate?.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(app.status)}`}>
                    {getStatusLabel(app.status)}
                  </span>
                </div>

                {/* Resume link */}
                {app.resume && (
                  <a 
                    href={`http://localhost:5000/${app.resume.filePath}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm text-indigo-600 mb-4 cursor-pointer hover:underline w-fit"
                  >
                    <FileText className="w-4 h-4" /> View Resume Document
                  </a>
                )}
                
                {/* AI Screening Section */}
                {app.aiStatus === 'ANALYZED' ? (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-600" /> AI Screening Complete
                      </h4>
                      {app.aiScore !== undefined && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getRecommendationColor(app.aiRecommendation)}`}>
                          {app.aiScore}/100 - {(app.aiRecommendation || '').replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedAiReport(app)}
                      className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 text-sm font-medium transition"
                    >
                      VIEW AI REPORT
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-center justify-between mb-4">
                    <p className={`text-sm italic ${app.aiStatus === 'FAILED' ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                      {app.aiStatus === 'ANALYZING' ? 'AI Analysis in progress...' : 
                       app.aiStatus === 'FAILED' ? (app.aiError || 'AI Analysis failed. Please try again.') :
                       'AI Analysis not started.'}
                    </p>
                    <button
                      onClick={() => handleAnalyze(app._id)}
                      disabled={app.aiStatus === 'ANALYZING'}
                      className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm font-medium transition"
                    >
                      <Brain className="w-4 h-4" />
                      {app.aiStatus === 'ANALYZING' ? 'Analyzing...' : app.aiStatus === 'FAILED' ? 'Retry Analysis' : 'Analyze Resume'}
                    </button>
                  </div>
                )}

                {/* ============ POST-INTERVIEW WORKFLOW ============ */}

                {/* SHORTLISTED: Schedule Interview */}
                {app.status === 'SHORTLISTED' && (
                  <div className="mt-2 flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedApp(app);
                        setShowInterviewModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Interview
                    </button>
                  </div>
                )}

                {/* INTERVIEW: Show "View Interview Feedback" button (recruiter reviews before deciding) */}
                {app.status === 'INTERVIEW' && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <button 
                      onClick={() => {
                        setSelectedApp(app);
                        setShowInterviewModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Another Interview
                    </button>
                    <button 
                      onClick={() => handleViewFeedback(app)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm font-medium flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      View Interview Feedback
                    </button>
                  </div>
                )}

                {/* SELECTED: Show "Extend Offer" */}
                {app.status === 'SELECTED' && (
                  <div className="mt-2">
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-semibold text-sm">Candidate Selected — Ready for Offer</span>
                    </div>
                    <button 
                      onClick={() => setOfferForm(app._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Extend Offer
                    </button>
                  </div>
                )}

                {/* ON_HOLD */}
                {app.status === 'ON_HOLD' && (
                  <div className="mt-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-center gap-2">
                      <span className="text-yellow-800 font-semibold text-sm">⏸ On Hold — Recruiter decision pending</span>
                    </div>
                  </div>
                )}

                {/* OFFERED / OFFER_EXTENDED */}
                {(app.status === 'OFFERED' || app.status === 'OFFER_EXTENDED') && (
                  <div className="mt-2">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-800 font-semibold text-sm">Offered — Waiting for candidate response</span>
                    </div>
                  </div>
                )}

                {/* REJECTED */}
                {app.status === 'REJECTED' && (
                  <div className="mt-2">
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 font-semibold text-sm">Rejected</span>
                    </div>
                  </div>
                )}

                {/* HIRED */}
                {app.status === 'HIRED' && (
                  <div className="mt-2">
                    <div className="bg-green-100 border border-green-300 rounded-md p-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-700" />
                      <span className="text-green-900 font-semibold text-sm">Hired ✓</span>
                    </div>
                  </div>
                )}

                {/* Offer Form (inline, only for SELECTED) */}
                {offerForm === app._id && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h4 className="font-bold mb-2 text-gray-800">Offer Details</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Salary (Annual)</label>
                        <input type="number" className="w-full border rounded p-2 text-sm" value={offerData.salary} onChange={e => setOfferData({...offerData, salary: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Joining Date</label>
                        <input type="date" className="w-full border rounded p-2 text-sm" value={offerData.joiningDate} onChange={e => setOfferData({...offerData, joiningDate: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Benefits (comma separated)</label>
                        <input type="text" placeholder="Health Insurance, 401k..." className="w-full border rounded p-2 text-sm" value={offerData.benefits} onChange={e => setOfferData({...offerData, benefits: e.target.value})} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleGenerateOffer(app._id, app.candidate._id)} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">Submit Offer</button>
                      <button onClick={() => setOfferForm(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========== Schedule Interview Modal ========== */}
      {showInterviewModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Schedule Interview</h3>
            <p className="text-sm text-gray-500 mb-4">
              Candidate: <strong>{selectedApp.candidate?.name}</strong>
            </p>
            <form onSubmit={handleScheduleInterview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign Interviewer</label>
                  <select 
                    required
                    className="w-full border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={interviewData.interviewer}
                    onChange={e => setInterviewData({...interviewData, interviewer: e.target.value})}
                  >
                    <option value="">Select Interviewer</option>
                    {interviewers.map(int => (
                      <option key={int._id} value={int._id}>{int.name} ({int.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={interviewData.date}
                    onChange={e => setInterviewData({...interviewData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== Interview Feedback + Recruiter Decision Modal ========== */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-600" /> 
                Interview Feedback: {feedbackModal.app.candidate?.name}
              </h3>
              <button 
                onClick={() => setFeedbackModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {feedbackModal.interviews.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-md border border-gray-200 text-center text-gray-500 mb-6">
                No interview feedback submitted yet. The interviewer has not completed the evaluation.
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {feedbackModal.interviews.map((interview) => (
                  <div key={interview._id} className={`p-4 rounded-md border ${
                    interview.status === 'COMPLETED' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{interview.type || 'TECHNICAL'} Interview</p>
                        <p className="text-sm text-gray-500">
                          Interviewer: {interview.interviewer?.name} ({interview.interviewer?.email})
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(interview.date).toLocaleDateString()} at {new Date(interview.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        interview.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        interview.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {interview.status}
                      </span>
                    </div>

                    {interview.status === 'COMPLETED' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-gray-900 text-lg">{interview.score}/10</span>
                          <span className="text-sm text-gray-500">
                            ({interview.score >= 8 ? 'Excellent' : interview.score >= 6 ? 'Good' : interview.score >= 4 ? 'Average' : 'Below Average'})
                          </span>
                        </div>
                        {interview.feedback && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Feedback:</p>
                            <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">{interview.feedback}</p>
                          </div>
                        )}
                        {interview.notes && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Notes for Recruiter:</p>
                            <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">{interview.notes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {interview.status === 'SCHEDULED' && (
                      <p className="text-sm italic text-gray-500">Awaiting interviewer feedback...</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Recruiter Decision Buttons */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Recruiter Decision</h4>
              <p className="text-sm text-gray-500 mb-4">Based on the interview feedback above, make your decision:</p>
              <div className="flex gap-3 flex-wrap">
                <button 
                  onClick={() => handleRecruiterDecision(feedbackModal.app._id, 'SELECTED')}
                  className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  SELECT
                </button>
                <button 
                  onClick={() => handleRecruiterDecision(feedbackModal.app._id, 'ON_HOLD')}
                  className="bg-yellow-600 text-white px-5 py-2 rounded-md hover:bg-yellow-700 font-medium"
                >
                  HOLD
                </button>
                <button 
                  onClick={() => handleRecruiterDecision(feedbackModal.app._id, 'REJECTED')}
                  className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 font-medium flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  REJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== AI Report Modal ========== */}
      {selectedAiReport && (
        <div id="ai-report-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" /> 
                AI Screening Report: {selectedAiReport.candidate?.name}
              </h3>
              <button 
                onClick={() => setSelectedAiReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-bold px-3 py-1.5 rounded-full border ${getRecommendationColor(selectedAiReport.aiRecommendation)}`}>
                  Score: {selectedAiReport.aiScore}/100 - {(selectedAiReport.aiRecommendation || '').replace('_', ' ')}
                </span>
              </div>
              
              {selectedAiReport.aiAnalysis && (
                <div className="text-sm text-gray-700 space-y-5">
                  {selectedAiReport.aiAnalysis.matchSummary && (
                    <div>
                      <strong className="text-gray-900 text-base block mb-1">Summary</strong>
                      <p className="bg-white p-3 rounded border border-gray-200">{selectedAiReport.aiAnalysis.matchSummary}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAiReport.aiAnalysis.matchingSkills && selectedAiReport.aiAnalysis.matchingSkills.length > 0 && (
                      <div className="bg-green-50 p-3 rounded border border-green-100">
                        <strong className="text-green-800 block mb-2">Matching Skills</strong>
                        <ul className="list-disc pl-5">
                          {selectedAiReport.aiAnalysis.matchingSkills.map((s, i) => <li key={i} className="text-green-700">{s}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    {selectedAiReport.aiAnalysis.missingSkills && selectedAiReport.aiAnalysis.missingSkills.length > 0 && (
                      <div className="bg-red-50 p-3 rounded border border-red-100">
                        <strong className="text-red-800 block mb-2">Missing Skills</strong>
                        <ul className="list-disc pl-5">
                          {selectedAiReport.aiAnalysis.missingSkills.map((s, i) => <li key={i} className="text-red-700">{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAiReport.aiAnalysis.strengths && selectedAiReport.aiAnalysis.strengths.length > 0 && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <strong className="text-gray-900 flex items-center gap-1 mb-2"><CheckCircle className="w-4 h-4 text-green-500"/> Strengths</strong>
                        <ul className="list-disc pl-5">
                          {selectedAiReport.aiAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {selectedAiReport.aiAnalysis.weaknesses && selectedAiReport.aiAnalysis.weaknesses.length > 0 && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <strong className="text-gray-900 flex items-center gap-1 mb-2"><XCircle className="w-4 h-4 text-red-500"/> Weaknesses</strong>
                        <ul className="list-disc pl-5">
                          {selectedAiReport.aiAnalysis.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedAiReport.aiAnalysis.experienceMatch && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <strong className="text-gray-900 block mb-1">Experience Match</strong>
                        <p>{selectedAiReport.aiAnalysis.experienceMatch}</p>
                      </div>
                    )}
                    {selectedAiReport.aiAnalysis.educationMatch && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <strong className="text-gray-900 block mb-1">Education Match</strong>
                        <p>{selectedAiReport.aiAnalysis.educationMatch}</p>
                      </div>
                    )}
                    {selectedAiReport.aiAnalysis.technicalSkillsMatch && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <strong className="text-gray-900 block mb-1">Technical Skills</strong>
                        <p>{selectedAiReport.aiAnalysis.technicalSkillsMatch}</p>
                      </div>
                    )}
                  </div>

                  {selectedAiReport.aiAnalysis.relevantProjects && (
                    <div>
                      <strong className="text-gray-900 block mb-1">Relevant Projects</strong>
                      <p className="bg-white p-3 rounded border border-gray-200">{selectedAiReport.aiAnalysis.relevantProjects}</p>
                    </div>
                  )}

                  {selectedAiReport.aiAnalysis.reasoning && (
                    <div>
                      <strong className="text-gray-900 text-base block mb-1">Final Reasoning</strong>
                      <p className="bg-white p-3 rounded border border-gray-200">{selectedAiReport.aiAnalysis.reasoning}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-between border-t pt-4">
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    updateStatus(selectedAiReport._id, 'SHORTLISTED');
                    setSelectedAiReport(null);
                  }}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 font-medium"
                >
                  SHORTLIST FOR INTERVIEW
                </button>
                <button 
                  onClick={() => {
                    updateStatus(selectedAiReport._id, 'ON_HOLD');
                    setSelectedAiReport(null);
                  }}
                  className="bg-yellow-600 text-white px-5 py-2 rounded-md hover:bg-yellow-700 font-medium"
                >
                  HOLD
                </button>
                <button 
                  onClick={() => {
                    updateStatus(selectedAiReport._id, 'REJECTED');
                    setSelectedAiReport(null);
                  }}
                  className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 font-medium"
                >
                  REJECT
                </button>
              </div>
              <button
                onClick={() => {
                  handleAnalyze(selectedAiReport._id);
                  setSelectedAiReport(null);
                }}
                className="text-gray-600 hover:text-indigo-600 font-medium underline px-4 py-2"
              >
                Re-analyze Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
