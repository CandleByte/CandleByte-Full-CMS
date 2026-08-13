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


    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <ul>
            {projects.map((project) => (
                <li key={project._id}>
                    <Link to={`/projects/${project._id}`}>{project.name}</Link>
                </li>
            ))}
        </ul>
    );
}