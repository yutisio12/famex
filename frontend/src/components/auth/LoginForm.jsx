import React, { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useAuth } from '../../context/AuthContext';
import {
  Group,
  Modal,
} from '@mantine/core';
import { IconFaceId } from '@tabler/icons-react';
import FaceRecog from './FaceRecog';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!username || !password) {
      showNotification({
        title: 'Error',
        message: 'Please fill in all fields',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    const result = await login({ username, password });

    if (!result.success) {
      showNotification({
        title: 'Login Failed',
        message: result.message,
        color: 'red',
      });
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF1F5 100%)',
        zIndex: 0
      }}>
        {/* Floating Shapes */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '30%',
          width: '250px',
          height: '250px',
          background: 'rgba(118, 75, 162, 0.3)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          animation: 'float 12s ease-in-out infinite'
        }}></div>

        {/* Grid Pattern Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.3
        }}></div>
      </div>

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(30px)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo with Icon */}
        <div style={{
          textAlign: 'center',
          marginBottom: '36px'
        }}>
          {/* Custom Logo Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            position: 'relative',
            transform: 'rotate(-5deg)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-5deg) scale(1)'}
          >
            {/* Wallet Icon Design */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Wallet Body */}
              <rect x="6" y="12" width="28" height="20" rx="3" fill="white" fillOpacity="0.95" />
              <rect x="6" y="12" width="28" height="20" rx="3" stroke="white" strokeWidth="1.5" fillOpacity="0.3" />

              {/* Wallet Flap */}
              <path d="M8 12 L32 12 L32 8 C32 6.89543 31.1046 6 30 6 L10 6 C8.89543 6 8 6.89543 8 8 L8 12 Z"
                fill="white" fillOpacity="0.7" />

              {/* Card Slot */}
              <rect x="10" y="16" width="12" height="8" rx="1.5" fill="#667eea" fillOpacity="0.3" />

              {/* Dollar Sign */}
              <text x="27" y="26"
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fill: '#667eea'
                }}>$</text>
            </svg>
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1d1d1f',
            margin: '0 0 8px 0',
            letterSpacing: '-0.8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Famex
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#86868b',
            margin: 0,
            fontWeight: '500'
          }}>
            - Family Expense Management -
          </p>
        </div>

        {/* Form Fields - sama seperti sebelumnya */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '15px',
                border: `2px solid ${focusedField === 'username' ? '#667eea' : '#e5e5ea'}`,
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: 'white',
                color: '#1d1d1f',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '15px',
                border: `2px solid ${focusedField === 'password' ? '#667eea' : '#e5e5ea'}`,
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: 'white',
                color: '#1d1d1f',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <Group align="center" mb="md" noWrap gap={0}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '80%',
                height: '50px',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
                background: loading
                  ? 'linear-gradient(135deg, #8a9cee 0%, #9370b8 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                opacity: loading ? 0.8 : 1,
                transform: loading ? 'scale(0.98)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px) scale(1.01)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    border: '2.5px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
            <button
              onClick={() => setFormModalOpen(true)}
              style={{
                width: '20%',
                height: '50px',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
                background: loading
                  ? 'linear-gradient(135deg, #8a9cee 0%, #9370b8 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                opacity: loading ? 0.8 : 1,
                transform: loading ? 'scale(0.98)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px) scale(1.01)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }
              }}
            >
              <IconFaceId />
            </button>
          </Group>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                color: '#667eea',
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
                e.target.style.color = '#764ba2';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
                e.target.style.color = '#667eea';
              }}
            >
              Forgot password?
            </a>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '32px 0 28px',
          gap: '12px'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e5ea' }}></div>
          <span style={{ color: '#86868b', fontSize: '13px', fontWeight: '500' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e5ea' }}></div>
        </div>

        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#86868b'
        }}>
          Don't have an account?{' '}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
              e.target.style.color = '#764ba2';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
              e.target.style.color = '#667eea';
            }}
          >
            Sign up
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
      `}</style>
      <Modal
        opened={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
        }}
        // title="Face Recognition"
        size="lg"
      >
        <FaceRecog />
      </Modal>
    </div>
  );
};

export default LoginForm;