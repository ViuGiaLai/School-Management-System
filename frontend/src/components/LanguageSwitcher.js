import React from 'react';
import i18n from '../i18n';
import {
  FormControl,
  Select,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import styled from 'styled-components';

import vnFlag from '../assets/flags/vn.png';
import usFlag from '../assets/flags/us.png';

const LanguageSwitcher = () => {
  const currentLang = i18n.resolvedLanguage || 'vi';

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const renderSelected = (lang) => {
    const flag = lang === 'vi' ? vnFlag : usFlag;
    const label = lang === 'vi' ? 'Tiếng Việt' : 'English';
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <img src={flag} alt={lang} width="20" />
        <Typography variant="body2">{label}</Typography>
      </Stack>
    );
  };

  return (
    <LanguageSwitcherWrapper>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Select
          value={currentLang}
          onChange={handleChange}
          renderValue={(selected) => renderSelected(selected)}
          displayEmpty
          variant="outlined"
          sx={{ fontSize: 14 }}
        >
          <MenuItem value="en">{renderSelected('en')}</MenuItem>
          <MenuItem value="vi">{renderSelected('vi')}</MenuItem>
        </Select>
      </FormControl>
    </LanguageSwitcherWrapper>
  );
};

export default LanguageSwitcher;

export const LanguageSwitcherWrapper = styled.div`
  position: fixed;
  top: 10px;
  right: 16px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 2px;
  background-color: rgb(255, 255, 255);

  @media (max-width: 768px) {
    top: 10px;
    width: 170px;
  }
`;
