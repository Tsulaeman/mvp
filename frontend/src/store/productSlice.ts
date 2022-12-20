import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Product } from "../types";

interface ProductState {
    products: Product[];
    loading: boolean;
}

const initialState: ProductState = {
    products: [],
    loading: false
}

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        loadProducts: (state) => {
            return {
                ...state,
                loading: true
            }
        },
        loadProductsSuccess: (state, action: PayloadAction<Product[]>) => {
            return {
                ...state,
                loading: false,
                products: action.payload
            }
        },
        loadProductsFailure: (state) => {
            return {
                ...state,
                loading: false
            }
        },
    }
});

export const { loadProducts, loadProductsSuccess, loadProductsFailure } = productSlice.actions;

export const selectProducts = (state: RootState) => state.productSlice.products

export default productSlice.reducer;