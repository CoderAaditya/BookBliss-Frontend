import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import booksReducer from './slices/booksSlice';

// Root Redux store configuration
// - Combines auth, cart and books slices used across the app
export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    books: booksReducer
  }
});