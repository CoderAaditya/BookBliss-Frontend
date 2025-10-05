import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import '../styles/common.css';
import { useDispatch } from 'react-redux';
import { signup } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, BookOutlined } from '@ant-design/icons';

const SignupForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    // Validate input values
    if (!values || !values.username || !values.email || !values.password) {
      message.error('Please fill in all required fields');
      return;
    }
    
    if (values.password.length < 6) {
      message.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      const result = await dispatch(signup(values));
      if (result && result.payload && result.payload.token) {
        message.success('Signup successful');
        navigate('/');
      } else {
        form.setFields([{ name: 'email', errors: ['User already exists'] }]);
      }
    } catch (err) {
      const errorMessage = err && err.message ? err.message : 'Signup failed';
      message.error(errorMessage);
      form.setFields([{ name: 'email', errors: ['User already exists'] }]);
    } finally {
      setLoading(false);
    }
  };

  // Signup form responsibilities:
  // - Basic client-side validation (username, email, min password length)
  // - Dispatch `signup` thunk which saves token on success and populates user in redux
  // - Navigate to home on success and show helpful messages on error

  return (
    <div className="auth-container">
      <div className="auth-header">
        <BookOutlined className="auth-logo" />
        <h1 className="auth-title">Book Bliss</h1>
        <p className="auth-subtitle">Create your account</p>
      </div>
      
      <div className="auth-card">
        <Form form={form} onFinish={onFinish} layout="vertical" className="auth-form">
          <Form.Item 
            name="username" 
            rules={[
              { required: true, message: 'Please input your username' },
              { min: 3, message: 'Username must be at least 3 characters' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="auth-input-icon" />} 
              placeholder="Username" 
              size="large"
              className="auth-input"
            />
          </Form.Item>
          
          <Form.Item 
            name="email" 
            rules={[
              { required: true, message: 'Please input your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="auth-input-icon" />} 
              placeholder="Email" 
              size="large"
              className="auth-input"
            />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            rules={[
              { required: true, message: 'Please input your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
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
              Sign Up
            </Button>
          </Form.Item>
          
          <div className="auth-footer">
            <span>Already have an account? </span>
            <Link to="/login" className="auth-link">Sign in</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;