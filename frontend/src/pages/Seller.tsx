import { Button, Col, Form, InputNumber, message, Modal, Row, Table, TableColumnsType, TablePaginationConfig } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestService from "../services/RestService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadUserSuccess, selectUser } from "../store/userSlice";
import { AuthUser, LaravelPagination, LaravelPaginationFilter, Product, RoleName } from "../types";

export default function Seller() {
    const [dataSource, setDataSource] = useState<LaravelPagination<Product[]>>();
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const [filter, setFilter] = useState<LaravelPaginationFilter>({page: 1, limit: 10});

    const client = useMemo(() => new RestService(), []);

    useEffect(() => {
        client.getProducts(filter).then(resp => {
            setDataSource(resp);
        }).catch(e => {
            message.error(e.message || e.error);
        });
    }, [client, filter]);

    const buy = (record: Product, user: AuthUser) => {
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
                        dispatch(loadUserSuccess({
                            ...user,
                            deposit: resp.change
                        }))
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
    }

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
                    { user?.roleName === RoleName.BUYER && record.amountAvailable > 0 &&
                        <Button
                            onClick={() => {
                                buy(record, user);
                            }}
                        >
                        Buy
                        </Button>
                    }
                    {
                        user?.roleName === RoleName.SELLER &&
                        <Button
                            onClick={() => {
                                navigate(`/update-product/${record.id}`)
                            }}
                        >
                            Update
                        </Button>
                    }
                    </>
                )
            }
        }
    ];

    const pagination: TablePaginationConfig = {
        current: dataSource?.current_page,
        total: dataSource?.total,
        showSizeChanger: true,
        onChange: (page, pageSize) => {
            setFilter({
                ...filter,
                page,
                limit: pageSize
            })
        }
    };

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
                    pagination={pagination}
                />
            </Col>
        </Row>
    );
}