import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { Row, Col, Form, Input, Button, Select, DatePicker, Typography, message, Spin } from 'antd';
import Popup from '../../../components/Popup';

const { Title } = Typography;
const { Option } = Select;

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector(state => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList } = useSelector(state => state.sclass);

  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const adminID = currentUser._id;
  const role = 'Student';

  useEffect(() => {
    dispatch(getAllSclasses(adminID, 'Sclass'));
  }, [adminID, dispatch]);

  useEffect(() => {
    if (situation === 'Class') {
      form.setFieldValue('sclassName', params.id);
    }
  }, [params.id, situation, form]);

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl());
      message.success('Student added successfully');
      navigate(-1);
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
    if (!values.sclassName) {
      setPopupMessage('Please select a class');
      setShowPopup(true);
      return;
    }
    setLoader(true);
    const fields = {
      ...values,
      sclassName: values.sclassName,
      adminID,
      role,
      attendance: [],
    };
    dispatch(registerUser(fields, role));
  };

  return (
    <>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 8 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Add Student</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            {/* Cột trái */}
            <Col xs={24} sm={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input placeholder="Enter name" style={{ height: 48 }} />
              </Form.Item>

              {situation === 'Student' && (
                <Form.Item label="Class" name="sclassName" rules={[{ required: true }]}>
                  <Select placeholder="Select Class" style={{ height: 48 }}>
                    {sclassesList.map((cls) => (
                      <Option key={cls._id} value={cls._id}>{cls.sclassName}</Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item label="Roll Number" name="rollNum" rules={[{ required: true }]}>
                <Input type="number" placeholder="Enter Roll Number" style={{ height: 48 }} />
              </Form.Item>

              <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                <Input.Password placeholder="Enter Password" style={{ height: 48 }} />
              </Form.Item>

              <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="Enter Email" style={{ height: 48 }} />
              </Form.Item>

              <Form.Item label="Phone Number" name="phoneNumber">
                <Input placeholder="Enter phone number" style={{ height: 48 }} />
              </Form.Item>
            </Col>

            {/* Cột phải */}
            <Col xs={24} sm={12}>
              <Form.Item label="Date of Birth" name="dob" >
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

              <Form.Item label="Academic Year" name="academicYear">
                <Input placeholder="e.g. 2023-2027" style={{ height: 48 }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Hàng cuối */}
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" size="large" disabled={loader}>
              {loader ? <Spin /> : 'Add Student'}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Popup message={popupMessage} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddStudent;
