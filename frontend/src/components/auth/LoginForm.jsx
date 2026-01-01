import React, { useState } from 'react';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Group, 
  Box, 
  Text 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      // username: (value) => (value.length < 3 ? 'Username terlalu pendek' : null),
      // password: (value) => (value.length < 6 ? 'Password minimal 6 karakter' : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    
    const result = await login(values);
    
    if (!result.success) {
      showNotification({
        title: 'Login Gagal',
        message: result.message,
        color: 'red',
      });
    }
    
    setLoading(false);
  };

  return (
    <Box mx="auto" style={{ maxWidth: 400 }}>
      <Text size="xl" weight={700} align="center" mb="lg">
        Login to Famex
      </Text>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Username"
          placeholder="Masukkan username"
          {...form.getInputProps('username')}
          mb="md"
        />
        
        <PasswordInput
          label="Password"
          placeholder="Masukkan password"
          {...form.getInputProps('password')}
          mb="md"
        />
        
        <Group position="right" mt="md">
          <Button type="submit" loading={loading}>
            Login
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default LoginForm;