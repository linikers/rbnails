import {
    addAgendamento,
    Agendamento,
    calcularTotalConfirmado,
    getAgendamentosByUserId,
    getAgendamentosConfirmados,
    getUniqueConfirmedClientsCount,
    updateAgendamento
} from "@/lib/agendamentoStorage";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
// import Grid from "@mui/material/Grid";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



interface DashboardCardsProps {
    userId: string;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ userId }) => {

    // const agendamentos = getAgendamentoByUser(userId);
    // const totalConfirmados = calcularTotalConfirmado(userId);
    // const qtdAtendimentos = agendamentos.length;
    // const qtdConfirmados = agendamentos.filter(a => a.confirmado).length;
    // const clientesUnicos = new Set(agendamentos.map(a=> a.descricao)).size;

    const [userAgendamentos, setUserAgendamentos] = useState<Agendamento[]>([]);
    const [totalConfirmados, setTotalConfirmados] =useState(0);
    const [qtdAtendimentos, setQtdAtendimentos] = useState(0);
    const [qtdConfirmados, setQtdConfirmados] = useState(0);
    const [clientesUnicos, setClientesUnicos] = useState(0);

    const [openModal, setOpenModal] = useState(false);

    const [currentAgendamento, setCurrentAgendamento] = useState<Agendamento | null>(null);
    // const [modalUserId, setModalUserId] = useState('');

    const [formState, setFormState] = useState({
        data: '',
        hora: '',
        descricao: '',
        valor: 0,
    });

    const refreshAgendamentos = () => {
        const currentAgendamentos = getAgendamentosByUserId(userId);
        setUserAgendamentos(currentAgendamentos);
        setTotalConfirmados(calcularTotalConfirmado(userId));
        setQtdAtendimentos(userAgendamentos.length);
        setQtdConfirmados(userAgendamentos.filter(a => a.confirmado).length);
        setClientesUnicos(getUniqueConfirmedClientsCount());
    };

    useEffect(() => {
        refreshAgendamentos();
    },[userId]);

    const handleOpenModal = (agendamento: Agendamento | null) => {
        setCurrentAgendamento(agendamento);
        if (agendamento) {
            setFormState({
                data: agendamento.data,
                hora: agendamento.hora,
                descricao: agendamento.descricao,
                valor: agendamento.valor,
            })
        } else {
            setFormState({
                data: "",
                hora: "",
                descricao: "",
                valor: 0,
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentAgendamento(null);
        setFormState({
            data: "",
            hora: "",
            descricao: "",
            valor: 0,
        })
        
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
        }))
    };

    const handleSaveAgendamento = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentAgendamento) {
            updateAgendamento({
                ...currentAgendamento,
                ...formState,
                userId: userId,

            });
        } else {
            addAgendamento({
                ...formState,
                userId: userId,
                confirmado: false,
            });
        }
        refreshAgendamentos();
        handleCloseModal();
    };

    const handleConfirmService = (agendamentoId: string) => {
        const agendamentoToUpdate = userAgendamentos.find(a => a.id === agendamentoId);

        if (agendamentoToUpdate) {
            updateAgendamento({ ...agendamentoToUpdate, confirmado: true })
            refreshAgendamentos();
        }
    };

    const items = [
        { label: "Atendimentos", value: qtdAtendimentos },
        { label: "Confirmados", value: qtdConfirmados },
        { label: "Clientes únicos", value: clientesUnicos },
        { label: "Total COnfirmado", value: `R$ ${totalConfirmados.toFixed(2)}` },
    ];

    return (
        <Grid container sx={{ p: 2 }}>
            {items.map((item, idx) => (
                <Card sx={{ borderRadius: 2, boxShadow: 3}} key={idx}>
                    <CardContent>
                        <Typography variant="h6" color="primary">{item.label}</Typography>
                        <Typography variant="h4">{item.value}</Typography>
                    </CardContent>
               </Card>
            ))}

            <Card sx={{ borderRadius: 2, boxShadow: 3, mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">Genrenciador de horários</Typography>
                        <Button 
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenModal(null)}
                        >
                            Adicionar horário
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2}}>
                        {userAgendamentos.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                Nenhum agendamento encontrado
                            </Typography>
                        ) : (
                            userAgendamentos.map(ag => (
                                <Box key={ag.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #E0E0E0' }}>
                                    <Box>
                                        <Typography>
                                            {ag.data} {ag.hora} - {ag.descricao} (R$ {ag.valor.toFixed(2)})
                                        </Typography>
                                        <Typography>
                                            Status: {ag.confirmado ? 'Confirmado' : 'Pendente'}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        {!ag.confirmado && (
                                            <IconButton onClick={() => handleConfirmService(ag.id)} color='success' size='small'>
                                                <CheckCircleIcon />
                                            </IconButton>
                                        )}<IconButton onClick={() => handleOpenModal(ag)} color="info" size="small">
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>
                </CardContent>
            </Card>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{currentAgendamento ? 'Editar horário' : 'Adicionar horário'}</DialogTitle>
                <DialogContent>
                    <TextField 
                        autoFocus
                        name="data"
                        label="Data"
                        type="date"
                        fullWidth
                        value={formState.data}
                        onChange={handleFormChange}
                        sx={{ marginBottom: 1, marginTop: 1 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField 
                        name="hora"
                        label="Hora"
                        type="time"
                        fullWidth
                        value={formState.hora}
                        onChange={handleFormChange}
                        sx={{ marginBottom: 1 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        name="descricao"
                        label="Descrição"
                        type="text"
                        fullWidth
                        value={formState.descricao}
                        onChange={handleFormChange}
                        sx={{ marginBottom: 1 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        // margin="dense"
                        name="valor"
                        label="Valor"
                        type="number"
                        fullWidth
                        // variant="standart"
                        value={formState.valor}
                        onChange={handleFormChange}
                        sx={{ marginBottom: 1 }}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveAgendamento}>
                        {currentAgendamento ? 'Salvar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}