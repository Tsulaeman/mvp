import { Button, Col, Form, InputNumber, message, Modal, Row, Table, TableColumnsType } from "antd";
import { useEffect, useMemo, useState } from "react";
import RestService from "../services/RestService";
import { AppActionType, AppComponentProps, AuthUser, LaravelPagination, Product, RoleName } from "../types";

export default function Seller({ state, dispatch }: AppComponentProps) {
    const [dataSource, setDataSource] = useState<LaravelPagination<Product[]>>();
    const [form] = Form.useForm();

    const client = useMemo(() => new RestService(), []);

    useEffect(() => {
        client.getProducts().then(resp => {
            setDataSource(resp);
        }).catch(e => {
            message.error(e.message || e.error);
        });
    }, [client]);

    const columns: TableColumnsType<Product> =[
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName"
        },{
            title: "Cost",
            dataIndex: "cost",
            key: "cost"
        },{
            title: "Amount Available",
            dataIndex: "amountAvailable",
            key: "amountAvailable"
        },{
            title: "",
            key: "buy",
            render: (value, record) => {
                return (
                    <>
                    { state?.user?.roleName === RoleName.BUYER &&
                        <Button
                            onClick={() => {
                                Modal.confirm({
                                    title: `Buy ${record.productName}`,
                                    content: (
                                        <>
                                            <Form
                                                form={form}
                                            >
                                                <Form.Item
                                                    name={"amount"}
                                                    label={"Amount"}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            max: record.amountAvailable,
                                                            min: 1,
                                                            type: 'number'
                                                        }
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Enter the amount you want to buy"
                                                    />
                                                </Form.Item>
                                            </Form>
                                            {/* <div>
                                                Total: { total }
                                            </div> */}
                                        </>

                                    ),
                                    onOk() {
                                        form.submit();
                                        return form.validateFields().then(values => {
                                            client.buyProduct(record.id, values.amount)
                                            .then(resp => {
                                                message.success(`Successfully bought ${record.productName}`);
                                                if(dataSource && dataSource.data) {
                                                    const newData: Product[] = dataSource.data.map(d => {
                                                        if(d.id === record.id) {
                                                            return {
                                                                ...d,
                                                                amountAvailable: d.amountAvailable - values.amount
                                                            }
                                                        }
                                                        return d;
                                                    });
                                                    setDataSource({
                                                        ...dataSource,
                                                        data: newData
                                                    });
                                                }
                                                dispatch({
                                                    type: AppActionType.STORE_USER,
                                                    payload: {
                                                        ...state?.user,
                                                        deposit: resp.change
                                                    } as AuthUser
                                                })
                                                return resp;
                                            }).catch(e => {
                                                message.error(e.message || e.error);
                                            })
                                        })
                                    },
                                    onCancel() {
                                        form.resetFields();
                                    },
                                })

                            }}
                        >
                        Buy
                        </Button>
                    }
                    </>
                )
            }
        }
    ];

    return (
        <Row
            justify={"center"}
            align="middle"
            gutter={[30, 30]}
            style={{ padding: "20px 40px" }}
        >
            <Col span={16}>
                <Table
                    dataSource={dataSource?.data}
                    columns={columns}
                    rowKey={r => r.id}
                />
            </Col>
        </Row>
    );
}