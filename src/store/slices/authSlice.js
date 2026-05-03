import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
    role: localStorage.getItem('role') || null,
    email: localStorage.getItem('email') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action) {
            const { accessToken, refreshToken, userId, role, email } = action.payload;
            state.token = accessToken;
            state.refreshToken = refreshToken;
            state.userId = userId;
            state.role = role;
            state.email = email ?? state.email;
            state.isAuthenticated = true;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', role);
            if (email) localStorage.setItem('email', email);
        },
        logout(state) {
            state.token = null;
            state.refreshToken = null;
            state.userId = null;
            state.role = null;
            state.email = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
