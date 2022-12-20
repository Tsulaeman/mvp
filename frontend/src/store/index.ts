import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice";
import userSlice from "./userSlice";
import authSlice from "./authSlice";

const store = configureStore({
    reducer: {
        productSlice,
        userSlice,
        authSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;