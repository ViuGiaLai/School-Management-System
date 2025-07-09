import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { Row, Col, Form, Input, Button, Select, DatePicker, Typography, message, Spin } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const AddTeacher = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const subjectID = params.id;

  const { status, response, error } = useSelector(state => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, 'Subject'));
  }, [dispatch, subjectID]);

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl());
      message.success('Teacher added successfully');
      navigate('/Admin/teachers');
    } else if (status === 'failed') {
      setPopupMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setPopupMessage('Network Error');
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, response, error, dispatch]);

  const onFinish = (values) => {
    setLoader(true);
    const role = 'Teacher';
    const school = subjectDetails?.school;
    const teachSubject = subjectDetails?._id;
    const teachSclass = subjectDetails?.sclassName?._id;

    const fields = {
      ...values,
      role,
      school,
      teachSubject,
      teachSclass,
    };
    dispatch(registerUser(fields, role));
  };

  return (
    <>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 8 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Add Teacher</Title>
        <Typography style={{ textAlign: 'center', marginBottom: 24 }}>
          Subject: {subjectDetails?.subName} | Class: {subjectDetails?.sclassName?.sclassName}
        </Typography>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            {/* Cột trái */}
            <Col xs={24} sm={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter teacher name' }]}>
                <Input placeholder="Enter name" style={{ height: 48 }} />
              </Form.Item>

              <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                <Input placeholder="Enter Email" style={{ height: 48 }} />
              </Form.Item>

              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
                <Input.Password placeholder="Enter Password" style={{ height: 48 }} autoComplete="new-password" />
              </Form.Item>

              <Form.Item label="Phone Number" name="phoneNumber">
                <Input placeholder="Enter phone number" style={{ height: 48 }} />
              </Form.Item>
            </Col>

            {/* Cột phải */}
            <Col xs={24} sm={12}>
              <Form.Item label="Date of Birth" name="dob">
                <DatePicker style={{ width: '100%', height: 48 }} />
              </Form.Item>

              <Form.Item label="Gender" name="gender">
                <Select placeholder="Select Gender" style={{ height: 48 }}>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Address" name="address">
                <Input placeholder="Enter Address" style={{ height: 48 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" size="large" disabled={loader}>
              {loader ? <Spin /> : 'Add Teacher'}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Popup message={popupMessage} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddTeacher;