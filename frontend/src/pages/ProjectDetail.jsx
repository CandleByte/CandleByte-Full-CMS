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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="font-tech text-sm uppercase tracking-widest text-muted">
                Loading project...
            </p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <p className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 font-body text-sm">
                {error}
            </p>
        </div>
    );

    if (!project) return null;

    return (
        <div className="min-h-screen">
            <main className="max-w-3xl mx-auto px-6 py-24">

                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h1 className="font-tech text-4xl tracking-tight text-ice">
                            {project.name}
                        </h1>
                        <p className="font-tech text-xs uppercase tracking-widest text-muted mt-3">
                            {project.status}
                        </p>
                    </div>
                    <Link
                        to="/projects"
                        className="shrink-0 font-tech text-sm uppercase tracking-wider text-muted hover:text-ice transition-colors"
                    >
                        ← All projects
                    </Link>
                </div>

                <p className="font-body text-text leading-relaxed mt-6">
                    {project.description}
                </p>

                <div className="mt-16 border-t border-border pt-12">

                    <div className="flex items-center justify-between gap-6">
                        <h2 className="font-tech text-xl tracking-tight text-ice">
                            Documents
                        </h2>
                        <Link
                            to={`/projects/${id}/documents/new`}
                            className="shrink-0 font-tech text-sm uppercase tracking-wider border border-periwinkle text-periwinkle rounded-md px-4 py-2 hover:bg-periwinkle hover:text-bg-dark transition-colors"
                        >
                            New document
                        </Link>
                    </div>

                    {documents.length === 0 ? (
                        <p className="font-body text-muted mt-8">
                            No documents yet.
                        </p>
                    ) : (
                        <ul className="mt-8 flex flex-col gap-3">
                            {documents.map((doc) => (
                                <li key={doc._id}>
                                    <Link
                                        to={`/documents/${doc._id}`}
                                        className="block border border-border rounded-md px-6 py-4 hover:border-periwinkle transition-colors"
                                    >
                                        <span className="font-body text-ice">{doc.title}</span>
                                        <span className="font-tech text-xs uppercase tracking-widest text-muted ml-3">
                                            {doc.kind}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </main>
        </div>
    );
};
