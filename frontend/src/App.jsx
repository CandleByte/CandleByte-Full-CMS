import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Navigate } from "react-router-dom";
import { Projects } from "./pages/Projects.jsx";
import { CreateProject } from "./pages/CreateProject.jsx";
import { ProjectDetail } from './pages/ProjectDetail.jsx'
import { DocumentDetail } from './pages/DocumentDetail.jsx';
import { EditDocument } from './pages/EditDocument.jsx';
import { CreateDocument } from './pages/CreateDocument.jsx';
import { Layout } from "./components/Layout.jsx";

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/newproject" element={<CreateProject />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/documents/:id" element={<DocumentDetail />} />
                    <Route path="/documents/:id/edit" element={<EditDocument />} />
                    <Route path="/projects/:id/documents/new" element={<CreateDocument />} />
                </Route>
            </Routes>
        </Router>
    );
};




