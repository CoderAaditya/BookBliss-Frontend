import React, { useState } from 'react';
import { List, Button, Spin, Empty } from 'antd';
import '../styles/common.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateCartQuantity, removeFromCart } from '../redux/slices/cartSlice';
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';

const Cart = () => {
  const dispatch = useDispatch();
  const cartState = useSelector(state => state.cart);
  
  // Safe access to cart items with null handling
  const items = cartState && cartState.items ? cartState.items : [];
  const loading = cartState ? cartState.loading : false;

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  // Component responsibilities:
  // - Load current cart on mount via `fetchCart()` thunk
  // - Allow quantity updates (calls `updateCartQuantity`) and removals (`removeFromCart`)
  // - Show loading states for the whole list and per-item actions

  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const handleQuantity = async (id, quantity) => {
    if (!id || quantity === null || quantity === undefined) return;
    if (quantity < 1) return;
    setUpdatingId(id);
    await dispatch(updateCartQuantity({ bookId: id, quantity }));
    setUpdatingId(null);
  };

  const handleRemove = async (id) => {
    if (!id) return;
    setRemovingId(id);
    await dispatch(removeFromCart(id));
    setRemovingId(null);
  };

  const increaseQuantity = (id, currentQuantity) => {
    handleQuantity(id, currentQuantity + 1);
  };

  const decreaseQuantity = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantity(id, currentQuantity - 1);
    }
  };

  // Safe calculation of total with null handling
  const total = items && items.length > 0 
    ? items.reduce((sum, item) => {
        const price = item && item.price ? item.price : 0;
        const quantity = item && item.quantity ? item.quantity : 0;
        return sum + (price * quantity);
      }, 0)
    : 0;

  const itemCount = items && items.length > 0 
    ? items.reduce((count, item) => {
        const quantity = item && item.quantity ? item.quantity : 0;
        return count + quantity;
      }, 0)
    : 0;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">
          <ShoppingCartOutlined className="cart-icon" />
          Your Shopping Cart
        </h1>
        {items && items.length > 0 && (
          <div className="cart-summary">
            <span className="item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            <span className="cart-total">Total: ₹{total.toFixed(2)}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="cart-loading">
          <Spin size="large" />
          <p>Loading your cart...</p>
        </div>
      ) : items && items.length > 0 ? (
        <div className="cart-content">
          <List
            className="cart-items-list"
            dataSource={items}
            renderItem={item => {
              // Safe access to item properties
              const itemId = item ? item._id : null;
              const title = item && item.title ? item.title : 'Unknown Book';
              const price = item && item.price ? item.price : 0;
              const quantity = item && item.quantity ? item.quantity : 0;
              const image = item && item.image ? item.image : '/images/Fiction.jpg';
              
              if (!itemId) return null;
              
              const itemTotal = price * quantity;
              
              return (
                <List.Item className="cart-item">
                  <div className="cart-item-content">
                    <div className="cart-item-image">
                      <img 
                        src={image} 
                        alt={title}
                        onError={(e) => { e.target.src = '/images/Fiction.jpg'; }}
                      />
                    </div>
                    
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{title}</h3>
                      <p className="cart-item-price">₹{price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <Button 
                        icon={<MinusOutlined />} 
                        onClick={() => decreaseQuantity(itemId, quantity)}
                        disabled={updatingId === itemId || removingId === itemId}
                        className="quantity-btn"
                      />
                      <span className="quantity-display">{quantity}</span>
                      <Button 
                        icon={<PlusOutlined />} 
                        onClick={() => increaseQuantity(itemId, quantity)}
                        disabled={updatingId === itemId || removingId === itemId}
                        className="quantity-btn"
                      />
                    </div>
                    
                    <div className="cart-item-total">
                      ₹{itemTotal.toFixed(2)}
                    </div>
                    
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(itemId)}
                      loading={removingId === itemId}
                      disabled={updatingId === itemId}
                      className="remove-btn"
                    />
                  </div>
                </List.Item>
              );
            }}
          />
          
          <div className="cart-footer">
            <div className="cart-total-section">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button type="primary" size="large" className="checkout-btn">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      ) : (
        <div className="cart-empty">
          <Empty 
            description={
              <div>
                <h3>Your cart is empty</h3>
                <p>Start adding some books to your cart!</p>
              </div>
            }
          />
          <Button type="primary" onClick={() => window.location.href = '/'} className="continue-shopping-btn">
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;