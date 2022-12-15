import { Col, message, Row, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import RestService from "../services/RestService";
import { AppComponentProps, LaravelPagination, Product } from "../types";

export default function Seller({ state, dispatch }: AppComponentProps) {
    const [dataSource, setDataSource] = useState<LaravelPagination<Product[]>>();

    useEffect(() => {
        new RestService().getProducts().then(resp => {
            setDataSource(resp);
        }).catch(e => {
            message.error(e.message || e.error);
        });
    }, [state?.user?.id]);

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
        },
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