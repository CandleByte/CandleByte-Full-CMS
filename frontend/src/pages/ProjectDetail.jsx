import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export const ProjectDetail = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Could not load project');
                }

                setProject(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents/project/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Could not load documents');
                }
                setDocuments(data);
            } catch (error) {
                setError(error.message);
            }
        }
        fetchDocuments();
    }, [id]);

    if (loading) return <p>Project is loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!project) return null;

    return (
        <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <h3>Documents</h3>
            {documents.length === 0 ? (<p>No documents yet,</p>)
                : (
                    <ul>
                        {documents.map((doc) => (
                            <li key={doc._id}>
                                <Link to={`/documents/${doc._id}`}>{doc.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            <h4>{project.status}</h4>
        </div>
    );
};