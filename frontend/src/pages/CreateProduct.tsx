import { Button, Col, Form, Input, InputNumber, message, Row, Table, TableColumnsType } from "antd";
import { useState } from "react";
import RestService from "../services/RestService";
import { AppComponentProps } from "../types";

export default function CreateProduct({ state, dispatch }: AppComponentProps) {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        if(state?.user?.id) {
            setLoading(true);
            new RestService().addProduct(values).then(resp => {
                setLoading(false);
                form.resetFields()
            }).catch(e => {
                setLoading(false);
                message.error(e.message || e.error);
            })
        }
    }

    return (
        <Row
            justify={"center"}
            align="middle"
            gutter={[30, 30]}
            style={{ padding: "20px 40px" }}
        >
            <Col span={12}>
                <Form
                    name="product"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Product Name"
                        name="productName"
                        rules={[{ required: true, type: 'string' }]}
                    >
                        <Input placeholder="Enter name" />
                    </Form.Item>

                    <Form.Item
                        label="Amount Available"
                        name="amountAvailable"
                        rules={[{ required: true, type: 'number' }]}
                    >
                        <InputNumber placeholder="Enter amount" />
                    </Form.Item>

                    <Form.Item
                        label="Cost"
                        name="cost"
                        rules={[{ required: true, type: 'number' }]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            loading={loading}
                            type="primary"
                            htmlType="submit"
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}