import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CreateProject = () => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),

            });
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Project creation failed.');
            }

            navigate('/projects');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitHandler}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <button type="submit" disabled={loading}>Create</button>
        </form>
    );
};
