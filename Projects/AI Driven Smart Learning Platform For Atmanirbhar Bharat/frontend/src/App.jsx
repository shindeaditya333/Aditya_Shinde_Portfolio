import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSetup from "./pages/ProfileSetup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProfilePage from "./pages/ProfilePage";
import VideoExplorer from "./pages/VideoExplorer";
import VideoPlayer from "./pages/VideoPlayer";
import Courses from "./pages/courses/Courses";
import CoursePlayer from "./pages/courses/CoursePlayer";
import ManageCourses from "./pages/admin/ManageCourses";
import AddCourse from "./pages/admin/AddCourse";
import UpdateCourse from "./pages/admin/UpdateCourse";
import DeleteCourse from "./pages/admin/DeleteCourse";
import AIAssistant from "./pages/AIAssistant";
import InternshipExplorer from "./pages/InternshipExplorer";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profilesetup" element={<ProfileSetup />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/videoexplorer" element={<VideoExplorer />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/videoplayer" element={<VideoPlayer />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CoursePlayer />} />
        <Route path="/managecourses" element={<ManageCourses />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/updatecourse" element={<UpdateCourse />} />
        <Route path="/deletecourse" element={<DeleteCourse />} />
        <Route path="/aiassistant" element={<AIAssistant />} />
        <Route path="/internships" element={<InternshipExplorer/>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;