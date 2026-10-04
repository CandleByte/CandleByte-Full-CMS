import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

export const DocumentDetail = () => {

    const { id } = useParams();

    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
                setDocument(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Could not delete the document');
            }
            navigate('/projects');
        } catch (error) {
            setError(error.message);
        }
        navigate('/projects');
    };

    if (loading) return <p>Project is loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!document) return null;

    return (
        <div className="min-h-screen">
            <main className="max-w-3xl mx-auto px-6 py-24">

                <div className="flex items-start justify-between gap-6">
                    <h1 className="font-tech text-4xl tracking-tight text-ice">
                        {document.title}
                    </h1>
                    <Link
                        to={`/documents/${id}/edit`}
                        className="shrink-0 font-tech text-sm uppercase tracking-wider border border-border text-muted rounded-md px-4 py-2 hover:border-periwinkle hover:text-periwinkle transition-colors"
                    >
                        Edit
                    </Link>
                </div>

                <p className="font-tech text-xs uppercase tracking-widest text-muted mt-3">
                    {document.kind}
                </p>

                <div className="mt-12 border-t border-border pt-12">
                    {(document.kind === 'native' || document.kind === 'git') && (
                        <div className="font-body text-text leading-relaxed [&_h1]:font-tech [&_h1]:text-2xl [&_h1]:text-ice [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:font-tech [&_h2]:text-xl [&_h2]:text-ice [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_a]:text-periwinkle [&_a]:underline [&_code]:font-mono [&_code]:text-sm [&_code]:bg-bg-dark [&_code]:px-1 [&_code]:rounded">
                            <ReactMarkdown>{document.content}</ReactMarkdown>
                        </div>
                    )}

                    {document.kind === 'upload' && (
                        <img
                            src={document.fileUrl}
                            alt={document.title}
                            className="w-full rounded-md border border-border"
                        />
                    )}
                </div>
                <button
                    onClick={handleDelete}
                    className="mt-16 font-tech text-sm uppercase tracking-wider border border-border text-muted rounded-md px-4 py-2 hover:border-red-800 hover:text-red-400 transition-colors"
                >
                    Delete Document
                </button>
            </main>
        </div>
    );
}