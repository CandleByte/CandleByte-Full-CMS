import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CreateProject = () => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const inputClass = "w-full bg-bg-dark border border-border rounded-md px-4 py-2 font-body text-ice placeholder:text-muted focus:border-periwinkle focus:outline-none transition-colors";

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
        <div className="min-h-screen">
            <main className="max-w-2xl mx-auto px-6 py-24">
                <h1 className="font-tech text-4xl tracking-tight text-ice">
                    New Project
                </h1>
                <p className="font-body text-muted mt-3">
                    Create your new game
                </p>
                <form onSubmit={submitHandler} className="mt-12 flex flex-col gap-6">
                    {error && <p className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 font-body text-sm">
                        {error}
                    </p>}
                    <div className="flex flex-col gap-2">
                        <label className="font-tech text-muted uppercase tracking-wider">Project Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="New project name"
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-tech text-sm text-muted uppercase tracking-wider">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Project description"
                            className={inputClass}
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="self-start font-tech text-sm uppercase tracking-wider border border-periwinkle text-periwinkle rounded-md px-6 py-3 hover:bg-periwinkle hover:text-bg-dark transition-colors disabled:opacity-50"
                    >Create</button>
                </form>
            </main>
        </div>
    );
};
