"use client"

import { useState } from "react"
import { Layout, Button, Drawer, Badge } from "antd"
import "../styles/header.css"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/slices/authSlice"
import { ShoppingCartOutlined, MenuOutlined, UserOutlined, BookOutlined } from "@ant-design/icons"

const { Header } = Layout

const AppHeader = () => {
  const { user } = useSelector((state) => state.auth)
  const cartState = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Safely get cart items with null handling
  const cartItems = cartState && cartState.items ? cartState.items : []

  // If token exists in localStorage, consider user signed in for header display.
  // Prefer `user` from Redux when available; otherwise derive a simple display name.
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  let displayName = null
  if (user && user.name) displayName = user.name
  // if no user but token exists, try to read a stored `user` object (if your app stores it)
  
  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <Header className="app-header shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50" 
            style={{ position: 'sticky', top: 0, zIndex: 1000, padding: 0 }}>
      <div className="header-container">
        {/* Left: Logo + Title */}
        <div className="header-left">
          <Link to="/" 
                className="header-logo"
                onClick={closeMobileMenu}>
            <BookOutlined className="header-logo-icon" />
            <span className="header-logo-text">
              Book Bliss
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="header-nav">
          <Link to="/" 
                onClick={closeMobileMenu} 
                className="header-nav-link">
            Home
          </Link>
          <Link to="/cart" 
                onClick={closeMobileMenu} 
                className="header-nav-link header-nav-cart">
            <Badge count={cartItems.length || 0} size="small" className="header-cart-badge">
              <ShoppingCartOutlined className="header-cart-icon" />
            </Badge>
            <span>Cart</span>
          </Link>
        </nav>

        {/* Right: Auth */}
        <div className="header-right">
          <div className="header-auth-desktop">
            {(user || token) ? (
              <div className="header-user-actions">
                <div className="header-user-profile">
                  <UserOutlined className="header-user-icon" />
                  <span className="header-user-name">Hi {displayName || 'User'}</span>
                </div>
                <Button type="primary" 
                        onClick={handleLogout} 
                        className="header-logout-btn">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="header-auth-actions">
                <Link to="/login" 
                      onClick={closeMobileMenu} 
                      className="header-auth-link">
                  Login
                </Link>
                <Link to="/signup" 
                      onClick={closeMobileMenu}
                      className="header-signup-btn">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            className="header-mobile-btn"
            type="text"
            onClick={() => setMobileMenuOpen(true)}
            icon={<MenuOutlined />}
          />
        </div>
      </div>

      {/* Mobile Drawer for small screens */}
      <Drawer 
        title={
          <div className="drawer-header">
            <BookOutlined className="drawer-logo-icon" />
            <span className="drawer-logo-text">Book Bliss</span>
          </div>
        } 
        placement="right" 
        onClose={() => setMobileMenuOpen(false)} 
        open={mobileMenuOpen}
        className="header-drawer"
      >
        <div className="drawer-content">
          <Link to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="drawer-nav-link">
            Home
          </Link>
          <Link to="/cart" 
                onClick={() => setMobileMenuOpen(false)}
                className="drawer-nav-link drawer-nav-cart">
            <Badge count={cartItems.length || 0} size="small">
              <ShoppingCartOutlined />
            </Badge>
            <span>Cart</span>
          </Link>
          {(user || token) ? (
            <>
              <div className="drawer-user-profile">
                <UserOutlined /> Hi {displayName || 'User'}
              </div>
              <Button type="primary" 
                      onClick={handleLogout}
                      className="drawer-logout-btn">
                Logout
              </Button>
            </>
          ) : (
            <div className="drawer-auth-actions">
              <Link to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="drawer-auth-link">
                Login
              </Link>
              <Link to="/signup" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="drawer-signup-btn">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </Header>
  )
}

export default AppHeader