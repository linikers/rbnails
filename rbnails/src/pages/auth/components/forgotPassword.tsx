import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";


export function ForgotPasswordDialog({ open, onClose, onSubmit, email, setEmail, error, success }: {
    open: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    email: string;
    setEmail: (email: string) => void;
    error: string;
    success: string;
}) {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form', onSubmit: onSubmit }}>
            <DialogTitle>Recuperar Senha</DialogTitle>
            <DialogContent>
                {!success && (
                    <Typography variant='body2' sx={{ mb: 2 }}>
                        Digite seu e-mail e enviaremos um link para redefinir sua senha.
                    </Typography>
                )}
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
                {!success && (
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email-forgot"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {success ? 'Fechar' : 'Cancelar'}
                </Button>
                {!success && (
                    <Button type="submit" variant='contained'>
                        Enviar Link
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}