import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, Check, X, FileText, Eye } from 'lucide-react';

const CandidateOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOffer, setViewingOffer] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await api.get('/offers/my');
        setOffers(data);
      } catch (error) {
        console.error('Failed to fetch offers', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleStatusUpdate = async (offerId, status) => {
    try {
      const { data } = await api.patch(`/offers/${offerId}/status`, { status });
      setOffers(offers.map(o => o._id === offerId ? { ...o, status: data.status } : o));
      alert(`Offer ${status.toLowerCase()} successfully!`);
      setViewingOffer(null);
    } catch (error) {
      console.error(error);
      alert('Failed to update offer status.');
    }
  };

  const handleDownloadPDF = async (offerId) => {
    try {
      // Create a temporary link to trigger the browser download directly
      // By using window.open, it relies on the backend Content-Disposition header
      const token = localStorage.getItem('token');
      
      const response = await api.get(`/offers/${offerId}/pdf`, { responseType: 'blob' });
      
      // Get filename from Content-Disposition if available, or fallback
      let filename = `Offer_${offerId}.pdf`;
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '');
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to download PDF', error);
      alert('Failed to download PDF.');
    }
  };

  const getStatusDisplay = (status) => {
    if (status === 'EXTENDED') return 'OFFERED';
    return status;
  };

  if (loading) return <div>Loading offers...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Offers</h2>
      
      {offers.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-lg border border-gray-200 text-gray-500">
          No offers received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map(offer => (
            <div key={offer._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Job: {offer.job?.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Joining Date:</strong> {new Date(offer.joiningDate).toLocaleDateString()}</p>
                  <p><strong>Salary:</strong> ${offer.salary?.toLocaleString()} / year</p>
                </div>
                
                <div className="mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                    offer.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    Status: {getStatusDisplay(offer.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[250px]">
                <button 
                  onClick={() => setViewingOffer(offer)}
                  className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2.5 rounded-md hover:bg-gray-200 text-sm font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-4 h-4" /> VIEW OFFER
                </button>
                <button 
                  onClick={() => handleDownloadPDF(offer._id)}
                  className="bg-indigo-600 text-white px-4 py-2.5 rounded-md hover:bg-indigo-700 text-sm font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Download className="w-4 h-4" /> DOWNLOAD OFFER LETTER
                </button>
                
                {offer.status === 'EXTENDED' && (
                  <div className="flex gap-2 mt-2 pt-2 border-t">
                    <button 
                      onClick={() => handleStatusUpdate(offer._id, 'ACCEPTED')}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-1 transition"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(offer._id, 'REJECTED')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-1 transition"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offer View Modal */}
      {viewingOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                Offer Details: {viewingOffer.job?.title}
              </h3>
              <button 
                onClick={() => setViewingOffer(null)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-indigo-600">RecruitFlow</h1>
                <p className="text-sm text-gray-500">OFFER OF EMPLOYMENT</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Position</p>
                  <p className="font-bold text-gray-900 text-lg">{viewingOffer.job?.title}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Department</p>
                  <p className="font-bold text-gray-900">{viewingOffer.job?.department}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Annual Salary</p>
                  <p className="font-bold text-green-700 text-lg">${viewingOffer.salary?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Joining Date</p>
                  <p className="font-bold text-gray-900">{new Date(viewingOffer.joiningDate).toLocaleDateString()}</p>
                </div>
              </div>

              {viewingOffer.benefits && viewingOffer.benefits.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Included Benefits</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {viewingOffer.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 rounded-b-lg flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                viewingOffer.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                viewingOffer.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                Status: {getStatusDisplay(viewingOffer.status)}
              </span>

              {viewingOffer.status === 'EXTENDED' && (
                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => handleStatusUpdate(viewingOffer._id, 'ACCEPTED')}
                    className="flex-1 sm:flex-none bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium transition shadow-sm"
                  >
                    Accept Offer
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(viewingOffer._id, 'REJECTED')}
                    className="flex-1 sm:flex-none bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-medium transition shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateOffers;
