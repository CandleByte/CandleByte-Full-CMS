import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export const DocumentDetail = () => {

    const { id } = useParams();

    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);



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

    if (loading) return <p>Project is loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!document) return null;

    return (
        <div>
            <h1>{document.title}</h1>
            {(document.kind === 'native' || document.kind === 'git') && (
                <ReactMarkdown>{document.content}</ReactMarkdown>
            )}

            {document.kind === 'upload' && (
                <img src={document.fileUrl} alt={document.title} style={{ maxWidth: '100%' }} />
            )}

        </div>
    );
}