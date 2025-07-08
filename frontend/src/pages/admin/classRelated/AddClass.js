import React, { useEffect, useState } from "react";
import {
    Box, Button, CircularProgress, Stack, TextField, MenuItem, Typography
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import Classroom from "../../../assets/classroom.png";
import styled from "styled-components";

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");
    const [classCode, setClassCode] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [semester, setSemester] = useState("");
    const [department, setDepartment] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, tempDetails } = useSelector(state => state.user);
    const adminID = currentUser?._id;
    const address = "Sclass";

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const submitHandler = (event) => {
        event.preventDefault();

        // Trim input và validate
        const trimmedFields = {
            sclassName: sclassName.trim(),
            classCode: classCode.trim(),
            academicYear: academicYear.trim(),
            semester: semester.trim(),
            department: department.trim(),
            school: adminID
        };

        // Kiểm tra bắt buộc
        if (!trimmedFields.sclassName || !trimmedFields.classCode || !trimmedFields.academicYear || !trimmedFields.semester || !adminID) {
            setMessage("Please fill in all required fields.");
            setShowPopup(true);
            return;
        }

        setLoader(true);
        dispatch(addStuff(trimmedFields, address));
    };

    useEffect(() => {
        if (status === 'added' && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id);
            dispatch(underControl());
            setLoader(false);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch, tempDetails]);

    return (
        <>
            <StyledContainer>
                <StyledBox>
                    <Stack sx={{ alignItems: 'center', mb: 3 }}>
                        <img src={Classroom} alt="Classroom" style={{ width: '80%' }} />
                    </Stack>
                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <Typography variant="h5" textAlign="center">
                                Create New Class
                            </Typography>
                            <TextField
                                label="Class Name"
                                variant="outlined"
                                value={sclassName}
                                onChange={(e) => setSclassName(e.target.value)}
                                required
                            />
                            <TextField
                                label="Class Code"
                                variant="outlined"
                                value={classCode}
                                onChange={(e) => setClassCode(e.target.value)}
                                required
                            />
                            <TextField
                                label="Academic Year"
                                variant="outlined"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                                placeholder="e.g. 2024-2025"
                                required
                            />
                            <TextField
                                select
                                label="Semester"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                required
                            >
                                <MenuItem value="semester1">Semester 1</MenuItem>
                                <MenuItem value="semester2">Semester 2</MenuItem>
                                <MenuItem value="summer">Summer Semester</MenuItem>
                            </TextField>
                            <TextField
                                label="Department"
                                variant="outlined"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            />
                            <BlueButton
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                variant="contained"
                                type="submit"
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Create Class"}
                            </BlueButton>
                            <Button variant="outlined" onClick={() => navigate(-1)}>
                                Go Back
                            </Button>
                        </Stack>
                    </form>
                </StyledBox>
            </StyledContainer>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default AddClass;

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  max-width: 550px;
  padding: 50px 3rem 50px;
  margin-top: 1rem;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  border-radius: 4px;
`;
