import React from 'react';
import {
  Group,
  Text,
  Button,
  Avatar,
  ActionIcon,
  CloseButton,
  MediaQuery,
  Burger
} from '@mantine/core';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IconLogout, IconMenu2 } from '@tabler/icons-react';

const Header = ({ onToggle, opened }) => {
  const { user, logout, fullName } = useAuth();
  const name = fullName?.split(' ')[0];
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid #dee2e6'
      }}
    >
      {/* LEFT */}
      <Group spacing="sm">
        <ActionIcon onClick={onToggle} variant="subtle" size="lg">
          {opened ? <CloseButton /> : <IconMenu2 size="1.4rem" />}
        </ActionIcon>

        <Text size="xl" weight={700}>
          Famex
        </Text>
      </Group>

      {/* RIGHT */}
      <Group spacing="sm">
        {/* Hide text + logout on mobile */}
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Text>
            Halo, <strong>{name}</strong>
          </Text>
        </MediaQuery>

        <Avatar
          radius="xl"
          color="violet"
          sx={{ cursor: 'pointer', border: '2px solid #dee2e6' }}
          onClick={() => navigate('/profile')}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Button
            variant="light"
            onClick={logout}
            leftIcon={<IconLogout size="1rem" />}
          >
            Logout
          </Button>
        </MediaQuery>
      </Group>
    </div>
  );
};

export default Header;
