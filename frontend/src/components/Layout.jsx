import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar.jsx";

export const Layout = () => {
    return (
        <div className="min-h-screen">
            <NavBar />
            <Outlet />
        </div>
    );
};