import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";
import logo from "../utils/candlebyte.png";

export const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const linkClass = ({ isActive }) =>
        `font-tech text-sm uppercase tracking-wider transition-colors ${isActive ? 'text-periwinkle' : 'text-muted hover:text-ice'
        }`;
    return (
        <header className="w-full border-b border-border">
            <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

                <NavLink to="/dashboard" className="flex items-center gap-3 shrink-0">
                    <img src={logo} alt="" className="w-7" />
                    <span className="font-tech text-sm uppercase tracking-widest text-ice">
                        CandleByte
                    </span>
                </NavLink>

                <div className="flex items-center gap-6">
                    <NavLink to="/dashboard" className={linkClass}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/projects" className={linkClass}>
                        Projects
                    </NavLink>
                    
                    <button
                        onClick={handleLogout}
                        className="font-tech text-sm uppercase tracking-wider text-muted hover:text-ice transition-colors"
                    >
                        Logout
                    </button>
                </div>

            </nav>
        </header>
    );
};
