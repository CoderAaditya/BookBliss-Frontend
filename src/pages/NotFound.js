import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={handleGoHome} className="not-found-btn">
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;