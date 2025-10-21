// src/pages/ChooseUser.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import LanguageSwitcher from '../components/LanguageSwitcher';
import BackButton from '../components/BackButton';
import { useTranslation } from 'react-i18next';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = '123456';

  const { status, currentUser, currentRole } = useSelector((state) => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const { t } = useTranslation();

  const navigateHandler = (user) => {
    if (user === 'Admin') {
      if (visitor === 'guest') {
        const email = 'admin@gmail.com';
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Adminlogin');
      }
    } else if (user === 'Student') {
      if (visitor === 'guest') {
        const rollNum = '2005';
        const email = 'student@gmail.com';
        const fields = { rollNum, email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Studentlogin');
      }
    } else if (user === 'Teacher') {
      if (visitor === 'guest') {
        const email = 'teacher@gmail.com';
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Teacherlogin');
      }
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'error') {
      setLoader(false);
      setMessage('Network Error');
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <Container>
        <TopControls>
          <BackButton />
          <LanguageSwitcher />
        </TopControls>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <CardWrapper onClick={() => navigateHandler('Admin')}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <AccountCircle fontSize="large" color="primary" />
                </Box>
                <StyledTitle>{t('chooseuser.admin')}</StyledTitle>
                <StyledDesc>{t('chooseuser.adminDesc')}</StyledDesc>
              </StyledPaper>
            </CardWrapper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CardWrapper onClick={() => navigateHandler('Student')}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <School fontSize="large" color="success" />
                </Box>
                <StyledTitle>{t('chooseuser.student')}</StyledTitle>
                <StyledDesc>{t('chooseuser.studentDesc')}</StyledDesc>
              </StyledPaper>
            </CardWrapper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CardWrapper onClick={() => navigateHandler('Teacher')}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <Group fontSize="large" color="secondary" />
                </Box>
                <StyledTitle>{t('chooseuser.teacher')}</StyledTitle>
                <StyledDesc>{t('chooseuser.teacherDesc')}</StyledDesc>
              </StyledPaper>
            </CardWrapper>
          </Grid>
        </Grid>
      </Container>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  min-height: 100vh;
  display: flex;
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const CardWrapper = styled.div`
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledPaper = styled(Paper)`
  padding: 24px;
  text-align: center;
  background-color: #fff;
  color: #333;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
`;

const StyledTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 8px;
  font-weight: 600;
  color: #550080;
`;

const StyledDesc = styled.p`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.4;
`;
