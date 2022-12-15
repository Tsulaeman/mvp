import React from "react";
import { Menu, Breadcrumb, theme, Layout } from "antd";
import { Link, Outlet } from "react-router-dom";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { AppActionType, AppComponentProps, RoleName } from "../types";



const { Header, Content, Footer } = Layout;

export default function PageTemplate({ state, dispatch }: AppComponentProps) {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const authLinks: ItemType[] = [
        {
            key: "login",
            label: <Link to={"login"}>Login</Link>
        },
        {
            key: "register",
            label: <Link to={"register"}>Register</Link>
        }
    ];

    const links: ItemType[] = [
        {
            key: "products",
            label: <Link to={"products"}>Products</Link>
        },
        {
            key: "logout",
            label: "Logout",
            onClick: () => {
                dispatch({
                    type: AppActionType.LOGOUT,
                    payload: null
                })
            },
        }
    ];
    if(state?.user?.roleName === RoleName.SELLER) {
        links.push({
            key: "create",
            label: <Link to={"create-product"}>Create Product</Link>
        });
    }

    if(state?.user?.roleName === RoleName.BUYER) {
        links.unshift({
            key: "Deposit",
            label: <Link to={"/"}>Deposit</Link>
        });
    }

    const navLinks: ItemType[] = [
        ...(state?.auth?.access_token ? links : authLinks),
    ];

    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={navLinks}
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