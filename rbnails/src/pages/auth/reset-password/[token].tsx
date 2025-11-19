'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Paper, TextField, Typography, Alert } from '@mui/material';

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token } = router.query; // Pega o token da URL

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            return setError('As senhas não coincidem.');
        }
        if (!token) {
            return setError('Token de redefinição inválido ou ausente.');
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao redefinir a senha.');
            }

            setSuccess(data.message);
            // Redireciona para o login após alguns segundos
            setTimeout(() => router.push('/auth/login'), 3000);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: '400px' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Redefinir Senha
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                
                {!success && (
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Nova Senha"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <TextField
                            label="Confirmar Nova Senha"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Salvar Nova Senha
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
