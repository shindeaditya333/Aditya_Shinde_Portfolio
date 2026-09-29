import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Video, Calendar as CalendarIcon, Clock, User, MessageSquare, Star, ChevronDown, ChevronUp } from 'lucide-react';

const ManageInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await api.get('/interviews');
        setInterviews(data);
      } catch (error) {
        console.error('Failed to fetch interviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) return <div>Loading interviews...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Scheduled Interviews</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate & Job</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviewer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                  No interviews found.
                </td>
              </tr>
            ) : (
              interviews.map(interview => (
                <>
                  <tr key={interview._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{interview.application?.candidate?.name}</div>
                      <div className="text-sm text-gray-500">{interview.application?.job?.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700">
                        <User className="w-4 h-4 mr-1 text-gray-400" />
                        {interview.interviewer?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(interview.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(interview.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        interview.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        interview.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {interview.score ? (
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-gray-900">{interview.score}/10</span>
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {interview.status === 'COMPLETED' && interview.feedback ? (
                        <button
                          onClick={() => setExpandedRow(expandedRow === interview._id ? null : interview._id)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                        >
                          {expandedRow === interview._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {expandedRow === interview._id ? 'Hide' : 'View'}
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                  {expandedRow === interview._id && interview.status === 'COMPLETED' && (
                    <tr key={`${interview._id}-feedback`}>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2 text-sm">
                          {interview.feedback && (
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Feedback Summary:</p>
                              <p className="text-gray-600 bg-white p-3 rounded border border-gray-200">{interview.feedback}</p>
                            </div>
                          )}
                          {interview.notes && (
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Private Notes:</p>
                              <p className="text-gray-600 bg-white p-3 rounded border border-gray-200">{interview.notes}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageInterviews;
