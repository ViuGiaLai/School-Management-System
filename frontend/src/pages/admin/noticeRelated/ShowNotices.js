import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
  Table,
  Button,
  Space,
  Card,
  Empty,
  FloatButton,
  Popconfirm,
  message,
  Modal
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Loader from '../../../components/Loader';

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { noticesList, loading, error, response } = useSelector((state) => state.notice);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getAllNotices(currentUser._id, "Notice"));
  }, [currentUser._id, dispatch]);

  const deleteHandler = (deleteID, address) => {
    Modal.confirm({
      title: 'Confirm Delete',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this notice?',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { danger: true },
      onOk() {
        dispatch(deleteUser(deleteID, address))
          .then(() => {
            dispatch(getAllNotices(currentUser._id, "Notice"));
            message.success('Notice deleted successfully');
          })
          .catch(() => {
            message.error('Failed to delete notice');
          });
      }
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this notice?"
            onConfirm={() => deleteHandler(record.id, "Notice")}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = noticesList?.map((notice) => {
    const date = new Date(notice.date);
    const dateString = date.toString() !== "Invalid Date" 
      ? date.toISOString().substring(0, 10) 
      : "Invalid Date";
      
    return {
      key: notice._id,
      title: notice.title,
      details: notice.details,
      date: dateString,
      id: notice._id,
    };
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    message.error('Error loading notices');
    return (
      <Card>
        <Empty description="Error loading notices" />
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
            onClick={() => navigate("/Admin/addnotice")}
          >
            Add Notice
          </Button>
        </div>
      ) : (
        <>
          {Array.isArray(noticesList) && noticesList.length > 0 ? (
            <Table
              columns={columns}
              dataSource={data}
              bordered
              pagination={{ pageSize: 10 }}
            />
          ) : (
            <Card>
              <Empty description="No notices found">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/Admin/addnotice")}
                >
                  Add Notice
                </Button>
              </Empty>
            </Card>
          )}
        </>
      )}

      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          icon={<PlusOutlined />}
          tooltip="Add New Notice"
          onClick={() => navigate("/Admin/addnotice")}
        />
        <FloatButton
          icon={<DeleteOutlined />}
          tooltip="Delete All Notices"
          onClick={() => deleteHandler(currentUser._id, "Notices")}
        />
      </FloatButton.Group>
    </div>
  );
};

export default ShowNotices;