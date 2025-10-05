import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { message } from 'antd';

// Auth thunks:
// - signup/login: call API endpoints and persist token in localStorage on success
// - Note: these thunks return server payloads which are then used to populate `user` in state
export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signup', data);
    localStorage.setItem('token', response.data.token);
    message.success('Signup successful');
    return response.data;
  } catch (err) {
    message.error(err.response?.data?.message || 'Signup failed');
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (err) {
    message.error(err.response?.data?.message || 'Login failed');
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Keep the slice simple: token prefills from localStorage, user will be set when thunks fulfill.
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('token'), loading: false },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        // server response expected: { user, token }
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      ;
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;