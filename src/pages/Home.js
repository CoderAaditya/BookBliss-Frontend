import React, { useEffect } from 'react';
import { Typography } from 'antd';
import BookList from '../components/BookList';
import '../styles/common.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  useEffect(() => {
    // Add animation class to title when component mounts
    const titleElement = document.querySelector('.home-title');
    if (titleElement) {
      setTimeout(() => {
        titleElement.classList.remove('opacity-0');
        titleElement.classList.add('animate-fade-in');
      }, 100);
    }
    
    // Add animation to subtitle and stats
    const subtitleElement = document.querySelector('.hero-subtitle');
    const statsElements = document.querySelectorAll('.stat-item');
    
    if (subtitleElement) {
      setTimeout(() => {
        subtitleElement.classList.add('animate-fade-in');
      }, 300);
    }
    
    statsElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-fade-in');
      }, 500 + (index * 100));
    });
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <Title className="home-title opacity-0 transition-opacity duration-500">
              <span className="hero-title">
                Discover Your Next Favorite Book
              </span>
            </Title>
            <Paragraph className="hero-subtitle opacity-0">
              Explore thousands of books across all genres. From bestsellers to hidden gems, 
              find your next literary adventure today.
            </Paragraph>
            <div className="hero-stats">
              <div className="stat-item opacity-0">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Books Available</span>
              </div>
              <div className="stat-item opacity-0">
                <span className="stat-number">500+</span>
                <span className="stat-label">Authors</span>
              </div>
              <div className="stat-item opacity-0">
                <span className="stat-number">50+</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="book-stack">
              <div className="book book-1"></div>
              <div className="book book-2"></div>
              <div className="book book-3"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Books Section */}
      <div className="books-section">
        <div className="section-header">
          <Title level={2} className="section-title">Featured Books</Title>
          <Paragraph className="section-subtitle">
            Handpicked selections just for you
          </Paragraph>
        </div>
        <BookList />
      </div>
    </div>
  );
};

export default Home;