import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const CreateDocument = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [owner, setOwner] = useState("");
    const [content, setContent] = useState("");
    const [repo, setRepo] = useState("");
    const [path, setPath] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [kind, setKind] = useState("native");

    const inputClass = "w-full bg-bg-dark border border-border rounded-md px-4 py-2 font-body text-ice placeholder:text-muted focus:border-periwinkle focus:outline-none transition-colors";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            let response;

            if (kind === 'upload') {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', title);
                formData.append('kind', kind);
                formData.append('project', id);

                response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });
            } else {
                const body = { title, kind, project: id, content };

                if (kind === 'git') {
                    body.owner = owner;
                    body.repo = repo;
                    body.path = path;
                }

                response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/documents`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body),
                });
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Could not create document');
            }

            navigate(`/projects/${id}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <main className="max-w-2xl mx-auto px-6 py-24">
                <h1 className="font-tech text-4xl tracking-tight text-ice">
                    New Document
                </h1>
                <p className="font-body text-muted mt-3">
                    Write it here, commit it to GitHub, or upload a file.
                </p>

                <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">

                    {error && (
                        <p className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 font-body text-sm">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="font-tech text-sm text-muted uppercase tracking-wider">Type</label>
                        <select
                            value={kind}
                            onChange={(e) => setKind(e.target.value)}
                            className={inputClass}
                        >
                            <option value="native">Native</option>
                            <option value="git">Git</option>
                            <option value="upload">Upload</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-tech text-sm text-muted uppercase tracking-wider">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Design notes"
                            className={inputClass}
                        />
                    </div>

                    {kind !== 'upload' && (
                        <div className="flex flex-col gap-2">
                            <label className="font-tech text-sm text-muted uppercase tracking-wider">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="# Markdown goes here"
                                rows={12}
                                className={`${inputClass} font-mono text-sm`}
                            />
                        </div>
                    )}

                    {kind === 'git' && (
                        <div className="border border-border rounded-md p-6 flex flex-col gap-4">
                            <p className="font-tech text-sm text-muted uppercase tracking-wider">Repository</p>
                            <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner" className={inputClass} />
                            <input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="Repo" className={inputClass} />
                            <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="docs/notes.md" className={inputClass} />
                        </div>
                    )}

                    {kind === 'upload' && (
                        <div className="flex flex-col gap-2">
                            <label className="font-tech text-sm text-muted uppercase tracking-wider">File</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="font-body text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-border file:bg-bg-dark file:text-ice file:font-tech file:text-sm hover:file:border-periwinkle"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="self-start font-tech text-sm uppercase tracking-wider border border-periwinkle text-periwinkle rounded-md px-6 py-3 hover:bg-periwinkle hover:text-bg-dark transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create'}
                    </button>

                </form>
            </main>
        </div>
    );
};