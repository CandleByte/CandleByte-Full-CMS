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

    if (loading) return <p>Loading document...</p>;

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {conflict && (
                <div style={{ border: '1px solid orange', padding: '10px' }}>
                    <p>{conflict}</p>
                    <p>Current version on GitHub:</p>
                    <pre>{liveVersion}</pre>
                    <button
                        type="button"
                        onClick={() => {
                            setContent(liveVersion);
                            setConflict(null);
                        }}
                    >
                        Load GitHub's version
                    </button>

                    <p>Your unsaved version:</p>
                    <pre>{myVersion}</pre>
                </div>
            )}

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                style={{ width: '100%' }}
            />
            <button type="submit" disabled={saving}>Save</button>
        </form>
    );
};