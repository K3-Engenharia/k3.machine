import React from 'react';
import { Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function BackToDashboardButton({ to = '/dashboard', label = 'Voltar para o Dashboard' }) {
  const navigate = useNavigate();
  return (
    <Box mb={2}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(to)}
        sx={{ textTransform: 'none' }}
      >
        {label}
      </Button>
    </Box>
  );
}
