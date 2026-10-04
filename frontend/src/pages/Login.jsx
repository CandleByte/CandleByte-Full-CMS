import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { Link } from "react-router-dom";
import logo from "../utils/candlebyte.png";

export const Login = () => {
    const [loginInput, setLoginInput] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

            dispatch(setCredentials({ token: data.token }));
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <img
                    src={logo}
                    alt="CandleByte"
                    className="w-50 mx-auto mb-6" />

                <h1 className="font-tech text-5xl tracking-tight text-ice text-center">
                    CandleByte
                </h1>
                <p className="font-body text-sm text-muted text-center mt-2">
                    Sign in to your workspace
                </p>
                <form onSubmit={handleLogin} className="mt-12 flex flex-col gap-4">
                    {error && (<p className="border border-red-900 bg-red-950/40 text-red-300 rounded-md px-4 py-3 font-body text-sm"
                    >
                        {error}
                    </p>)}

                    <input value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder="E-mail or username"
                        className="w-full bg-bg-dark border border-border rounded-md px-4 py-3 font-body text-ice placeholder:text-muted focus:border-periwinkle focus:outline-none transition-colors"
                    />
                    <input value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="password"
                        className="w-full bg-bg-dark border border-border rounded-md px-4 py-3 font-body text-ice placeholder:text-muted focus:border-periwinkle focus:outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 font-tech text-sm uppercase tracking-wider border border-periwinkle text-periwinkle rounded-md px-6 py-3 hover:bg-periwinkle hover:text-bg-dark transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <p className="font-body text-sm text-muted text-center mt-8">
                    Need an account?{' '}
                    <Link to="/register" className="text-periwinkle hover:text-ice transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};
