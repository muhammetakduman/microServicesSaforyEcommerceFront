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
        // Optimistically reduce stock after order placement
        decrementProductStock(state, action) {
            // action.payload: [{ productId, quantity }]
            action.payload.forEach(({ productId, quantity }) => {
                const item = state.items.find(p => p.id === productId);
                if (item) item.stock = Math.max(0, (item.stock ?? 0) - quantity);
                if (state.selectedProduct?.id === productId) {
                    state.selectedProduct.stock = Math.max(0, (state.selectedProduct.stock ?? 0) - quantity);
                }
            });
        },
    },
});

export const { setProducts, setSelectedProduct, setLoading, setError, decrementProductStock } = productSlice.actions;
export default productSlice.reducer;
