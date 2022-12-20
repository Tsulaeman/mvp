import { Button, Col, Form, Row, Input } from "antd";
import RestService from "../services/RestService";
import { setFormErrors } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { login, loginFailure, loginSuccess } from "../store/authSlice";


export default function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onFinish = (values: any) => {
        dispatch(login());
        new RestService().login(values).then(resp => {
            localStorage.setItem('token', resp.access_token);
            dispatch(loginSuccess(resp));
            navigate(`/`);
        })
        .catch(e => {
            dispatch(loginFailure());
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