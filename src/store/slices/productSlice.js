import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    total: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    selectedProduct: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state, action) {
            state.items = action.payload.items;
            state.total = action.payload.total;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
        setSelectedProduct(state, action) {
            state.selectedProduct = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const { setProducts, setSelectedProduct, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;
