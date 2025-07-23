import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import {
  Table,
  Button,
  Dropdown,
  Menu,
  Space,
  Popconfirm,
  message,
  Card,
  Empty,
  FloatButton,
  Modal
} from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  UserAddOutlined,
  BookOutlined,
  DownOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Loader from '../../../components/Loader';

const { confirm } = Modal;

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    confirm({
      title: 'Are you sure you want to delete this class?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch(deleteUser(deleteID, address))
          .then(() => {
            dispatch(getAllSclasses(adminID, "Sclass"));
            message.success('Class deleted successfully');
          })
          .catch(() => {
            message.error('Failed to delete class');
          });
      }
    });
  };

  const columns = [
    {
      title: 'Class Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Dropdown 
            overlay={
              <Menu>
                <Menu.Item 
                  key="addSubject" 
                  icon={<BookOutlined />}
                  onClick={() => navigate("/Admin/addsubject/" + record.id)}
                >
                  Add Subjects
                </Menu.Item>
                <Menu.Item 
                  key="addStudent" 
                  icon={<UserAddOutlined />}
                  onClick={() => navigate("/Admin/class/addstudents/" + record.id)}
                >
                  Add Student
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="primary">
              Add <DownOutlined />
            </Button>
          </Dropdown>
          
          <Popconfirm
            title="Are you sure to delete this class?"
            onConfirm={() => deleteHandler(record.id, "Sclass")}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => navigate("/Admin/classes/class/" + record.id)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const data = sclassesList?.map((sclass) => ({
    key: sclass._id,
    name: sclass.sclassName,
    id: sclass._id,
  }));

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    message.error('Error loading classes data');
    return (
      <Card>
        <Empty description="Error loading classes data" />
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px',marginTop: '0px'  }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate("/Admin/addclass")}
        >
          Add Class
        </Button>
      </div>

      {Array.isArray(sclassesList) && sclassesList.length > 0 ? (
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <Card>
          <Empty description="No classes found">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate("/Admin/addclass")}
            >
              Add Class
            </Button>
          </Empty>
        </Card>
      )}

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

export default ShowClasses;