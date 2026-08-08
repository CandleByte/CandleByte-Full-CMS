import { useState } from "react";


export const Login = () => {

    const [loginInput, setLoginInput] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const URL = `${import.meta.env.VITE_BACKEND_URL}/auth/login`
            const response = fetch(URL,)
        }
    }



    return ();
}