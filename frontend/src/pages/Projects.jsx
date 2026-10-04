import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


export const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Could not load projects');
                }
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);


    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="font-tech text-sm uppercase tracking-widest text-muted">
                Loading projects...
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

    return (
        <div className="min-h-screen">
            <main className="max-w-3xl mx-auto px-6 py-24">

                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h1 className="font-tech text-4xl tracking-tight text-ice">
                            Projects
                        </h1>
                        <p className="font-body text-muted mt-3">
                            Every game you're working on.
                        </p>
                    </div>
                    <Link
                        to="/newproject"
                        className="shrink-0 font-tech text-sm uppercase tracking-wider border border-periwinkle text-periwinkle rounded-md px-4 py-2 hover:bg-periwinkle hover:text-bg-dark transition-colors"
                    >
                        New project
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <p className="font-body text-muted mt-16">
                        No projects yet.
                    </p>
                ) : (
                    <ul className="mt-16 flex flex-col gap-3">
                        {projects.map((project) => (
                            <li key={project._id}>
                                <Link
                                    to={`/projects/${project._id}`}
                                    className="block border border-border rounded-md p-6 hover:border-periwinkle transition-colors"
                                >
                                    <div className="flex items-baseline justify-between gap-4">
                                        <h2 className="font-tech text-lg text-ice">
                                            {project.name}
                                        </h2>
                                        <span className="shrink-0 font-tech text-xs uppercase tracking-widest text-muted">
                                            {project.status}
                                        </span>
                                    </div>
                                    {project.description && (
                                        <p className="font-body text-sm text-muted mt-2 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

            </main>
        </div>
    );
}