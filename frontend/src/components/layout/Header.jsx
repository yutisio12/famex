import React from 'react';
import { Group, Text, Button, Avatar } from '@mantine/core';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout, fullName } = useAuth();
  const name = fullName?.split(' ')[0];
  const navigate = useNavigate();

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
        <Avatar
          radius="xl"
          color='violet'
          style={{
            border: '3px solid #dee2e6'
          }}
          onClick={() => {
            navigate('/profile')
          }}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>
        <Text>Halo, <strong>{name}</strong></Text>
        |
        <Button style={{ border: '1px solid #dee2e6' }} variant="light" onClick={logout}>
          Logout
        </Button>
      </Group>
    </div>
  );

};

export default Header;