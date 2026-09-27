import { createSlice } from '@reduxjs/toolkit';

const loadUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem('trendorabay-user');
    if (serializedUser === null) {
      return null;
    }
    return JSON.parse(serializedUser);
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
};

const initialState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const userData = action.payload.user || action.payload;
      state.user = userData;
      state.isAuthenticated = true;
      localStorage.setItem('trendorabay-user', JSON.stringify(userData));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('trendorabay-user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
