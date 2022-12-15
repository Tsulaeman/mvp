import { Button, Col, Form, Row, Input } from "antd";
import RestService from "../services/RestService";
import { setFormErrors } from "../utils/utils";
import { AppActionType, AppComponentProps } from "../types";
import { useNavigate } from "react-router-dom";


export default function Login({ state, dispatch }: AppComponentProps) {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        new RestService().login(values).then(resp => {
            dispatch({
                type: AppActionType.STORE_AUTH,
                payload: resp
            });
            localStorage.setItem('token', resp.access_token);
            navigate(`/`);
        })
        .catch(e => {
            if(e) {
                setFormErrors(form, e);
            }
        })
    }

    return (
        <Row justify={"center"} align={"middle"}>
            <Col sm={24} xs={24} md={12} lg={12}>
                <h2 style={{ textAlign: "center" }}>Login</h2>
                <Form
                    name="login"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
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