import React from 'react';
import { Group, Text, Button, Avatar } from '@mantine/core';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      borderBottom: '1px solid #dee2e6'
    }}>
      <Text size="xl" weight={700}>
        Famex
      </Text>

      <Group>
        <Avatar color="blue" radius="xl">
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Text>Halo, {user?.username}</Text>
        <Button variant="light" onClick={logout}>
          Logout
        </Button>
      </Group>
    </div>
  );
};

export default Header;