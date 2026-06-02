import React from 'react';
import { Title, Text, Group, Button } from '@mantine/core';
import { IconPlus, IconRefresh } from '@tabler/icons-react';

const QuickActions = ({ fullName, onAddTransaction, onRefresh, loading }) => (
  <Group position="apart" mb="xl">
    <Group>
      <Title order={1}>Dashboard</Title>
      <Text color="dimmed" size="sm" mt={6}>
        Selamat datang, {fullName || 'User'}
      </Text>
    </Group>
    <Group>
      <Button
        leftIcon={<IconPlus size="1rem" />}
        onClick={onAddTransaction}
        size="md"
        color="violet"
      >
        Tambah Transaksi
      </Button>
      <Button
        leftIcon={<IconRefresh size="1rem" />}
        onClick={onRefresh}
        loading={loading}
        variant="light"
        size="md"
      >
        Refresh
      </Button>
    </Group>
  </Group>
);

export default QuickActions;
