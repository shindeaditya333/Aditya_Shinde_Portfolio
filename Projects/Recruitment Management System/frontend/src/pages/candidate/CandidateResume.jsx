import { useState, useEffect } from 'react';
import api from '../../services/api';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

const CandidateResume = () => {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/candidates/profile');
        if (data.resume) {
          setResume(data.resume);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setMessage('');
    
    try {
      const { data } = await api.post('/candidates/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResume(data);
      setMessage('Resume uploaded successfully!');
      setFile(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Resume</h2>
      
      {resume && (
        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{resume.fileName}</h3>
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(resume.updatedAt).toLocaleDateString()} &middot; {(resume.fileSize / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center text-green-600 text-sm font-medium gap-1">
            <CheckCircle className="w-4 h-4" />
            Active
          </div>
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
          <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your resume here, or <label className="text-indigo-600 cursor-pointer font-medium">browse<input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} /></label>
          </p>
          <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
          {file && (
            <div className="mt-4 p-2 bg-indigo-50 text-indigo-700 text-sm rounded-md w-full max-w-xs truncate">
              Selected: {file.name}
            </div>
          )}
        </div>
        
        {message && <div className={`p-3 rounded-md text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}
        
        <button 
          type="submit" 
          disabled={!file || uploading} 
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-400"
        >
          {uploading ? 'Uploading...' : resume ? 'Replace Resume' : 'Upload Resume'}
        </button>
      </form>
    </div>
  );
};
export default CandidateResume;
