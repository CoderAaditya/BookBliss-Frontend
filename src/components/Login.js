import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import '../styles/common.css';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, LockOutlined, BookOutlined } from '@ant-design/icons';

const LoginForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    // Validate input values
    if (!values || !values.email || !values.password) {
      message.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const result = await dispatch(login(values));
      if (result && result.payload && result.payload.token) {
        message.success('Login successful');
        navigate('/');
      } else {
        form.setFields([{ name: 'email', errors: ['Invalid credentials'] }]);
      }
    } catch (err) {
      const errorMessage = err && err.message ? err.message : 'Login failed';
      message.error(errorMessage);
      form.setFields([{ name: 'email', errors: ['Invalid credentials'] }]);
    } finally {
      setLoading(false);
    }
  };

  // Login form responsibilities:
  // - Basic client-side validation (non-empty fields)
  // - Dispatch `login` thunk which stores token in localStorage on success
  // - Navigate to home on success and show messages on failure

  return (
    <div className="auth-container">
      <div className="auth-header">
        <BookOutlined className="auth-logo" />
        <h1 className="auth-title">Book Bliss</h1>
        <p className="auth-subtitle">Sign in to your account</p>
      </div>
      
      <div className="auth-card">
        <Form form={form} onFinish={onFinish} layout="vertical" className="auth-form">
          <Form.Item 
            name="email" 
            rules={[
              { required: true, message: 'Please input your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="auth-input-icon" />} 
              placeholder="Email" 
              size="large"
              className="auth-input"
            />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input.Password 
              prefix={<LockOutlined className="auth-input-icon" />} 
              placeholder="Password" 
              size="large"
              className="auth-input"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              size="large"
              block
              className="auth-btn"
            >
              Sign In
            </Button>
          </Form.Item>
          
          <div className="auth-footer">
            <span>Don't have an account? </span>
            <Link to="/signup" className="auth-link">Sign up</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;