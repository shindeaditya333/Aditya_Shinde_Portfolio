import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';

const CandidateProfile = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/candidates/profile');
        reset(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setMessage('');
    try {
      // transform skills back to array if edited as string
      if (typeof data.skills === 'string') {
        data.skills = data.skills.split(',').map(s => s.trim());
      }
      await api.put('/candidates/profile', data);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
      {message && <div className="mb-4 p-3 bg-indigo-50 text-indigo-700 rounded-md">{message}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input {...register('phone')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input {...register('location')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
          <input {...register('headline')} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. Senior Software Engineer" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
          <textarea {...register('summary')} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
          <input {...register('skills')} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="React, Node.js, MongoDB" />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input {...register('socialLinks.linkedin')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
              <input {...register('socialLinks.github')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
              <input {...register('socialLinks.portfolio')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};
export default CandidateProfile;
