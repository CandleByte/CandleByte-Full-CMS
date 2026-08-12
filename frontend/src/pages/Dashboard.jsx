import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";


export const Dashboard = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    }


    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            <Link to="/projects">Projects</Link>
            <Link to="/newproject">Create New Project</Link>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};
