import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { AuthUser } from "../types";

interface UserState {
    user: AuthUser | undefined,
    loading: boolean;
}

const initialState: UserState  = {
    loading: false,
    user: undefined,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loadUser: state => {
            return {
                ...state,
                loading: true
            }
        },
        loadUserSuccess: (state, action: PayloadAction<AuthUser>) => {
            return {
                ...state,
                loading: false,
                user: action.payload
            }
        },
        loadUserFailure: (state, action: PayloadAction<AuthUser>) => {
            return {
                ...state,
                loading: false,
            }
        }
    }
});

export const {
    loadUser,
    loadUserSuccess,
    loadUserFailure,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.userSlice.user;
export const selectLoading = (state: RootState) => state.userSlice.loading;

export default userSlice.reducer;