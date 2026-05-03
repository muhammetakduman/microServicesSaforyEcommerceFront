import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartId: null,
    items: [],       // { itemId, productId, productName, sellerId, unitPrice, quantity, lineTotal }
    totalAmount: 0,
    loading: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action) {
            const { cartId, items, totalAmount } = action.payload;
            state.cartId = cartId;
            state.items = items ?? [];
            state.totalAmount = totalAmount ?? 0;
        },
        clearCartState(state) {
            state.cartId = null;
            state.items = [];
            state.totalAmount = 0;
        },
        setCartLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const { setCart, clearCartState, setCartLoading } = cartSlice.actions;
export const selectCartCount = state =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export default cartSlice.reducer;
