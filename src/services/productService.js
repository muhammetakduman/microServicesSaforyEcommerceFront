import apiFetch from './api';

export const productService = {
    getAll: ({ page = 0, size = 20 } = {}) =>
        apiFetch('/api/products', { params: { page, size } }),

    getById: (id) =>
        apiFetch(`/api/products/${id}`),

    search: ({ keyword, page = 0, size = 20 }) =>
        apiFetch('/api/products/search', { params: { keyword, page, size } }),

    getCategories: () =>
        apiFetch('/api/products/categories'),

    // SELLER
    addProduct: (sellerId, data) =>
        apiFetch('/api/products/seller', {
            method: 'POST',
            body: data,
            extraHeaders: { 'X-Seller-Id': sellerId },
        }),

    updateProduct: (sellerId, productId, data) =>
        apiFetch(`/api/products/seller/${productId}`, {
            method: 'PUT',
            body: data,
            extraHeaders: { 'X-Seller-Id': sellerId },
        }),

    deleteProduct: (sellerId, productId) =>
        apiFetch(`/api/products/seller/${productId}`, {
            method: 'DELETE',
            extraHeaders: { 'X-Seller-Id': sellerId },
        }),

    getMyProducts: (sellerId, { page = 0, size = 20 } = {}) =>
        apiFetch('/api/products/seller/my-products', {
            params: { page, size },
            extraHeaders: { 'X-Seller-Id': sellerId },
        }),

    updateStock: (sellerId, productId, stock) =>
        apiFetch(`/api/products/seller/${productId}/stock`, {
            method: 'PATCH',
            body: { stock },
            extraHeaders: { 'X-Seller-Id': sellerId },
        }),
};
