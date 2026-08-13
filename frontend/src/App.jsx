import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Navigate } from "react-router-dom";
import { Projects } from "./pages/Projects.jsx";
import { CreateProject } from "./pages/CreateProject.jsx";
import { ProjectDetail } from './pages/ProjectDetail.jsx'
import { DocumentDetail } from './pages/DocumentDetail.jsx';

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                <Route path="/newproject" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
                <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
                <Route path="/documents/:id" element={<ProtectedRoute><DocumentDetail /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};



