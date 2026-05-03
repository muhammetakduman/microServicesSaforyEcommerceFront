import apiFetch from './api';

export const authService = {
    loginUser: (email, password) =>
        apiFetch('/api/auth/login', { method: 'POST', body: { email, password } }),

    registerCustomer: (data) =>
        apiFetch('/api/auth/register/customer', { method: 'POST', body: data }),

    registerSeller: (data) =>
        apiFetch('/api/auth/register/seller', { method: 'POST', body: data }),

    logout: (userId) =>
        apiFetch(`/api/auth/logout?userId=${userId}`, { method: 'POST' }),

    getMe: (userId) =>
        apiFetch(`/api/auth/me?userId=${userId}`),

    refreshToken: (refreshToken) =>
        apiFetch('/api/auth/refresh-token', { method: 'POST', body: { refreshToken } }),
};
