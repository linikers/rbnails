import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
    Box,
    Button,
    Container,
    Typography,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Logo from '@/components/logo';
import NavBar from '@/components/navbar';
import AuthGuard from '@/components/AuthGuard';
import { IHorario } from '@/models/HorarioDisponivel';
import { IBloqueio } from '@/models/Bloqueio';
import { IUser } from '@/models/User';
// import HorarioTable from '@/components/GerenciadorHorarios/HorarioTable';
// import BloqueioTable from '@/components/GerenciadorHorarios/BloqueioTable';
import HorarioModal from '@/components/GerenciadorHorarios/horarioModal';
import BloqueioModal from '@/components/GerenciadorHorarios/bloqueioModal';
import HorarioTable from '@/components/GerenciadorHorarios/horarioTable';
import BloqueioTable from '@/components/GerenciadorHorarios/bloqueioTable';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GerenciarHorarios() {
    const [selectedProfissional, setSelectedProfissional] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false);
    const [horarioToEdit, setHorarioToEdit] = useState<IHorario | null>(null);

    const [isBloqueioModalOpen, setIsBloqueioModalOpen] = useState(false);
    const [bloqueioToEdit, setBloqueioToEdit] = useState<IBloqueio | null>(null);

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
        selectedProfissional ? `/api/horarios-bloqueios?profissionalId=${selectedProfissional}` : null,
        fetcher
    );
    const bloqueios: IBloqueio[] = bloqueiosResponse?.data || [];

    const handleChangeProfissional = (event: any) => {
        setSelectedProfissional(event.target.value);
    };

    // --- Horario Modal Handlers ---
    const handleOpenHorarioModal = (horario: IHorario | null) => {
        setHorarioToEdit(horario);
        setIsHorarioModalOpen(true);
    };

    const handleCloseHorarioModal = () => {
        setIsHorarioModalOpen(false);
        setHorarioToEdit(null);
    };

    // --- Bloqueio Modal Handlers ---
    const handleOpenBloqueioModal = (bloqueio: IBloqueio | null) => {
        setBloqueioToEdit(bloqueio);
        setIsBloqueioModalOpen(true);
    };

    const handleCloseBloqueioModal = () => {
        setIsBloqueioModalOpen(false);
        setBloqueioToEdit(null);
    };

    // --- API Handlers ---
    const handleSaveHorario = async (horarioData: Partial<IHorario>) => {
        const isEditing = !!horarioData._id;
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/horarios-disponiveis/${horarioData._id}` : '/api/horarios-disponiveis';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(horarioData),
            });
            if (!res.ok) throw new Error('Falha ao salvar horário.');
            horariosMutate(); // Re-fetch data
            handleCloseHorarioModal();
        } catch (error: any) {
            setApiError(error.message);
        }
    };

    const handleDeleteHorario = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja excluir este horário?")) return;
        try {
            const res = await fetch(`/api/horarios-disponiveis/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Falha ao excluir horário.');
            horariosMutate();
        } catch (error: any) {
            setApiError(error.message);
        }
    };

    const handleSaveBloqueio = async (bloqueioData: Partial<IBloqueio>) => {
        const isEditing = !!bloqueioData._id;
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/horarios-bloqueios/${bloqueioData._id}` : '/api/horarios-bloqueios';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bloqueioData),
            });
            if (!res.ok) throw new Error('Falha ao salvar bloqueio.');
            bloqueiosMutate(); // Re-fetch data
            handleCloseBloqueioModal();
        } catch (error: any) {
            setApiError(error.message);
        }
    };

    const handleDeleteBloqueio = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja excluir este bloqueio?")) return;
        try {
            const res = await fetch(`/api/horarios-bloqueios/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Falha ao excluir bloqueio.');
            bloqueiosMutate();
        } catch (error: any) {
            setApiError(error.message);
        }
    };

    useEffect(() => {
        if (apiError) {
            const timer = setTimeout(() => {
                setApiError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [apiError]);

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
                    {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel 
                            id="profissional-select-label"
                            // InputLabelProps={{ shrink: true }}
                            // shrink: true
                            >
                                Profissional
                            </InputLabel>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
                                <Typography variant="h6" component="h2">
                                    Horários Disponíveis
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenHorarioModal(null)}
                                >
                                    Adicionar Horário
                                </Button>
                            </Box>
                            {horariosLoading ? (
                                <CircularProgress />
                            ) : horariosError ? (
                                <Alert severity="error">Erro ao carregar horários disponíveis.</Alert>
                            ) : (
                                <HorarioTable
                                    horarios={horariosDisponiveis}
                                    onEdit={(horario) => handleOpenHorarioModal(horario)}
                                    onDelete={handleDeleteHorario}
                                />
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
                                <Typography variant="h6" component="h2">
                                    Bloqueios
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenBloqueioModal(null)}
                                >
                                    Adicionar Bloqueio
                                </Button>
                            </Box>
                            {bloqueiosLoading ? (
                                <CircularProgress />
                            ) : bloqueiosError ? (
                                <Alert severity="error">Erro ao carregar bloqueios.</Alert>
                            ) : (
                                <BloqueioTable
                                    bloqueios={bloqueios}
                                    onEdit={(bloqueio) => handleOpenBloqueioModal(bloqueio)}
                                    onDelete={handleDeleteBloqueio}
                                />
                            )}
                        </>
                    )}
                </Box>
            </Container>
            {isHorarioModalOpen && <HorarioModal open={isHorarioModalOpen} onClose={handleCloseHorarioModal} onSave={handleSaveHorario} horario={horarioToEdit} profissionalId={selectedProfissional!} />}
            {isBloqueioModalOpen && <BloqueioModal open={isBloqueioModalOpen} onClose={handleCloseBloqueioModal} onSave={handleSaveBloqueio} bloqueio={bloqueioToEdit} profissionalId={selectedProfissional!} />}
        </AuthGuard>
    );
}
