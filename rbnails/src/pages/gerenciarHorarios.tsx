import { useState, useEffect } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Logo from '@/components/logo';
import NavBar from '@/components/navbar';
import AuthGuard from '@/components/AuthGuard';
import { IHorario } from '@/models/HorarioDisponivel';
import { IBloqueio } from '@/models/Bloqueio';
import { IUser } from '@/models/User';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GerenciarHorarios() {
    const [selectedProfissional, setSelectedProfissional] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    // Fetch all profissionais
    const { data: profissionaisRes, error: profissionaisError, isLoading: profissionaisLoading } = useSWR('/api/users?role=profissional', fetcher);
    const profissionais: IUser[] = profissionaisRes?.data || [];

    // Fetch horarios disponiveis and bloqueios, now dependent on selectedProfissional
    const { data: horariosResponse, error: horariosError, isLoading: horariosLoading, mutate: horariosMutate } = useSWR(
        selectedProfissional ? `/api/horarios-disponiveis?profissionalId=${selectedProfissional}` : null,
        fetcher
    );
    const horariosDisponiveis: IHorario[] = horariosResponse?.data || [];

    const { data: bloqueiosResponse, error: bloqueiosError, isLoading: bloqueiosLoading, mutate: bloqueiosMutate } = useSWR(
        selectedProfissional ? `/api/bloqueios?profissionalId=${selectedProfissional}` : null,
        fetcher
    );
    const bloqueios: IBloqueio[] = bloqueiosResponse?.data || [];

    const handleChangeProfissional = (event: any) => {
        setSelectedProfissional(event.target.value);
    };

    const handleSaveHorario = async (horario: IHorario) => {
        // Placeholder para a lógica de salvar horários
        console.log("Salvando Horario", horario);
    };

    const handleDeleteHorario = async (id: string) => {
        // Placeholder para a lógica de deletar horários
        console.log("Deletando Horario", id);
    };

    const handleSaveBloqueio = async (bloqueio: IBloqueio) => {
        // Placeholder para a lógica de salvar bloqueios
        console.log("Salvando Bloqueio", bloqueio);
    };

    const handleDeleteBloqueio = async (id: string) => {
        // Placeholder para a lógica de deletar bloqueios
        console.log("Deletando Bloqueio", id);
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
                            Gerenciar Horários e Bloqueios
                        </Typography>
                    </Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="profissional-select-label">Selecione um profissional</InputLabel>
                        <Select
                            labelId="profissional-select-label"
                            id="profissional-select"
                            value={selectedProfissional || ''}
                            label="Profissional"
                            onChange={handleChangeProfissional}
                        >
                            {profissionaisLoading ? (
                                <MenuItem value="" disabled>Carregando profissionais...</MenuItem>
                            ) : profissionaisError ? (
                                <MenuItem value="" disabled>Erro ao carregar profissionais</MenuItem>
                            ) : (
                                profissionais.map((profissional) => (
                                    <MenuItem key={profissional._id} value={profissional._id}>{profissional.name}</MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    {selectedProfissional && (
                        <>
                            <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 1 }}>
                                Horários Disponíveis
                            </Typography>
                            {horariosLoading ? (
                                <CircularProgress />
                            ) : horariosError ? (
                                <Alert severity="error">Erro ao carregar horários disponíveis.</Alert>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Dia da Semana</TableCell>
                                                <TableCell>Hora Início</TableCell>
                                                <TableCell>Hora Fim</TableCell>
                                                <TableCell align="right">Ações</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {horariosDisponiveis.map((horario) => (
                                                <TableRow key={horario._id}>
                                                    <TableCell>{horario.diaSemana}</TableCell>
                                                    <TableCell>{horario.horaInicio}</TableCell>
                                                    <TableCell>{horario.horaFim}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleSaveHorario(horario)}><EditIcon /></IconButton>
                                                        <IconButton onClick={() => handleDeleteHorario(horario._id)}><DeleteIcon /></IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 1 }}>
                                Bloqueios
                            </Typography>
                            {bloqueiosLoading ? (
                                <CircularProgress />
                            ) : bloqueiosError ? (
                                <Alert severity="error">Erro ao carregar bloqueios.</Alert>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Data</TableCell>
                                                <TableCell>Hora Início</TableCell>
                                                <TableCell>Hora Fim</TableCell>
                                                <TableCell>Motivo</TableCell>
                                                <TableCell align="right">Ações</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {bloqueios.map((bloqueio) => (
                                                <TableRow key={bloqueio._id}>
                                                    <TableCell>{bloqueio.data}</TableCell>
                                                    <TableCell>{bloqueio.horaInicio}</TableCell>
                                                    <TableCell>{bloqueio.horaFim}</TableCell>
                                                    <TableCell>{bloqueio.motivo}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleSaveBloqueio(bloqueio)}><EditIcon /></IconButton>
                                                        <IconButton onClick={() => handleDeleteBloqueio(bloqueio._id)}><DeleteIcon /></IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}
                </Box>
            </Container>
        </AuthGuard>
    );
}

