import React from "react";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <div style={{
      minHeight: '100vh',
      // display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, #f5f5f7 0%, #e8e8ed 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      // padding: '20px'
    }}>
      <LoginForm />
    </div>
  );
};

export default Login;