import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import { Card, Descriptions, Spin } from 'antd';
import styled from 'styled-components';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    return (
        <>
            {loading ? (
                <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
            ) : error ? (
                <div style={{ textAlign: 'center', color: 'red', marginTop: 32 }}>Error loading teacher details. Please try again.</div>
            ) : (
                <StyledCard
                    title={<span style={{ fontSize: '1.5rem', fontWeight: 700 }}>Teacher Details</span>}
                    bordered
                >
                    <StyledDescriptions column={1} bordered size="middle">
                        <Descriptions.Item label="Name">{teacherDetails?.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{teacherDetails?.email}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number">{teacherDetails?.phoneNumber || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Gender">{teacherDetails?.gender || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">{teacherDetails?.dob ? new Date(teacherDetails.dob).toLocaleDateString() : "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Address">{teacherDetails?.address || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Class Name">{teacherDetails?.teachSclass?.sclassName || "N/A"}</Descriptions.Item>
                        {teacherDetails?.teachSubject ? (
                            <>
                                <Descriptions.Item label="Subject Name">{teacherDetails.teachSubject.subName}</Descriptions.Item>
                                <Descriptions.Item label="Subject Sessions">{teacherDetails.teachSubject.sessions}</Descriptions.Item>
                            </>
                        ) : (
                            <Descriptions.Item label="Subject">
                                <Button variant="contained" onClick={handleAddSubject} disabled={!teacherDetails?.teachSclass?._id}>
                                    Add Subject
                                </Button>
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label="School">{teacherDetails?.school?.schoolName || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Role">{teacherDetails?.role}</Descriptions.Item>
                    </StyledDescriptions>
                </StyledCard>
            )}
        </>
    );
};


const StyledCard = styled(Card)`
  width: 100%;
  max-width: 900px;
  margin: 32px auto;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
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
    border-radius: 8px;
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
  }
  .ant-descriptions-item-content {
    font-size: 1.1rem;
    word-break: break-word;
  }
  @media (max-width: 700px) {
    .ant-descriptions-row {
      display: block;
    }
    .ant-descriptions-item {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
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
  }
`;

export default TeacherDetails;
