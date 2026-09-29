import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';

import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import CandidateResume from './pages/candidate/CandidateResume';
import CandidateApplications from './pages/candidate/CandidateApplications';
import CandidateOffers from './pages/candidate/CandidateOffers';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import ManageJobs from './pages/recruiter/ManageJobs';
import JobForm from './pages/recruiter/JobForm';
import JobApplications from './pages/recruiter/JobApplications';
import Applications from './pages/recruiter/Applications';
import Candidates from './pages/recruiter/Candidates';
import ManageInterviews from './pages/recruiter/ManageInterviews';
import RecruiterAssistant from './pages/recruiter/RecruiterAssistant';
import JobList from './pages/public/JobList';
import JobDetails from './pages/public/JobDetails';
import InterviewerDashboard from './pages/interviewer/InterviewerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';

import Home from './pages/public/Home';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Candidate Routes */}
        <Route element={<RoleRoute allowedRoles={['CANDIDATE']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/profile" element={<CandidateProfile />} />
            <Route path="/candidate/resume" element={<CandidateResume />} />
            <Route path="/candidate/applications" element={<CandidateApplications />} />
            <Route path="/candidate/offers" element={<CandidateOffers />} />
          </Route>
        </Route>

        {/* Recruiter Routes */}
        <Route element={<RoleRoute allowedRoles={['RECRUITER', 'ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs" element={<ManageJobs />} />
            <Route path="/recruiter/jobs/create" element={<JobForm />} />
            <Route path="/recruiter/jobs/edit/:id" element={<JobForm />} />
            <Route path="/recruiter/jobs/:jobId/applications" element={<JobApplications />} />
            <Route path="/recruiter/applications" element={<Applications />} />
            <Route path="/recruiter/candidates" element={<Candidates />} />
            <Route path="/recruiter/interviews" element={<ManageInterviews />} />
            <Route path="/recruiter/assistant" element={<RecruiterAssistant />} />
          </Route>
        </Route>

        {/* Interviewer Routes */}
        <Route element={<RoleRoute allowedRoles={['INTERVIEWER']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/interviewer/dashboard" element={<InterviewerDashboard />} />
            <Route path="/interviewer/interviews" element={<InterviewerDashboard />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
