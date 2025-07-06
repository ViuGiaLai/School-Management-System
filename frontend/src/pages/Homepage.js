import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import SchoolManagementSystem from "../assets/school-management-system.avif";
import { LightPurpleButton } from '../components/buttonStyles';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './Homepage.scss';
import { Padding } from '@mui/icons-material';

const Homepage = () => {
    const { t } = useTranslation();

    return (
        <>
            <LanguageSwitcher />
            <div className="homepage-wrapper">
                <div className="homepage-topbar">
                </div>

                <Container className="homepage-container">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <img
                                src={SchoolManagementSystem}
                                alt="School Management System"
                                style={{ width: '100%', }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="homepage-paper">

                                <h1 className="homepage-title">
                                    {t("homepage.title")}
                                </h1>

                                <p className="homepage-text">
                                    {t("homepage.description")}
                                </p>

                                <Box className="homepage-box">
                                    <Link to="/choose" className="homepage-link">
                                        <LightPurpleButton variant="contained" fullWidth>
                                            {t("button.login")}
                                        </LightPurpleButton>
                                    </Link>

                                    <Link to="/chooseasguest" className="homepage-link">
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" , padding: "10px 10px 10px"}}
                                        >
                                            {t("button.guest")}
                                        </Button>
                                    </Link>

                                    <p className="homepage-text">
                                        {t("form.noAccount")}{' '}
                                        <Link to="/Adminregister" style={{ color: "#550080" }}>
                                            {t("button.signup")}
                                        </Link>
                                    </p>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </>
    );
};

export default Homepage;
