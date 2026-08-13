import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const CreateDocument = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [owner, setOwner] = useState("");
    const [content, setContent] = useState("");
    const [repo, setRepo] = useState("")
    const [path, setPath] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [kind, setKind] = useState("native");

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
        <>
            <form onSubmit={handleSubmit}>
                <select value={kind} onChange={(e) => setKind(e.target.value)}>
                    <option value="native">Native</option>
                    <option value="git">Git</option>
                    <option value="upload">Upload</option>
                </select>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />

                {kind !== 'upload' && (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        rows={10}
                    />
                )}

                {kind === 'git' && (
                    <>
                        <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner" />
                        <input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="Repo" />
                        <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="Path (e.g. docs/notes.md)" />
                    </>
                )}

                {kind === 'upload' && (
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>Create</button>
            </form>
        </>
    );

};