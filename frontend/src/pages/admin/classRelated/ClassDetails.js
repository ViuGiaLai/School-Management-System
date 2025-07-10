import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Container, Typography, Tab, IconButton
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Card, Descriptions, Spin } from 'antd';
import styled from 'styled-components';


const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getClassStudents(classID));
        //         dispatch(resetSubjects())
        //         dispatch(getSubjectList(classID, "ClassSubjects"))
        //     })
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 && subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${classID}/${row.id}`)
                    }}
                >
                    View
                </BlueButton >
            </>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/addsubject/" + classID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(classID, "SubjectsClass")
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <>
                {response ?
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                        >
                            Add Subjects
                        </GreenButton>
                    </Box>
                    :
                    <>
                        <Typography variant="h5" gutterBottom>
                            Subjects List:
                        </Typography>

                        <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        <SpeedDialTemplate actions={subjectActions} />
                    </>
                }
            </>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/students/student/attendance/" + row.id)
                    }
                >
                    Attendance
                </PurpleButton>
            </>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(classID, "StudentsClass")
        },
    ];

    const ClassStudentsSection = () => {
        return (
            <>
                {getresponse ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            >
                                Add Students
                            </GreenButton>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Students List:
                        </Typography>

                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </>
        )
    }

    const ClassTeachersSection = () => {
        return (
            <>
                Teachers
            </>
        )
    }

    const ClassDetailsSection = () => (
        <StyledCard
            title={<span style={{ fontSize: '1.5rem', fontWeight: 700 }}>Class Details</span>}
            bordered
        >
            <StyledDescriptions column={1} bordered size="middle">
                <Descriptions.Item label="Class Name">{sclassDetails?.sclassName || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Class Code">{sclassDetails?.classCode || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Academic Year">{sclassDetails?.academicYear || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Semester">
                    {sclassDetails?.semester === "semester1"
                        ? "Semester 1"
                        : sclassDetails?.semester === "semester2"
                        ? "Semester 2"
                        : sclassDetails?.semester === "summer"
                        ? "Summer"
                        : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Department">{sclassDetails?.department || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Homeroom Teacher">{sclassDetails?.homeroomTeacher?.name || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Number of Subjects">{subjectsList?.length || 0}</Descriptions.Item>
                <Descriptions.Item label="Number of Students">{sclassStudents?.length || 0}</Descriptions.Item>
                <Descriptions.Item label="Status">{sclassDetails?.status || "N/A"}</Descriptions.Item>
                {sclassDetails?.notes && (
                    <Descriptions.Item label="Notes">{sclassDetails.notes}</Descriptions.Item>
                )}
                <Descriptions.Item label="">
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                        {getresponse && (
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            >
                                Add Students
                            </GreenButton>
                        )}
                        {response && (
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/addsubject/" + classID)}
                            >
                                Add Subjects
                            </GreenButton>
                        )}
                    </Box>
                </Descriptions.Item>
            </StyledDescriptions>
        </StyledCard>
    );


    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1', }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Subjects" value="2" />
                                    <Tab label="Students" value="3" />
                                    <Tab label="Teachers" value="4" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <ClassDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <ClassSubjectsSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <ClassStudentsSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    <ClassTeachersSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};


const StyledCard = styled(Card)`
  width: 100%;
  max-width: 900px;
  margin: 32px auto;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  background: #fff;
  @media (max-width: 900px) {
    max-width: 98vw;
    min-width: unset;
    padding: 0;
    .ant-card-head {
      padding: 0 8px;
    }
  }
  @media (max-width: 600px) {
    margin: 12px auto;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    .ant-card-head-title {
      font-size: 1.1rem !important;
      padding: 0 4px;
    }
  }
`;

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    font-weight: 600;
    font-size: 1.1rem;
    padding: 8px 0;
  }
  .ant-descriptions-item-content {
    font-size: 1.1rem;
    word-break: break-word;
    padding: 8px 0;
  }
  @media (max-width: 700px) {
    .ant-descriptions-row {
      display: block;
    }
    .ant-descriptions-item {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .ant-descriptions-item-label, .ant-descriptions-item-content {
      font-size: 1rem;
      padding: 2px 0;
    }
  }
  @media (max-width: 500px) {
    .ant-descriptions-item-label, .ant-descriptions-item-content {
      font-size: 0.95rem;
      padding: 1px 0;
    }
    .ant-descriptions-item {
      padding: 4px 0;
    }
    .ant-descriptions-view {
      padding: 0 2px;
    }
  }
`;

export default ClassDetails;