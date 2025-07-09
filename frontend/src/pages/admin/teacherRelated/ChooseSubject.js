import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Table, TableBody, TableContainer, TableHead, Typography, Paper } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { getTeacherFreeClassSubjects } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';
import { GreenButton, PurpleButton } from '../../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false)

    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);

    useEffect(() => {
        // Route has been standardized to use params.id for the class ID.
        const classId = params.id;

        // This strict check prevents API calls with 'undefined' or invalid values
        // during the initial render cycles before react-router populates params.
        if (classId && classId !== 'undefined') {
            setClassID(classId);
            dispatch(getTeacherFreeClassSubjects(classId));

            if (params.teacherID) {
                setTeacherID(params.teacherID);
            }
        }
    }, [dispatch, params.id, params.teacherID]);

    if (loading) {
        return <div>Loading...</div>;
    } else if (response) {
        return <div>
            <h1>Sorry all subjects have teachers assigned already</h1>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <PurpleButton variant="contained"
                    onClick={() => navigate("/Admin/addsubject/" + classID)}>
                    Add Subjects
                </PurpleButton>
            </Box>
        </div>;
    } else if (error) {
        console.log(error)
    }

    const updateSubjectHandler = (teachSubject) => {
        const teacherId = params.teacherID;

        if (teacherId) {
            setLoader(true);
            dispatch(updateTeachSubject(teacherId, teachSubject));
            navigate("/Admin/teachers");
        } else {
            console.error("Teacher ID is missing from URL params.");
            // Optionally, show an error message to the user
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom component="div">
                Choose a subject
            </Typography>
            <>
                <TableContainer>
                    <Table aria-label="sclasses table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell align="center">Subject Name</StyledTableCell>
                                <StyledTableCell align="center">Subject Code</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 && subjectsList.map((subject, index) => (
                                <StyledTableRow key={subject._id}>
                                    <StyledTableCell component="th" scope="row" style={{ color: "white" }}>
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{subject.subName}</StyledTableCell>
                                    <StyledTableCell align="center">{subject.subCode}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {situation === "Norm" ?
                                            <GreenButton variant="contained"
                                                onClick={() => navigate("/Admin/teachers/addteacher/" + subject._id)}>
                                                Choose
                                            </GreenButton>
                                            :
                                            <GreenButton variant="contained"
                                                onClick={() => updateSubjectHandler({ subName: subject.subName, sessions: subject.sessions })}>
                                                Choose
                                            </GreenButton>}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        </Paper >
    );
};

export default ChooseSubject;