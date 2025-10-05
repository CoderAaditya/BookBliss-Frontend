import React, { useState, useEffect } from 'react';
import { Input, Select, Pagination, Spin, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/slices/booksSlice';
import '../styles/book.css';
import BookCard from './BookCard';

const { Search } = Input;
const { Option } = Select;

const BookList = () => {
  const dispatch = useDispatch();
  const booksState = useSelector(state => state.books);

  // booksState shape (from redux slice): { books: [], totalPages: number, book: object|null, loading: boolean }
  // We defensively read values to avoid runtime errors when state is briefly undefined.
  const books = booksState && booksState.books ? booksState.books : [];
  const totalPages = booksState && booksState.totalPages ? booksState.totalPages : 1;
  const loading = booksState ? booksState.loading : false;
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { 
      page: page || 1, 
      limit: 8, 
      ...(search && { search }), 
      ...(category && { category }), 
      ...(author && { author }) 
    };
    dispatch(fetchBooks(params));
  }, [search, category, author, page, dispatch]);

  // Effect explanation:
  // - This effect runs when any filter or page changes.
  // - It builds a `params` object, only including filters that are non-empty.
  // - `fetchBooks` is a thunk that loads data from the API and populates the redux store.

  const handleSearch = (value) => {
    setSearch(value || '');
    setPage(1);
  };

  const handleCategory = (value) => {
    setCategory(value || '');
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setAuthor('');
    setPage(1);
  };

  return (
    <div className="book-list-container">
      <div className="bb-filters-row animate-fade-in">
        <div className="left">
          <Search 
            placeholder="Search by title, description..." 
            onSearch={handleSearch} 
            className="bb-input-wide" 
            defaultValue={search || ''}
            enterButton
            size="large"
            allowClear
          />
        </div>
        <div className="controls">
          <Select 
            placeholder="All Categories" 
            onChange={handleCategory} 
            className="bb-select-medium" 
            allowClear
            value={category || undefined}
            size="large"
          >
            <Option value="Fiction">Fiction</Option>
            <Option value="Non-Fiction">Non-Fiction</Option>
            <Option value="Sci-Fi">Sci-Fi</Option>
            {/* <Option value="Mystery">Mystery</Option>
            <Option value="Romance">Romance</Option>
            <Option value="Biography">Biography</Option> */}
          </Select>
          <Input 
            placeholder="Author" 
            onChange={(e) => { setAuthor(e.target.value || ''); setPage(1); }} 
            className="bb-input-medium" 
            value={author || ''}
            size="large"
            allowClear
          />
          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Books grid: shows loading, results, or an empty state */}
      <div className="bb-book-grid">
        {loading ? (
          <div className="bb-center mt-24">
            <div className="loading-spinner">
              <Spin size="large" />
              <p className="loading-text">Searching our book collection...</p>
            </div>
          </div>
        ) : books && books.length > 0 ? (
          books.map((book, index) => {
            // Skip rendering if book is null or undefined
            if (!book) return null;
            
            return (
              <div key={book._id || index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <BookCard book={book} />
              </div>
            );
          })
        ) : (
          // Empty state explanation:
          // - Rendered when there are no books matching the current filters.
          // - Offers a button to clear all filters so users can easily reset.
          <div className="bb-center mt-24 w-full">
            <Empty 
              description={
                <div>
                  <h3>No Books Found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              }
            >
              <button 
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </Empty>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="bb-center mt-24">
          <Pagination 
            current={page || 1} 
            total={(totalPages || 1) * 8} 
            onChange={(p) => setPage(p || 1)} 
            showSizeChanger={false}
            size="large"
            className="books-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default BookList;