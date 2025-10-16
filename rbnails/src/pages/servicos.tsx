import AuthGuard from "@/components/AuthGuard";
import Logo from "@/components/logo";
import NavBar from "@/components/navbar";
import ServicoModal from "@/components/Servicos/ServicoModal";
import { IServico } from "@/models/Servico";
import { Alert,
          Box,
          Button,
          CircularProgress,
          IconButton,
          Paper,
          Table,
          TableBody,
          TableCell,
          TableContainer,
          TableHead,
          TableRow,
          Typography,
        } from "@mui/material";
import { useState } from "react";
import { Container } from "reactstrap";
import useSWR from "swr";
import "bootstrap/dist/css/bootstrap.min.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ServicosPage() {
  const { data: apiResponse, error, isLoading, mutate } = useSWR('/api/servicos', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Partial<IServico> | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleOpenModal = (servico: Partial<IServico> | null = null) => {
    setSelectedServico(servico);
    setIsModalOpen(true);
    setApiError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedServico(null);
  };

  const handleSave = async (servico: Partial<IServico>) => {
    const isEditing = servico._id;
    const url = isEditing ? `/api/servicos/${servico._id}` : '/api/servicos';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servico),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar serviço.');
      }

      mutate(); // Revalida os dados do SWR
      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      setApiError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
      return;
    }

    try {
      const response = await fetch(`/api/servicos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir serviço.');
      }

      mutate();
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
              Gerenciar Serviços
            </Typography>
            <Button variant="contained" onClick={() => handleOpenModal()}>
              Novo Serviço
            </Button>
          </Box>

          {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
          {error && <Alert severity="error">Falha ao carregar serviços.</Alert>}
          {apiError && <Alert severity="error" onClose={() => setApiError(null)} sx={{ mb: 2 }}>{apiError}</Alert>}

          {!isLoading && apiResponse?.data && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Preço</TableCell>
                    <TableCell>Duração (min)</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiResponse.data.map((servico: IServico) => (
                    <TableRow key={servico._id}>
                      <TableCell>{servico.nome}</TableCell>
                      <TableCell>R$ {servico.preco.toFixed(2)}</TableCell>
                      <TableCell>{servico.duracaoEstimada}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenModal(servico)}><EditIcon /></IconButton>
                        <IconButton onClick={() => handleDelete(servico._id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <ServicoModal isOpen={isModalOpen} toggle={handleCloseModal} onSave={handleSave} initialData={selectedServico} />
      </Container>
    </AuthGuard>
  );
}
