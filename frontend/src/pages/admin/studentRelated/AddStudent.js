import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerStudent } from '../../../redux/studentRelated/studentHandle';
import { 
    selectRegisterStatus, 
    selectRegisterError, 
    resetRegisterStatus,
    selectAllStudents
} from '../../../redux/studentRelated/studentSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { Row, Col, Form, Input, Button, Select, DatePicker, Typography, message } from 'antd';
import Popup from '../../../components/Popup';

const { Title } = Typography;
const { Option } = Select;

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  
  const currentUser = useSelector(state => state.user.currentUser);
  const { sclassesList } = useSelector(state => state.sclass);
  const registerStatus = useSelector(selectRegisterStatus);
  const registerError = useSelector(selectRegisterError);
  const students = useSelector(selectAllStudents);
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const adminID = currentUser?._id;
  const role = 'Student';

  // Check if roll number already exists
  const isRollNumberExists = useCallback((rollNum) => {
    return students.some(student => student.rollNum === rollNum);
  }, [students]);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, 'Sclass'));
  }, [adminID, dispatch]);

  useEffect(() => {
    if (situation === 'Class') {
      form.setFieldValue('sclassName', params.id);
    }
  }, [params.id, situation, form]);

  useEffect(() => {
    // Fetch all students to check for duplicate roll numbers
    if (adminID) {
      dispatch(getAllSclasses(adminID, 'Sclass'));
    }
  }, [adminID, dispatch]);

  useEffect(() => {
    if (registerStatus === 'succeeded') {
      message.success('Student added successfully');
      dispatch(resetRegisterStatus());
      navigate(-1);
    } else if (registerStatus === 'failed') {
      setPopupMessage(registerError || 'Failed to add student');
      setShowPopup(true);
      setLoading(false);
    }
  }, [registerStatus, registerError, navigate, dispatch]);

  const onFinish = async (values) => {
    console.log('Form values:', values);
    
    if (!values.sclassName) {
      setPopupMessage('Please select a class');
      setShowPopup(true);
      return;
    }
    
    if (!adminID) {
      setPopupMessage('User not authenticated');
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);
      
      // Get the selected class to verify it exists
      const selectedClass = sclassesList?.find(cls => cls._id === values.sclassName);
      if (!selectedClass) {
        throw new Error('Selected class not found');
      }
      
      // Format the data as expected by the backend
      const studentData = {
        name: values.name.trim(),
        rollNum: Number(values.rollNum),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        sclassName: values.sclassName, // This is the ObjectId of the class
        adminID,
        school: adminID,
        role,
        gender: values.gender || undefined,
        dob: values.dob ? new Date(values.dob).toISOString() : undefined,
        address: values.address || undefined,
        phoneNumber: values.phoneNumber || undefined,
        academicYear: values.academicYear || undefined
      };
      
      console.log('Sending student data:', JSON.stringify(studentData, null, 2));
      
      const result = await dispatch(registerStudent(studentData));
      
      if (registerStudent.fulfilled.match(result)) {
        message.success('Student registered successfully');
        // Reset form and navigate
        form.resetFields();
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else {
        // Handle specific error cases
        const error = result.payload;
        if (error && error.errors) {
          // Handle validation errors
          const errorMessages = Array.isArray(error.errors) 
            ? error.errors.join('\n')
            : Object.values(error.errors || {}).map(err => err?.message || String(err)).join('\n');
          throw new Error(`Validation error: ${errorMessages}`);
        } else if (error && error.field && error.value) {
          // Handle duplicate key errors
          throw new Error(`A student with this ${error.field} (${error.value}) already exists.`);
        } else {
          // Generic error
          throw new Error(error?.message || 'Failed to register student');
        }
      }
    } catch (error) {
      console.error('Error registering student:', {
        message: error.message,
        stack: error.stack,
        ...(error.response && { response: error.response })
      });
      
      // Format error message for display
      let errorMessage = 'Failed to register student. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setPopupMessage(errorMessage);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
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
                <Input.Password placeholder="Enter Password" style={{ height: 48 }} autoComplete="new-password" />
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
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Student'}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Popup message={popupMessage} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddStudent;
