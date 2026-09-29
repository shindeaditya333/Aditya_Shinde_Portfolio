import { useState, useEffect } from 'react';
import api from '../../services/api';
import { User } from 'lucide-react';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await api.get('/users');
        setCandidates(data.filter(u => u.role === 'CANDIDATE'));
      } catch (error) {
        console.error('Failed to fetch candidates', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Candidates</h2>
        <p className="text-gray-500">View all registered candidates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                <p className="text-sm text-gray-500">{candidate.email}</p>
                <div className="mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Joined: {new Date(candidate.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        {candidates.length === 0 && (
          <div className="col-span-full text-center p-10 bg-white border border-gray-200 rounded-lg text-gray-500">
            No candidates registered yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
