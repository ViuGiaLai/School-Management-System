import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
  Table,
  Button,
  Typography,
  Space,
  Popconfirm,
  message,
  Pagination,
  FloatButton,
  Modal,
  Card,
  Empty
} from 'antd';
import {
  UserAddOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Loader from '../../../components/Loader';

const { Column } = Table;
const { confirm } = Modal;

const ShowTeachers = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {                    
    let schoolId = undefined;
    if (currentUser?.school?._id) {
      schoolId = currentUser.school._id;
    } else if (currentUser?.school && typeof currentUser.school === 'string') {
      schoolId = currentUser.school;
    } else if (currentUser?._id) {
      schoolId = currentUser._id;
    }
    
    if (schoolId) {
      dispatch(getAllTeachers(schoolId));
    } else {
      setModalMessage('No school ID found for current user!');
      setIsModalVisible(true);
    }
  }, [currentUser, dispatch]);

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
    // dispatch(deleteUser(deleteID, address)).then(() => {
    //     dispatch(getAllTeachers(currentUser._id));
    // });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Subject',
      dataIndex: 'teachSubject',
      key: 'teachSubject',
      render: (value, record) => (
        value ? value : (
          <Button
            type="primary"
            disabled={!record.teachSclassID}
            onClick={() => navigate(`/Admin/teachers/choosesubject/${record.teachSclassID}/${record.id}`)}
          >
            Add Subject
          </Button>
        )
      ),
    },
    {
      title: 'Class',
      dataIndex: 'teachSclass',
      key: 'teachSclass',
      render: (value) => value || 'N/A'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this teacher?"
            onConfirm={() => deleteHandler(record.id, "Teacher")}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => navigate("/Admin/teachers/teacher/" + record.id)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const data = teachersList.map((teacher) => ({
    key: teacher._id,
    name: teacher.name,
    teachSubject: teacher.teachSubject?.subName || null,
    teachSclass: teacher.teachSclass?.sclassName,
    teachSclassID: teacher.teachSclass?._id,
    id: teacher._id,
  }));

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    return <div>Error loading data: {error}</div>;
  }

  if (teachersList.length === 0) {
    return (
      <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Empty description="No teachers found">
          <Button 
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => navigate("/Admin/teachers/chooseclass")}
          >
            Add Teacher
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: data.length,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '25', '100'],
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        scroll={{ x: true }}
      />

      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          icon={<UserAddOutlined />}
          tooltip="Add New Teacher"
          onClick={() => navigate("/Admin/teachers/chooseclass")}
        />
        <FloatButton
          icon={<DeleteOutlined />}
          tooltip="Delete All Teachers"
          onClick={() => deleteHandler(currentUser._id, "Teachers")}
        />
      </FloatButton.Group>

      <Modal
        title="Notification"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default ShowTeachers;