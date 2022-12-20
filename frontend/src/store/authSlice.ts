import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { AuthResponse, AuthUser } from "../types";

interface AuthState {
    auth: AuthResponse | undefined,
    loading: boolean;
    logout: boolean;
}

const initialState: AuthState  = {
    loading: false,
    auth: undefined,
    logout: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state) => {
            return {
                ...state,
                loading: true,
            }
        },
        loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
            return {
                ...state,
                loading: false,
                auth: action.payload
            }
        },
        loginFailure: (state) => {
            return {
                ...state,
                loading: false,
            }
        },
        logout: (state) => {
            return {
                ...state,
                loading: true,
                logout: true,
            }
        },
        logoutSuccess: (state) => {
            return {
                ...state,
                loading: false,
                logout: false
            }
        },
        logoutFailure: (state) => {
            return {
                ...state,
                loading: false,
                logout: false
            }
        }
    }
});

export const {
    login,
    loginFailure,
    loginSuccess,
    logout,
    logoutFailure,
    logoutSuccess
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.authSlice.auth;
export const selectAuthLoading = (state: RootState) => state.authSlice.loading;
export const selectLogout = (state: RootState) => state.authSlice.logout;
export const selectToken = (state: RootState) => state.authSlice.auth?.access_token;

export default authSlice.reducer;