import apiFetch from './api';

export const cartService = {
    getCart: (customerId) =>
        apiFetch(`/api/cart?customerId=${customerId}`),

    addItem: (customerId, item) =>
        apiFetch(`/api/cart/items?customerId=${customerId}`, {
            method: 'POST',
            body: item,
        }),

    updateItem: (customerId, itemId, quantity) =>
        apiFetch(`/api/cart/items/${itemId}?customerId=${customerId}`, {
            method: 'PUT',
            body: { quantity },
        }),

    removeItem: (customerId, itemId) =>
        apiFetch(`/api/cart/items/${itemId}?customerId=${customerId}`, {
            method: 'DELETE',
        }),

    clearCart: (customerId) =>
        apiFetch(`/api/cart/clear?customerId=${customerId}`, { method: 'DELETE' }),
};

export const orderService = {
    create: (orderData) =>
        apiFetch('/api/orders', { method: 'POST', body: orderData }),

    getMyOrders: (customerId) =>
        apiFetch(`/api/orders/my-orders?customerId=${customerId}`),

    getById: (orderId) =>
        apiFetch(`/api/orders/${orderId}`),

    cancel: (orderId, customerId) =>
        apiFetch(`/api/orders/${orderId}/cancel?customerId=${customerId}`, { method: 'PUT' }),

    // SELLER
    getSellerItems: (sellerId) =>
        apiFetch(`/api/orders/seller/items?sellerId=${sellerId}`),

    updateItemStatus: (sellerId, orderItemId, status) =>
        apiFetch(`/api/orders/seller/items/${orderItemId}/status?sellerId=${sellerId}&status=${status}`, {
            method: 'PUT',
        }),

    // ADMIN
    getAllOrders: () =>
        apiFetch('/api/orders/admin'),

    forceUpdateOrderStatus: (orderId, status) =>
        apiFetch(`/api/orders/admin/${orderId}/status?status=${status}`, { method: 'PUT' }),
};
