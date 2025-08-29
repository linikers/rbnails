import { useRouter } from "next/router";
import { useState } from "react"

export const LoginPage = () => {

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    
    const Router = useRouter();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError('');
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}