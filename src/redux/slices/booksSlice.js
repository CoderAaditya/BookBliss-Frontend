import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { message } from 'antd';

// Thunk: fetchBooks
// - params: { page, limit, search?, category?, author? }
// - returns the API response shape expected by the UI: { books: [], totalPages: number }
export const fetchBooks = createAsyncThunk('books/fetchBooks', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/books', { params });
    return data;
  } catch (err) {
    // Show a user-friendly message and pass the error to reducers
    message.error('Failed to fetch books');
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Thunk: fetchBookDetail
// - loads a single book by id for the BookDetail page
export const fetchBookDetail = createAsyncThunk('books/fetchBookDetail', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/books/${id}`);
    return data;
  } catch (err) {
    message.error('Failed to fetch book details');
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Slice: books
// - State shape: { books: Array, totalPages: number, book: Object|null, loading: boolean }
// - Reducers are handled in extraReducers via the async thunks above.
const booksSlice = createSlice({
  name: 'books',
  initialState: { books: [], totalPages: 1, book: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { state.loading = true; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        // Expecting API to return { books, totalPages }
        state.books = action.payload.books;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state) => { state.loading = false; })
      .addCase(fetchBookDetail.pending, (state) => { state.loading = true; })
      .addCase(fetchBookDetail.fulfilled, (state, action) => {
        state.book = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookDetail.rejected, (state) => { state.loading = false; });
  }
});

export default booksSlice.reducer;
