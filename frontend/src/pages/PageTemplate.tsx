import React, { useEffect, useState } from "react";
import { Menu, Breadcrumb, theme, Layout } from "antd";
import { Link, Outlet } from "react-router-dom";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { AppActionType, RoleName } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectUser } from "../store/userSlice";
import { logout, selectToken } from "../store/authSlice";



const { Header, Content, Footer } = Layout;

export default function PageTemplate() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const accessToken = useAppSelector(selectToken);
    const [links, setLinks] = useState<ItemType[]>([]);

    useEffect(() => {

        const links = [
            {
                key: "products",
                label: <Link to={"products"}>Products</Link>
            },
            {
                key: "logout",
                label: "Logout",
                onClick: () => {
                    dispatch(logout())
                },
            }
        ];

        if(user?.roleName === RoleName.SELLER) {
            links.unshift({
                key: "create",
                label: <Link to={"create-product"}>Create Product</Link>
            });
        }

        if(user?.roleName === RoleName.BUYER) {
            links.unshift({
                key: "Deposit",
                label: <Link to={"/"}>Deposit</Link>
            });
        }

        setLinks([
            ...(accessToken ? links : [
                    {
                        key: "login",
                        label: <Link to={"login"}>Login</Link>
                    },
                    {
                        key: "register",
                        label: <Link to={"register"}>Register</Link>
                    }
                ]
            ),
        ]);
    }, [accessToken, user, dispatch]);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={links}
                    style={{ float: "right" }}
                />
            </Header>
            <Content style={{ padding: '0 50px', height: "relative" }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-content"
                    style={{ background: colorBgContainer, padding: "40px 0"}}
                >
                    <Outlet />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    );
}