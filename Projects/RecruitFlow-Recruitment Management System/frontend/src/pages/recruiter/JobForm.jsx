import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const JobForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const { data } = await api.get(`/jobs/${id}`);
          // format arrays to strings for form
          data.requiredSkills = data.requiredSkills.join(', ');
          data.preferredSkills = data.preferredSkills.join(', ');
          reset(data);
        } catch (error) {
          setError('Failed to fetch job details');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditMode, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setError('');
    try {
      if (isEditMode) {
        await api.put(`/jobs/${id}`, data);
      } else {
        await api.post('/jobs', data);
      }
      navigate('/recruiter/jobs');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? 'Edit Job' : 'Create Job'}</h2>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <input {...register('title', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
            <input {...register('department', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea {...register('description', { required: true })} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities *</label>
          <textarea {...register('responsibilities', { required: true })} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated) *</label>
            <input {...register('requiredSkills', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="React, Node.js" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Skills (comma separated)</label>
            <input {...register('preferredSkills')} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="AWS, Docker" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level *</label>
            <select {...register('experienceLevel', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Director">Director</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input {...register('location', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
            <select {...register('workMode')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="ONSITE">On-site</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <select {...register('employmentType')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select {...register('status')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="DRAFT">Draft</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vacancies</label>
            <input type="number" {...register('vacancies')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
            {saving ? 'Saving...' : 'Save Job'}
          </button>
          <button type="button" onClick={() => navigate('/recruiter/jobs')} className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default JobForm;
