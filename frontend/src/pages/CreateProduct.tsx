import { Button, Col, Form, Input, InputNumber, message, Row } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RestService from "../services/RestService";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/userSlice";
import { Product } from "../types";

export default function CreateProduct() {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const user = useAppSelector(selectUser);
    const { productId }  = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [product, setProduct] = useState<Product>();

    useEffect(() => {
        if(productId) {
            setIsEditing(true);
            new RestService()
                .getProduct(Number(productId))
                .then(resp => {
                    setProduct(resp);
                    form.setFieldsValue(resp);
                }).catch(e => {
                    message.error(e.message || e.error);
                })
        }
    }, [productId, form])

    const onFinish = (values: any) => {
        if(isEditing && product) {
            setLoading(true);
            const newProduct = {
                ...product,
                ...values
            }
            return new RestService()
                .updateProduct(newProduct)
                .then(resp => {
                    setLoading(false);
                    message.success(`Product ${resp.productName} updated succesfully`);
                }).catch(e => {
                    setLoading(false);
                    message.error(e.message || e.error);
                })
        }
        if(user?.id && !isEditing) {
            setLoading(true);
            return new RestService().addProduct(values).then(resp => {
                message.success(`Product ${resp.productName} created succesfully`);
                setLoading(false);
                form.resetFields()
            }).catch(e => {
                setLoading(false);
                message.error(e.message || e.error);
            })
        }
        message.error("An error has occured.");
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
                            { isEditing ? "Update" : "Submit" }
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}