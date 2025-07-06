// src/components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const BackButton = ({ label, to = -1, sx = {} }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof to === 'number') {
      navigate(to);
    } else {
      navigate(to, { replace: true });
    }
  };

  const translatedLabel = label ?? t('button.back');

  return (
    <StyledButton
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={handleClick}
      sx={sx}
    >
      {translatedLabel}
    </StyledButton>
  );
};

export default BackButton;

const StyledButton = styled(Button)`
  && {
    position: fixed;
    top: 16px;
    left: 146px; 
    gap: 10px;
    background-color: white;
    padding: 8px 10px;
    border-radius: 15px;
    z-index: 999;

    @media (max-width: 768px) {
      top: 14px;
      left: 18px;
      display: none;
    }
   
  }
`;
