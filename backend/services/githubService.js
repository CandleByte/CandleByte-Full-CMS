export const getFile = async (token, owner, repo, path) => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'candlebyte-cms'
        }
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Github API error: ${response.statusText}`);

    const data = await response.json();
    return {
        content: Buffer.from(data.content, 'base64').toString('utf-8'),
        sha: data.sha
    };
};

export const createFile = async (token, owner, repo, path, content, message) => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'candlebyte-cms'
        },
        body: JSON.stringify({
            message: message,
            content: Buffer.from(content).toString('base64')
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Github ${response.status}: ${err.message || response.statusText}`);
    }

    const data = await response.json();
    return { sha: data.content.sha, path: data.content.path };
};