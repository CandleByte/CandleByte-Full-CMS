import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";

export const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen">


            <main className="max-w-5xl mx-auto px-6 py-24">
                <h1 className="font-tech text-5xl tracking-tight text-ice">
                    Dashboard
                </h1>
                <p className="font-body mt-3 text-muted">
                    Manage your projects and documents.
                </p>

                <div className="mt-16 grid gap-4 sm:grid-cols-2">
                    <Link
                        to="/projects"
                        className="block border border-border rounded-md p-8 hover:border-periwinkle transition-colors"
                    >
                        <h2 className="font-tech text-xl text-ice">Projects</h2>
                        <p className="font-body text-sm text-muted mt-2">
                            Browse your games and their documents.
                        </p>
                    </Link>

                    <Link
                        to="/newproject"
                        className="block border border-border rounded-md p-8 hover:border-periwinkle transition-colors"
                    >
                        <h2 className="font-tech text-xl text-ice">New project</h2>
                        <p className="font-body text-sm text-muted mt-2">
                            Start tracking a new game.
                        </p>
                    </Link>
                </div>
            </main>

        </div>
    );
};