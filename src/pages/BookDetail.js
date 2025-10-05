import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spin, Typography, Tag, Rate } from 'antd';
import '../styles/common.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { fetchBookDetail } from '../redux/slices/booksSlice';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const booksState = useSelector(state => state.books);
  
  // Safe access to book data with null handling
  const book = booksState && booksState.book ? booksState.book : null;
  const loading = booksState ? booksState.loading : false;

  useEffect(() => {
    if (id) {
      dispatch(fetchBookDetail(id));
    }
  }, [id, dispatch]);

  const [btnLoading, setBtnLoading] = useState(false);
  const handleAddToCart = async () => {
    if (book && book._id) {
      setBtnLoading(true);
      await dispatch(addToCart(book._id));
      setBtnLoading(false);
    }
  };

  if (loading) return (
    <div className="book-detail-loading">
      <Spin size="large" />
      <p className="loading-text">Loading book details...</p>
    </div>
  );
  
  if (!book) {
    return (
      <div className="book-detail-not-found">
        <Title level={3}>Book not found</Title>
        <Text>The requested book could not be found.</Text>
        <Button type="primary" onClick={() => window.history.back()} className="back-btn">
          Back to Books
        </Button>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail-content">
        <div className="book-detail-image">
          <img 
            alt={book.title || 'Book cover'} 
            src={book.image || 'https://via.placeholder.com/300x400?text=Book'} 
            className="book-detail-img" 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=Book'; }}
          />
        </div>
        
        <div className="book-detail-info">
          <div className="book-detail-header">
            <Tag className="book-detail-category">{book.category || 'General'}</Tag>
            <Title level={2} className="book-detail-title">{book.title || 'Untitled Book'}</Title>
            <Text className="book-detail-author">by {book.author || 'Unknown Author'}</Text>
          </div>
          
          <div className="book-detail-meta">
            {book.rating && (
              <div className="book-detail-rating">
                <Rate disabled defaultValue={book.rating} />
                <span className="rating-value">{book.rating.toFixed(1)}</span>
              </div>
            )}
            
            <div className="book-detail-price">
              <Text className="price-label">Price:</Text>
              <Text className="price-value">₹{book.price ? book.price.toFixed(2) : '0.00'}</Text>
            </div>
          </div>
          
          <div className="book-detail-description">
            <Title level={4}>Description</Title>
            <Text className="description-text">{book.description || 'No description available for this book.'}</Text>
          </div>
          
          <div className="book-detail-actions">
            <Button 
              type="primary" 
              onClick={handleAddToCart} 
              loading={btnLoading}
              disabled={!book._id}
              className="add-to-cart-btn-detail"
              size="large"
            >
              <ShoppingCartOutlined />
              Add to Cart
            </Button>
            
            <Button 
              onClick={() => window.history.back()} 
              className="back-btn-detail"
              size="large"
            >
              Back to Books
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;