import { useState } from "react";

export const Login = () => {
    const [loginInput, setLoginInput] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const URL = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loginInput, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder="E-mail or username" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
            <button type="submit" disabled={loading}>Login</button>
        </form>
    );
};
