import { store } from '../store';
import { setCredentials, logout } from '../store/slices/authSlice';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let isRefreshing = false;
let pendingRequests = [];

function getAuthHeaders(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function tryRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;
    const res = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    return res.json();
}

async function apiFetch(path, options = {}) {
    const { body, params, extraHeaders = {}, ...rest } = options;
    const token = store.getState().auth.token;

    let url = `${BASE_URL}${path}`;
    if (params) {
        const qs = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
        ).toString();
        if (qs) url += `?${qs}`;
    }

    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(token),
        ...extraHeaders,
    };

    const config = { headers, ...rest };
    if (body !== undefined) config.body = JSON.stringify(body);

    let res = await fetch(url, config);

    if (res.status === 401 && !isRefreshing) {
        isRefreshing = true;
        const data = await tryRefreshToken();
        isRefreshing = false;
        if (data?.accessToken) {
            store.dispatch(setCredentials({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                userId: store.getState().auth.userId,
                role: store.getState().auth.role,
            }));
            headers.Authorization = `Bearer ${data.accessToken}`;
            res = await fetch(url, { ...config, headers });
        } else {
            store.dispatch(logout());
            throw new ApiError(401, 'Session expired');
        }
    }

    if (!res.ok) {
        let message = res.statusText;
        try {
            const err = await res.json();
            message = err.message || message;
        } catch { /* ignore */ }
        throw new ApiError(res.status, message);
    }

    if (res.status === 204) return null;
    return res.json();
}

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export default apiFetch;
