import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Video, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';

const InterviewerDashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedback, setFeedback] = useState({ score: 5, notes: '', feedback: '' });

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await api.get('/interviews/my');
        setInterviews(data);
      } catch (error) {
        console.error('Failed to fetch interviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/interviews/${selectedInterview._id}/feedback`, feedback);
      setInterviews(interviews.map(inv => inv._id === selectedInterview._id ? data : inv));
      setSelectedInterview(null);
      setFeedback({ score: 5, notes: '', feedback: '' });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading interviews...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Scheduled Interviews</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {interviews.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-lg border border-gray-200 text-gray-500">
              No interviews scheduled.
            </div>
          ) : (
            interviews.map(interview => (
              <div key={interview._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{interview.application?.candidate?.name}</h3>
                    <p className="text-sm text-gray-500">{interview.application?.job?.title} &middot; {interview.type} Interview</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    interview.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    interview.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {interview.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(interview.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(interview.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  {interview.meetingLink && (
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Video className="w-4 h-4" />
                      <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="hover:underline">Join Meeting</a>
                    </div>
                  )}
                </div>

                {interview.status === 'SCHEDULED' && (
                  <button 
                    onClick={() => setSelectedInterview(interview)}
                    className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md font-medium hover:bg-indigo-100 transition"
                  >
                    Submit Feedback
                  </button>
                )}

                {interview.status === 'COMPLETED' && (
                  <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
                    <p><strong>Score:</strong> {interview.score}/10</p>
                    <p><strong>Feedback:</strong> {interview.feedback}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Feedback Panel */}
        {selectedInterview && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Feedback</h3>
            <p className="text-sm text-gray-500 mb-4">For {selectedInterview.application?.candidate?.name}</p>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score (1-10)</label>
                <input 
                  type="number" 
                  min="1" max="10" 
                  value={feedback.score} 
                  onChange={(e) => setFeedback({...feedback, score: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Summary</label>
                <textarea 
                  rows="3" 
                  value={feedback.feedback} 
                  onChange={(e) => setFeedback({...feedback, feedback: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="General assessment..."
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Private Notes</label>
                <textarea 
                  rows="2" 
                  value={feedback.notes} 
                  onChange={(e) => setFeedback({...feedback, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Notes for recruiter..."
                ></textarea>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                  Submit
                </button>
                <button type="button" onClick={() => setSelectedInterview(null)} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewerDashboard;
