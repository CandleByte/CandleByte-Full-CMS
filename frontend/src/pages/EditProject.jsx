import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const EditProject = () => {
    const { id } = useParams();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

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
                    throw new Error(data.message || 'Could not load the project');
                }
                setName(data.name);
                setDescription(data.description);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Could not update the project');
            }
            navigate(`/projects/${id}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="font-tech text-sm uppercase tracking-widest text-muted">
                Loading project...
            </p>
        </div>
    );

    const inputClass = "w-full bg-bg-dark border border-border rounded-md px-4 py-2 font-body text-ice placeholder:text-muted focus:border-periwinkle focus:outline-none transition-colors";

    return (
        <main className="max-w-2xl mx-auto px-6 py-24">
            <h1 className="font-tech text-4xl tracking-tight text-ice">
                Edit project
            </h1>

            <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">

                {error && (
                    <p role="alert" className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 font-body text-sm">
                        {error}
                    </p>
                )}

                <div className="flex flex-col gap-2">
                    <label className="font-tech text-sm text-muted uppercase tracking-wider">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-tech text-sm text-muted uppercase tracking-wider">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className={inputClass} />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-tech text-sm text-muted uppercase tracking-wider">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="self-start font-tech text-sm uppercase tracking-wider border border-periwinkle text-periwinkle rounded-md px-6 py-3 hover:bg-periwinkle hover:text-bg-dark transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>

            </form>
        </main>
    );
}
