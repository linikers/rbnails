'use client';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signIn, useSession } from 'next-auth/react';
import {
    Alert,
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    // Dialog,
    // DialogActions,
    // DialogContent,
    // DialogTitle
} from "@mui/material";
import Link from "next/link";
import { ForgotPasswordDialog } from "./components/forgotPassword";

export default function Login() {

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const { data: session, status } = useSession();
    const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // console.log(e);
        const result =  await signIn('credentials', {
            redirect: false,
            user,
            pass,
        });
        // console.log("result", result);
        if ( result?.error) {
            setError(result.error);
        } else if(result?.ok) {
            router.push('/dashboard');
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotPasswordError('');
        setForgotPasswordSuccess('');

        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotPasswordEmail }),
        });

        const data = await response.json();

        if (!response.ok) {
            setForgotPasswordError(data.message || 'Ocorreu um erro ao solicitar a redefinição.');
        } else {
            setForgotPasswordSuccess(data.message);
            // Opcional: fechar o dialog após um tempo ou deixar o usuário fechar
            // setTimeout(() => setOpenForgotPasswordDialog(false), 5000);
        }
    };

    const handleCloseForgotPasswordDialog = () => {
        setOpenForgotPasswordDialog(false);
        setForgotPasswordEmail(''); // Limpa o email ao fechar
        setForgotPasswordError('');
        setForgotPasswordSuccess('');
    };

    if (status === 'loading') {
        return <p>Carregando...</p>
    }


    return (
        <Box sx={{ backgroundColor: 'var(--custom-pink-0)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: '400px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant='h5' component='h1' gutterBottom>
                        Seja bem vinda
                    </Typography>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            label="Usuário ou Email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required
                        />
                        <TextField
                            label="Senha"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            required
                        />
                        <Button type="submit" variant='contained' color='primary' fullWidth sx={{ mt: 3, mb: 2 }}>
                            Entrar
                        </Button>
                        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                            Não tem uma conta?{' '}
                            <Link href="/auth/register" style={{ color: 'var(--custom-pink-2)', textDecoration: 'none' }}>
                                Registre-se
                            </Link>
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                            <Link href="#" onClick={(e) => { e.preventDefault(); setOpenForgotPasswordDialog(true); }} style={{ color: 'var(--custom-pink-2)', textDecoration: 'none' }}>
                                Esqueci minha senha
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
            <ForgotPasswordDialog
                open={openForgotPasswordDialog}
                onClose={handleCloseForgotPasswordDialog}
                onSubmit={handleForgotPasswordSubmit}
                email={forgotPasswordEmail}
                setEmail={setForgotPasswordEmail}
                error={forgotPasswordError}
                success={forgotPasswordSuccess}
            />
        </Box>
    )
}
