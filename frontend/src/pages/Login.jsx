import React from "react";
import { Container, Paper } from "@mantine/core";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <Container 
      size="xs" 
      style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Paper
        shadow="xl"
        p="xl" 
        style={{ width: '100%' }}
      >
        <LoginForm/>
      </Paper>
    </Container>
  )
}

export default Login