import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, Bot } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-12 py-10">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Welcome to <span className="text-indigo-600">RecruitFlow</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          The next-generation AI-powered recruitment platform. Streamline your hiring process, discover top talent, and empower candidates with an intuitive, seamless experience.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <Link to="/register" className="px-8 py-3 w-full sm:w-auto bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            Get Started
          </Link>
          <Link to="/login" className="px-8 py-3 w-full sm:w-auto bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-bold text-lg hover:bg-indigo-50 transition-colors">
            Login
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-5xl mt-16">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-900">AI Screening</h3>
          <p className="text-sm text-gray-500">Automated resume parsing and Gemini AI scoring.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-900">Job Board</h3>
          <p className="text-sm text-gray-500">Browse and manage open positions effortlessly.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-900">Interviews</h3>
          <p className="text-sm text-gray-500">Schedule, conduct, and score interviews seamlessly.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 p-4 rounded-full text-purple-600">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-900">Smart Offers</h3>
          <p className="text-sm text-gray-500">Generate and download dynamic PDF offer letters.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
