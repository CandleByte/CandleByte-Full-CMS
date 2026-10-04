import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const EditDocument = () => {
    const { id } = useParams();

    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [conflict, setConflict] = useState(null);
    const [liveVersion, setLiveVersion] = useState(null);
    const [myVersion, setMyVersion] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Could not load the document');
                }
                setContent(data.content);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setConflict(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (response.status === 409) {
                setConflict(data.message);

                const fresh = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const freshData = await fresh.json();
                setMyVersion(content);
                setLiveVersion(freshData.content);
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || 'Could not edit document');
            }

            navigate(`/documents/${id}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="font-tech text-sm uppercase tracking-widest text-muted">
                Loading document...
            </p>
        </div>
    );

    return (
        <div className="min-h-screen">
            <main className="max-w-2xl mx-auto px-6 py-24">
                <h1 className="font-tech text-4xl tracking-tight text-ice">
                    Edit Document
                </h1>
                <p className="font-body text-muted mt-3">
                    Edit the content of your document below.
                </p>
                <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
                    {error && <p className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 font-body text-sm">{error}</p>}

                    {conflict && (
                        <div className="border border-orange-900 bg-orange-950/40 rounded-md p-6 flex flex-col gap-4">
                            <p className="font-tech text-sm uppercase tracking-wider text-orange-300">
                                {conflict}
                            </p>

                            <div className="flex flex-col gap-2">
                                <p className="font-tech text-xs uppercase tracking-widest text-muted">
                                    Current version on GitHub
                                </p>
                                <pre className="font-mono text-xs text-text bg-bg-dark border border-border rounded-md p-4 overflow-x-auto whitespace-pre-wrap">
                                    {liveVersion}
                                </pre>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setContent(liveVersion);
                                    setConflict(null);
                                }}
                                className="self-start font-tech text-sm uppercase tracking-wider border border-orange-700 text-orange-300 rounded-md px-4 py-2 hover:bg-orange-900/40 transition-colors"
                            >
                                Load GitHub's version
                            </button>

                            <div className="flex flex-col gap-2">
                                <p className="font-tech text-xs uppercase tracking-widest text-muted">
                                    Your unsaved version
                                </p>
                                <pre className="font-mono text-xs text-muted bg-bg-dark border border-border rounded-md p-4 overflow-x-auto whitespace-pre-wrap">
                                    {myVersion}
                                </pre>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={20}
                            className="w-full bg-bg-dark border border-border rounded-md px-4 py-2 font-mono text-sm text-ice placeholder:text-muted focus:border-periwinkle focus:outline-none transition-colors"
                        />
                    </div>
                    <button type="submit"
                        disabled={saving}
                        className="self-start font-tech text-sm uppercase tracking-wider border border-periwinkle text-periwinkle rounded-md px-6 py-3 hover:bg-periwinkle hover:text-bg-dark transition-colors disabled:opacity-50"
                    >
                        Save
                    </button>
                </form>
            </main>
        </div>

    );
};