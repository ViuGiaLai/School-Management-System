import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { Descriptions, Tabs, Typography, Card, Button, Divider } from 'antd';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

const { TabPane } = Tabs;
const { Title } = Typography;

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params;

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  const [selectedSection, setSelectedSection] = useState('attendance');

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ];

  const studentRows = sclassStudents.map((student) => ({
    rollNum: student.rollNum,
    name: student.name,
    id: student._id,
  }));

  const StudentsAttendanceButtonHaver = ({ row }) => (
    <>
      <BlueButton onClick={() => navigate("/Admin/students/student/" + row.id)}>View</BlueButton>
      <PurpleButton onClick={() => navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)}>Take Attendance</PurpleButton>
    </>
  );

  const StudentsMarksButtonHaver = ({ row }) => (
    <>
      <BlueButton onClick={() => navigate("/Admin/students/student/" + row.id)}>View</BlueButton>
      <PurpleButton onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>Provide Marks</PurpleButton>
    </>
  );

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <Card>
        <Title level={3}>Subject Details</Title>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Subject Name">{subjectDetails?.subName}</Descriptions.Item>
          <Descriptions.Item label="Subject Code">{subjectDetails?.subCode}</Descriptions.Item>
          <Descriptions.Item label="Sessions">{subjectDetails?.sessions}</Descriptions.Item>
          <Descriptions.Item label="Credits">{subjectDetails?.credits}</Descriptions.Item>
          <Descriptions.Item label="Subject Type">{subjectDetails?.subjectType}</Descriptions.Item>
          <Descriptions.Item label="Academic Year">{subjectDetails?.academicYear}</Descriptions.Item>
          <Descriptions.Item label="Semester">{subjectDetails?.semester}</Descriptions.Item>
          <Descriptions.Item label="Department">{subjectDetails?.department}</Descriptions.Item>
          {subjectDetails?.description && (
            <Descriptions.Item label="Description">{subjectDetails.description}</Descriptions.Item>
          )}
          <Descriptions.Item label="Number of Students">{numberOfStudents}</Descriptions.Item>
          <Descriptions.Item label="Class Name">{subjectDetails?.sclassName?.sclassName}</Descriptions.Item>
          <Descriptions.Item label="Teacher">
            {subjectDetails?.teacher ? subjectDetails.teacher.name : (
              <GreenButton onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}>
                Add Subject Teacher
              </GreenButton>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  const SubjectStudentsSection = () => (
    <Card>
      <Title level={4}>Students List</Title>
      <Divider />
      <Button
        type="primary"
        style={{ float: 'right', marginBottom: 16 }}
        onClick={() => navigate("/Admin/class/addstudents/" + classID)}
      >
        Add Students
      </Button>
      <Tabs defaultActiveKey="attendance" onChange={(key) => setSelectedSection(key)}>
        <TabPane tab="Attendance" key="attendance">
          <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
        </TabPane>
        <TabPane tab="Marks" key="marks">
          <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
        </TabPane>
      </Tabs>
    </Card>
  );

  return subloading ? (
    <div>Loading...</div>
  ) : (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="Details" key="1">
        <SubjectDetailsSection />
      </TabPane>
      <TabPane tab="Students" key="2">
        <SubjectStudentsSection />
      </TabPane>
    </Tabs>
  );
};

export default ViewSubject;
