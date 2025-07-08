import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Card,
    Row,
    Col,
    Select,
    InputNumber,
    Typography,
    Space,
    message,
    Spin,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";

const { Title } = Typography;
const { Option } = Select;

const SubjectForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();

    const userState = useSelector((state) => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id;
    const adminID = currentUser._id;
    const address = "Subject";

    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        const fields = {
            sclassName,
            subjects: values.subjects,
            adminID,
        };

        setLoading(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === "added") {
            message.success("Subjects added successfully");
            navigate("/Admin/subjects");
            dispatch(underControl());
            setLoading(false);
        } else if (status === "failed") {
            message.error(response);
            setLoading(false);
        } else if (status === "error") {
            message.error("Network error");
            setLoading(false);
        }
    }, [status, navigate, response, dispatch, error]);

    return (
        <Card
            title={<Title level={3}>Add Subjects</Title>}
            style={{ maxWidth: 1400, margin: "auto", marginTop: 30 }}
        >
            <Form
                form={form}
                name="subjectForm"
                onFinish={onFinish}
                layout="vertical"
                autoComplete="off"
                
            >
                <Form.List name="subjects" initialValue={[{}]}>
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }, index) => (
                                <Card
                                    key={key}
                                    type="inner"
                                    title={`Subject ${index + 1}`}
                                    style={{ marginBottom: 24 }}
                                    extra={
                                        fields.length > 1 ? (
                                            <Button
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                            />
                                        ) : null
                                    }
                                >
                                    <Row gutter={24}>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "subName"]}
                                                label="Subject Name"
                                                rules={[{ required: true, message: "Please enter subject name" }]}
                                            >
                                                <Input placeholder="Subject name" style={{ height: 48 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "subCode"]}
                                                label="Subject Code"
                                                rules={[{ required: true, message: "Please enter subject code" }]}
                                            >
                                                <Input placeholder="Subject code" style={{ height: 48 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "sessions"]}
                                                label="Sessions"
                                                rules={[{ required: true, message: "Please enter number of sessions" }]}
                                            >
                                                <InputNumber min={1} style={{ width: "100%", height: 48 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "credits"]}
                                                label="Credits"
                                                rules={[{ required: true, message: "Please enter credits" }]}
                                            >
                                                <InputNumber min={1} style={{ width: "100%", height: 48 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "subjectType"]}
                                                label="Subject Type"
                                                rules={[{ required: true, message: "Please select subject type" }]}
                                            >
                                                <Select placeholder="Select type" style={{ height: 48 }}>
                                                    <Option value="theory">Theory</Option>
                                                    <Option value="practice">Practice</Option>
                                                    <Option value="integrated">Integrated</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "academicYear"]}
                                                label="Academic Year"
                                                rules={[{ required: true, message: "Please enter academic year" }]}
                                            >
                                                <Input placeholder="e.g. 2024-2025" style={{ height: 48 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "semester"]}
                                                label="Semester"
                                                rules={[{ required: true, message: "Please select semester" }]}
                                            >
                                                <Select placeholder="Select semester" style={{ height: 48 }}>
                                                    <Option value="semester1">Semester 1</Option>
                                                    <Option value="semester2">Semester 2</Option>
                                                    <Option value="summer">Summer</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "department"]}
                                                label="Department"
                                                rules={[{ required: true, message: "Please enter department" }]}
                                            >
                                                <Input placeholder="Department" style={{ height: 48 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "description"]}
                                                label="Description"
                                            >
                                                <Input.TextArea rows={2} placeholder="Optional description" style={{ height: 48 }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block style={{ height: 48,  backgroundColor: "#f0f5ff", borderColor: "#d9d9d9", color: "#000" }}>
                                    Add Subject
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Space style={{ float: "right" }}>
                        <Button type="primary" htmlType="submit" disabled={loading}>
                            {loading ? <Spin size="small" /> : "Save"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SubjectForm;
