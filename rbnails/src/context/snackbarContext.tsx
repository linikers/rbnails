// src/context/SnackbarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertColor } from '@mui/material/Alert';
import { GlobalSnackbar } from '@/components/GlobalSnackbar/GlobalSnackbar';

// Define o formato das opções que a função de mostrar o snackbar aceitará
interface SnackbarOptions {
  message: string;
  severity?: AlertColor; // 'error', 'warning', 'info', 'success'
  duration?: number;
}

// Define o tipo do nosso contexto
interface SnackbarContextType {
  showSnackbar: (options: SnackbarOptions) => void;
}

// Cria o contexto
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// Cria um hook customizado para facilitar o uso do contexto
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar deve ser usado dentro de um SnackbarProvider');
  }
  return context;
};

// Cria o componente Provedor
export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [duration, setDuration] = useState(6000);

  // Função que será chamada de outros componentes para mostrar o snackbar
  const showSnackbar = ({ message, severity = 'info', duration = 6000 }: SnackbarOptions) => {
    setMessage(message);
    setSeverity(severity);
    setDuration(duration);
    setOpen(true);
  };

  // Função para fechar o snackbar
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const contextValue = {
    showSnackbar,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {/* O componente visual do Snackbar é renderizado aqui */}
      <GlobalSnackbar
        open={open}
        message={message}
        severity={severity}
        duration={duration}
        handleClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
};
