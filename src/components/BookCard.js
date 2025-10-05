import React, { useState } from "react";
import { Card, Button, Spin, Tag } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { EyeOutlined, ShoppingCartOutlined, StarOutlined } from "@ant-design/icons";
import "../styles/book.css";

const { Meta } = Card;

// BookCard
// - Props: `book` object expected to contain {_id, title, author, price, image, category, rating}
// - Renders a small card UI with cover image, quick actions and basic meta info.
// - Uses defensive checks to avoid runtime errors when `book` has missing fields.
const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Safe access to book properties with null handling
  const bookId = book && book._id ? book._id : null;
  const title = book && book.title ? book.title : 'Untitled Book';
  const author = book && book.author ? book.author : 'Unknown Author';
  const price = book && book.price ? book.price : 0;
  const image = book && book.image ? book.image : "/images/Fiction.jpg";
  const category = book && book.category ? book.category : 'General';
  const rating = book && book.rating ? book.rating : 0;

  // Add-to-cart flow:
  // - Validates bookId exists, sets a local loading indicator, dispatches the thunk, and handles errors.
  const handleAddToCart = async () => {
    if (!bookId) return;
    
    setLoading(true);
    try {
      await dispatch(addToCart(bookId));
    } catch (error) {
      // We log errors here; user-visible feedback is shown by the cart thunk via `message`.
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render the card if bookId is missing - this prevents broken links and actions.
  if (!bookId) {
    return null;
  }

  // Generate star rating display (UI-only helper)
  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarOutlined key={i} className="text-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarOutlined key="half" className="text-yellow-500" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarOutlined key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div className="book-card-wrapper">
      <Card
        className="book-card"
        cover={
          <div 
            className="book-cover-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              alt={title}
              src={image}
              className="book-cover-image"
              onError={(e) => { e.target.src = "/images/Fiction.jpg"; }}
            />
            <div className={`book-overlay ${isHovered ? 'book-overlay-visible' : ''}`}>
              <Link 
                to={`/book/${bookId}`} 
                className="book-view-btn"
              >
                <EyeOutlined className="book-view-icon" />
                View Details
              </Link>
            </div>
            <Tag className="book-category-tag">{category}</Tag>
          </div>
        }
        // Card UI structure:
        // - cover: image with hover overlay (View Details)
        // - Tag: category shown on top of cover
        // - actions: add-to-cart button with loading state
        // - Meta: title, author and price + rating
        actions={[
          <Button
            key="cart"
            icon={loading ? <Spin size="small" /> : <ShoppingCartOutlined />}
            onClick={handleAddToCart}
            disabled={loading}
            className="add-to-cart-btn"
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </Button>,
        ]}
      >
        <Meta
          title={
            <div className="book-title">
              {title}
            </div>
          }
          description={
            <div className="book-details">
              <div className="book-author">by {author}</div>
              <div className="book-price-rating">
                <div className="book-price">₹{price.toFixed(2)}</div>
                {rating > 0 && (
                  <div className="book-rating">
                    {renderRating()}
                    <span className="rating-text">{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default BookCard;