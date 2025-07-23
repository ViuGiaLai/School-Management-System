import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Card,
  Empty,
  FloatButton,
  Modal,
  Dropdown,
  Menu
} from 'antd';
import {
  UserAddOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  FormOutlined,
  BarChartOutlined,
  ExclamationCircleOutlined,
  DownOutlined
} from '@ant-design/icons';
import Loader from '../../../components/Loader';

const { confirm } = Modal;

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentsList, loading, error, response } = useSelector((state) => state.student);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    confirm({
      title: 'Delete Confirmation',
      icon: <ExclamationCircleOutlined />,
      content: 'Sorry, the delete function has been disabled for now.',
      okText: 'OK',
      cancelText: 'Cancel',
      onOk() {
        message.info('Delete function is currently disabled');
      }
    });
    
    // Uncomment to enable actual deletion
    // dispatch(deleteUser(deleteID, address))
    //   .then(() => {
    //     dispatch(getAllStudents(currentUser._id));
    //   });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollNum',
      key: 'rollNum',
    },
    {
      title: 'Class',
      dataIndex: 'sclassName',
      key: 'sclassName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this student?"
            onConfirm={() => deleteHandler(record.id, "Student")}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => navigate("/Admin/students/student/" + record.id)}
          >
            View
          </Button>
          
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item 
                  key="attendance" 
                  icon={<FormOutlined />}
                  onClick={() => navigate("/Admin/students/student/attendance/" + record.id)}
                >
                  Take Attendance
                </Menu.Item>
                <Menu.Item 
                  key="marks" 
                  icon={<BarChartOutlined />}
                  onClick={() => navigate("/Admin/students/student/marks/" + record.id)}
                >
                  Provide Marks
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="primary">
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const data = studentsList?.map((student) => ({
    key: student._id,
    name: student.name,
    rollNum: student.rollNum,
    sclassName: student.sclassName?.sclassName || 'N/A',
    id: student._id,
  }));

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    message.error('Error loading students data');
    return (
      <Card>
        <Empty description="Error loading students data" />
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {response ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate("/Admin/addstudents")}
          >
            Add Students
          </Button>
        </div>
      ) : (
        <>
          {Array.isArray(studentsList) && studentsList.length > 0 ? (
            <Table
              columns={columns}
              dataSource={data}
              bordered
              pagination={{ pageSize: 10 }}
            />
          ) : (
            <Card>
              <Empty description="No students found">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/Admin/addstudents")}
                >
                  Add Students
                </Button>
              </Empty>
            </Card>
          )}
        </>
      )}

      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          icon={<UserAddOutlined />}
          tooltip="Add New Student"
          onClick={() => navigate("/Admin/addstudents")}
        />
        <FloatButton
          icon={<DeleteOutlined />}
          tooltip="Delete All Students"
          onClick={() => deleteHandler(currentUser._id, "Students")}
        />
      </FloatButton.Group>

      <Modal
        title="Notification"
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default ShowStudents;