import { Button, Col, Form, Row, Input, Radio } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useMemo, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import RestService from "../services/RestService";
import { AppActionType, AppComponentProps, AppConfig, RoleName } from "../types";
import { setFormErrors } from "../utils/utils";

export default function Register({ state, dispatch }: AppComponentProps) {

    const [form] = useForm();
    const navigate = useNavigate();

    const RestServiceClient = useMemo(() => new RestService(), []);
    const [config, setConfig] = useState<AppConfig>();

    useEffect(() => {
        RestServiceClient.config().then(resp => {
            setConfig(resp);
        });
    }, [RestServiceClient]);

    const onFinish = (values: any) => {
        RestServiceClient.register(values)
            .then((user) => {
                dispatch({
                    type: AppActionType.STORE_USER,
                    payload: user
                });
                return user;
            })
            // Log the user in
            .then(user => {

                return RestServiceClient.login({
                    username: values.username,
                    password: values.password
                }).then(resp => {
                    dispatch({
                        type: AppActionType.STORE_AUTH,
                        payload: resp
                    });
                    navigate(`/`);
                })
            })
            .catch(e => {
                setFormErrors(form, e);
            })
    }

    return (
        <Row justify={"center"} align={"middle"}>
            <Col sm={24} xs={24} md={12} lg={12}>
            <h2 style={{ textAlign: "center" }}>Create an account</h2>
            <Form
                name="register"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true }]}
                >
                    <Radio.Group>
                        <Radio value={config?.roles.buyer}>
                            {RoleName.BUYER}
                        </Radio>
                        <Radio value={config?.roles.seller}>
                            {RoleName.SELLER}
                        </Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}