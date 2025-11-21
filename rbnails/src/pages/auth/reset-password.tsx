'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import Link from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (router.isReady && !token) {
      setError('Token de redefinição de senha inválido ou ausente.');
    }
  }, [router.isReady, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Ocorreu um erro ao redefinir a senha.');
    } else {
      setSuccess(data.message);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'var(--custom-pink-0)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ mt: 8, p: 4, borderRadius: 4, width: '100%', maxWidth: '400px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant='h5' component='h1' gutterBottom>
            Redefinir Senha
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          {token && !success && (
            <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
              <Button type="submit" variant='contained' color='primary' fullWidth sx={{ mt: 3, mb: 2 }}>
                Salvar Nova Senha
              </Button>
            </Box>
          )}
          {success && (
             <Typography variant="body2" align="center">
                Você será redirecionado para a página de login. Se não for,{' '}
                <Link href="/auth/login" style={{ color: 'var(--custom-pink-2)', textDecoration: 'none' }}>
                  clique aqui
                </Link>.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

