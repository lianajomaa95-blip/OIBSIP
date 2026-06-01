import { createSlice } from '@reduxjs/toolkit';
// Load user from localStorage so they stay logged in after refresh
const userFromStorage = localStorage.getItem('user')
? JSON.parse(localStorage.getItem('user'))
: null;
const initialState = {
user: userFromStorage,
isAuthenticated: !!userFromStorage,
loading: false,
error: null,
};
const authSlice = createSlice({
name: 'auth',
initialState,
reducers: {
loginStart: (state) => {
state.loading = true;
state.error = null;
},
loginSuccess: (state, action) => {
state.loading = false;
state.user = action.payload;
state.isAuthenticated = true;
state.error = null;
// Persist to localStorage so user stays logged in
localStorage.setItem('user', JSON.stringify(action.payload));
},
loginFailure: (state, action) => {
state.loading = false;
state.error = action.payload;
state.isAuthenticated = false;
},
logout: (state) => {
state.user = null;
state.isAuthenticated = false;
state.error = null;
localStorage.removeItem('user');
},
updateUser: (state, action) => {
state.user = { ...state.user, ...action.payload };
localStorage.setItem('user', JSON.stringify(state.user));
},
},
});
export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;