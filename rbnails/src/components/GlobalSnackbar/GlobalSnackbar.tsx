import React, { FC } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface GlobalSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  duration?: number;
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

export const GlobalSnackbar: FC<GlobalSnackbarProps> = ({
  open,
  message,
  severity,
  duration = 6000,
  handleClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};