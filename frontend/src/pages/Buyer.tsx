import { Button, Col, Form, Row, InputNumber, message } from "antd";
import RestService from "../services/RestService";
import { setFormErrors } from "../utils/utils";
import { AppActionType, AppComponentProps } from "../types";


export default function Buyer({ state, dispatch }: AppComponentProps) {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        new RestService().deposit(values.deposit).then(resp => {
            dispatch({
                type: AppActionType.STORE_USER,
                payload: resp
            });

            message.success("Successfully deposited " + values.deposit);
            form.resetFields();
        })
        .catch(e => {
            if(e) {
                setFormErrors(form, e);
            }
        })
    }

    const resetDeposit = () => {
        new RestService().resetDeposit().then(resp => {
            dispatch({
                type: AppActionType.STORE_USER,
                payload: resp
            });

            message.success("Successfully reset deposit");
        })
        .catch(e => {
            if(e) {
                setFormErrors(form, e);
            }
        })
    }


    return (
        <Row justify={"center"} align={"middle"}>
            <Col sm={24} xs={24} md={12} lg={8}>
                <ul>
                    <li>Username: {state?.user?.username}</li>
                    <li>Deposit: {state?.user?.deposit}</li>
                    <li>Role: {state?.user?.roleName}</li>
                    <li>
                        <Button
                            type="primary"
                            onClick={resetDeposit}
                        >
                            Reset deposit to 0
                        </Button>
                    </li>
                </ul>
            </Col>
            <Col sm={24} xs={24} md={12} lg={8}>
                <Form
                    name="login"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Amount"
                        name="deposit"
                        rules={[{ required: true }]}
                    >
                        <InputNumber width={"100%"} placeholder="Enter amount in 5, 10, 20, 50, 100" />
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