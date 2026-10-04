import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const inputClass = "w-full bg-bg-dark border border-border rounded-md px-4 py-3 font-body text-ice placeholder:text-muted focus:border-periwinkle focus:outline-none transition-colors";

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const URL = `${import.meta.env.VITE_BACKEND_URL}/auth/register`;
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">

                <h1 className="font-tech text-3xl tracking-tight text-ice text-center">
                    Register
                </h1>
                <p className="font-body text-sm text-muted text-center mt-2">
                    Create your account
                </p>

                <form onSubmit={handleRegister} className="mt-12 flex flex-col gap-4">

                    {error && (
                        <p role="alert" className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 font-body text-sm">
                            {error}
                        </p>
                    )}

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={inputClass}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputClass}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputClass}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 font-tech text-sm uppercase tracking-wider border border-periwinkle text-periwinkle rounded-md px-6 py-3 hover:bg-periwinkle hover:text-bg-dark transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                </form>

                <p className="font-body text-sm text-muted text-center mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="text-periwinkle hover:text-ice transition-colors">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
};
