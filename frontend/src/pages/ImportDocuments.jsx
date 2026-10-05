import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const ImportDocuments = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [owner, setOwner] = useState("CandleByte");
    const [repo, setRepo] = useState("");
    const [path, setPath] = useState("docs");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleBrowse = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents/browse?owner=${owner}&repo=${repo}&path=${path}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Could not browse repository');
            }

            setFiles(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (file) => {
        setError(null);
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ project: id, owner, repo, path: file.path }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Could not import the file');
            }

            navigate(`/projects/${id}`);

        } catch (error) {
            setError(error.message);
        }
    };

    const inputClass = "w-full bg-bg-dark border border-border rounded-md px-4 py-2 font-body text-ice placeholder:text-muted focus:border-periwinkle focus:outline-none transition-colors";

    return (
        <main className="max-w-3xl mx-auto px-6 py-24">

            <h1 className="font-tech text-4xl tracking-tight text-ice">
                Import from GitHub
            </h1>
            <p className="font-body text-muted mt-3">
                Index markdown files that already live in a repository. Nothing is committed — the file stays where it is.
            </p>

            {error && (
                <p role="alert" className="mt-8 border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 font-body text-sm">
                    {error}
                </p>
            )}

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-tech text-sm text-muted uppercase tracking-wider">Owner</label>
                    <input value={owner} onChange={(e) => setOwner(e.target.value)} className={inputClass} />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-tech text-sm text-muted uppercase tracking-wider">Repo</label>
                    <input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="CMS_test" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-tech text-sm text-muted uppercase tracking-wider">Folder</label>
                    <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="docs" className={inputClass} />
                </div>
                <button
                    onClick={handleBrowse}
                    disabled={loading || !repo}
                    className="shrink-0 font-tech text-sm uppercase tracking-wider border border-periwinkle text-periwinkle rounded-md px-6 py-2 hover:bg-periwinkle hover:text-bg-dark transition-colors disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Browse'}
                </button>
            </div>

            <div className="mt-16 border-t border-border pt-12">
                {files.length === 0 ? (
                    <p className="font-body text-muted">
                        No files listed yet. Enter a repository and browse.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {files.map((file) => (
                            <li
                                key={file.sha}
                                className="border border-border rounded-md px-6 py-4 flex items-center justify-between gap-6"
                            >
                                <div>
                                    <p className="font-body text-ice">{file.name}</p>
                                    <p className="font-mono text-xs text-muted mt-1">{file.path}</p>
                                </div>
                                <button
                                    onClick={() => handleImport(file)}
                                    className="shrink-0 font-tech text-sm uppercase tracking-wider border border-border text-muted rounded-md px-4 py-2 hover:border-periwinkle hover:text-periwinkle transition-colors"
                                >
                                    Import
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </main>
    );
};