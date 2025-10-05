import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { message } from 'antd';

// Cart thunks:
// - fetchCart: loads the user's cart; maps server items to [{...book, quantity}]
// - addToCart/updateCartQuantity/removeFromCart: perform server mutation then refresh cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
	try {
		const { data } = await api.get('/cart');
		// server shape: { items: [{ book: {...}, quantity: number }, ...] }
		return data?.items?.map(i => ({ ...i.book, quantity: i.quantity })) || [];
	} catch (err) {
		return rejectWithValue(err.response?.data || err.message);
	}
});

export const addToCart = createAsyncThunk('cart/addToCart', async (bookId, { dispatch, rejectWithValue }) => {
	try {
		await api.post('/cart/add', { bookId, quantity: 1 });
		dispatch(fetchCart());
		message.success('Book added to cart');
	} catch (err) {
		message.error('Failed to add to cart');
		return rejectWithValue(err.response?.data || err.message);
	}
});

export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({ bookId, quantity }, { dispatch, rejectWithValue }) => {
	try {
		await api.put('/cart/update', { bookId, quantity });
		dispatch(fetchCart());
		message.success('Cart updated');
	} catch (err) {
		message.error('Failed to update cart');
		return rejectWithValue(err.response?.data || err.message);
	}
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (bookId, { dispatch, rejectWithValue }) => {
	try {
		await api.delete(`/cart/remove/${bookId}`);
		dispatch(fetchCart());
		message.success('Item removed from cart');
	} catch (err) {
		message.error('Failed to remove item');
		return rejectWithValue(err.response?.data || err.message);
	}
});

const cartSlice = createSlice({
	name: 'cart',
	initialState: { items: [], loading: false },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCart.pending, (state) => { state.loading = true; })
			.addCase(fetchCart.fulfilled, (state, action) => {
				state.items = action.payload;
				state.loading = false;
			})
			.addCase(fetchCart.rejected, (state) => { state.loading = false; })
		;
	}
});

export default cartSlice.reducer;