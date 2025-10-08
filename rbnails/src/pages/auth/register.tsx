'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Ocorreu um erro.');
    } else {
      setSuccess(data.message);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000); // Redireciona para o login após 2 segundos
    }
  };

  return (
    <Box sx={{ backgroundColor: 'var(--custom-pink-0)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ mt: 8, p: 4, borderRadius: 4, width: '100%', maxWidth: '400px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant='h5' component='h1' gutterBottom>
            Criar Conta
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              label="Nome Completo"
              variant="outlined"
              margin="normal"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Nome de Usuário"
              variant="outlined"
              margin="normal"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant='contained' color='primary' fullWidth sx={{ mt: 3, mb: 2 }}>
              Registrar
            </Button>
            <Typography variant="body2" align="center">
              Já tem uma conta?{' '}
              <Link href="/auth/login" style={{ color: 'var(--custom-pink-2)', textDecoration: 'none' }}>
                Faça login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
