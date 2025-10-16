import { useState } from 'react';
import useSWR from 'swr';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import "bootstrap/dist/css/bootstrap.min.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Logo from '@/components/logo';
import NavBar from '@/components/navbar';
import AuthGuard from '@/components/AuthGuard';
import ClienteModal from '@/components/Clientes/ClienteModal';
import { ICliente } from '@/models/Cliente';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientesPage() {
  const { data: apiResponse, error, isLoading, mutate } = useSWR('/api/clientes', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Partial<ICliente> | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleOpenModal = (cliente: Partial<ICliente> | null = null) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
    setApiError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCliente(null);
  };

  const handleSave = async (cliente: Partial<ICliente>) => {
    const isEditing = cliente._id;
    const url = isEditing ? `/api/clientes/${cliente._id}` : '/api/clientes';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar cliente.');
      }

      mutate(); // Revalida os dados do SWR
      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      setApiError(err.message);
      // Não fecha o modal em caso de erro para o usuário corrigir
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir cliente.');
      }

      mutate(); // Revalida os dados
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <AuthGuard>
      <Container>
        <header className="custom-header">
          <Logo />
          <NavBar />
        </header>
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" className="title__orange">
              Gerenciar Clientes
            </Typography>
            <Button variant="contained" onClick={() => handleOpenModal()}>
              Novo Cliente
            </Button>
          </Box>

          {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
          {error && <Alert severity="error">Falha ao carregar clientes.</Alert>}
          {apiError && <Alert severity="error" onClose={() => setApiError(null)} sx={{ mb: 2 }}>{apiError}</Alert>}

          {!isLoading && apiResponse?.data && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiResponse.data.map((cliente: ICliente) => (
                    <TableRow key={cliente._id}>
                      <TableCell>{cliente.nome}</TableCell>
                      <TableCell>{cliente.telefone}</TableCell>
                      <TableCell>{cliente.email || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenModal(cliente)}><EditIcon /></IconButton>
                        <IconButton onClick={() => handleDelete(cliente._id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <ClienteModal isOpen={isModalOpen} toggle={handleCloseModal} onSave={handleSave} initialData={selectedCliente} />
      </Container>
    </AuthGuard>
  );
}
