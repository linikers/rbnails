import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signIn, useSession } from 'next-auth/react';

export default function Login () {

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    },[session, status, router])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result =  await signIn('credentials', {
            redirect: false,
            user,
            pass,
        });

        if ( result?.error) {
            setError(result.error);
        } else {
            router.push('/dashboard');
        }
    };

    if (status === 'loading') {
        return <p>Carregando...</p>
    }


    return (
        <div>
            <h1>Seja bem vinda</h1>
            <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="user">Usuário:</label>
                <input 
                    type="text"
                    id="user"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="pass">Senha:</label>
                <input 
                    type="text"
                    id="pass"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                />
            </div>
            <button type="button">Sair</button>
            <button type="submit">Entrar</button>
            </form>
        </div>
    )
}