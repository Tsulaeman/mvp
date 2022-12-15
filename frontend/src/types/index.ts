import { Dispatch } from "react";

export interface LaravelPagination<T> {
    current_page: number;
    data: T;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    to: number | null;
    prev_page_url: string;
    total: number;
}

export interface Auth {
    username: string;
    password: string;
}

export enum RoleName {
    BUYER = "buyer",
    SELLER = "seller"
}

export interface AuthResponse {
    access_token: string,
    token_type: string;
    expires_in: number;
}

export interface AuthUser {
    id: number;
    username: string;
    updated_at: string;
    created_at: string;
    role: number;
    deposit: number;
    roleName: RoleName
}

export interface Product {
    id: number;
    amountAvailable: number;
    cost: number;
    productName: string;
    sellerId: string
}

export interface AppRoles {
    buyer: number;
    seller: number
}

export interface AppConfig {
    roles: AppRoles;
    [key: string]: any;
}

export interface AppState {
    auth: AuthResponse | undefined,
    user: AuthUser | undefined,
    logout: boolean,
  }

export enum AppActionType {
    STORE_USER = 'STORE USER',
    STORE_AUTH = 'STORE AUTH',
    LOGOUT = 'LOGOUT',
}
export interface AppAction {
    type: AppActionType,
    payload: any
}

export interface AppComponentProps {
    dispatch: Dispatch<AppAction>;
    state: AppState | undefined;
    [key: string]: any;
}