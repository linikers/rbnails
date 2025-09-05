import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from 'next-auth/react';
import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";

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
        <Container maxWidth="sm">
            <Paper elevation={6} sx={{ mt: 8, p: 4, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center' }}>
                    <Typography variant='h5' component='h1' gutterBottom>
                        Seja bem vinda
                    </Typography>
                    {/* {error && <Alert severity="error" sx={{ width: 100%, mb:2 }}>{error}</Alert>} */}
                    <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField 
                            label="Usuário"
                            variant="outlined"
                            sx={{ margin: 2 }}
                            fullWidth
                            value={user}
                            onChange={(e) => setUser(e.target.value)} 
                            required
                        />
                        <TextField 
                            label="Senha"
                            type="password"
                            variant="outlined"
                            sx={{ margin: 2 }}
                            fullWidth
                            value={{pass}}
                            onChange={(e) => setUser(e.target.value)}
                            required
                        />
                    </Box>
                    <Box sx={{ display:'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button onClick={() => signOut()} variant='outlined' color='secondary' sx={{ margin:2 }}>
                            Sair
                        </Button>
                        <Button type="submit" variant='contained' color='primary' sx={{ margin:2 }}>
                            Entrar
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
        // <div>
        //     <h1>Seja bem vinda</h1>
        //     <form onSubmit={handleSubmit}>
        //     {error && <p style={{ color: 'red' }}>{error}</p>}
        //     <div>
        //         <label htmlFor="user">Usuário:</label>
        //         <input 
        //             type="text"
        //             id="user"
        //             value={user}
        //             onChange={(e) => setUser(e.target.value)}
        //             required
        //         />
        //     </div>
        //     <div>
        //         <label htmlFor="pass">Senha:</label>
        //         <input 
        //             type="password"
        //             id="pass"
        //             value={pass}
        //             onChange={(e) => setPass(e.target.value)}
        //             required
        //         />
        //     </div>
        //     <button type="button" onClick={() => signOut()}>Sair</button>
        //     <button type="submit">Entrar</button>
        //     </form>
        // </div>
    )
}