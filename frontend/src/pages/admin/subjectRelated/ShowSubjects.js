import React, { useEffect, useState } from 'react';
import {
  Table,
  Space,
  Button,
  Popconfirm,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import Loader from '../../../components/Loader';

const { Title } = Typography;

const ShowSubjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subjectsList, loading } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getSubjectList(currentUser._id, 'AllSubjects'));
    }
  }, [dispatch, currentUser._id]);

  const handleDelete = async (id, isAll = false) => {
    try {
      setDeleting(true);
      await dispatch(deleteUser(id, isAll ? 'Subjects' : 'Subject'));
      dispatch(getSubjectList(currentUser._id, 'AllSubjects'));
      message.success('Deleted successfully');
    } catch (err) {
      message.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      title: 'Subject Name',
      dataIndex: 'subName',
      key: 'subName',
    },
    {
      title: 'Sessions',
      dataIndex: 'sessions',
      key: 'sessions',
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
          <Button
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(`/Admin/subjects/subject/${record.sclassID}/${record.id}`)
            }
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure to delete this subject?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleting} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = subjectsList?.map((subject) => ({
    key: subject._id,
    id: subject._id,
    subName: subject.subName,
    sessions: subject.sessions,
    sclassName: subject?.sclassName?.sclassName || 'N/A',
    sclassID: subject?.sclassName?._id,
  }));

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Subjects</Title>

      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/Admin/subjects/chooseclass')}
        >
          Add New Subject
        </Button>

        <Popconfirm
          title="Are you sure you want to delete all subjects?"
          onConfirm={() => handleDelete(currentUser._id, true)}
        >
          <Button danger icon={<DeleteOutlined />} loading={deleting}>
            Delete All Subjects
          </Button>
        </Popconfirm>
      </Space>

      {loading ? (
        <Loader />
      ) : (
        <Table columns={columns} dataSource={data} bordered />
      )}
    </div>
  );
};

export default ShowSubjects;
