import React, { useState } from 'react';
import { Title, Button, Modal, Grid, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import { useDecimal } from '../hooks/useDecimal';


const Expenses = () => {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { sumDecimals, formatDisplay, cleanDecimal } = useDecimal()

  const handleSuccess = () => {
    setFormModalOpen(false);
    setRefreshKey(prev => prev + 1); // Force re-render ExpenseList
  };

  return (
    <div>
      {/* <Grid mb="xl">
        <Grid.Col span={6}>
          <Title order={1}>Expense Management</Title>
          <Text color="dimmed">Manage family income and expenses</Text>
        </Grid.Col>
        <Grid.Col span={6} style={{ textAlign: 'right' }}>
          <Button
            leftIcon={<IconPlus size="1rem" />}
            onClick={() => setFormModalOpen(true)}
            size="md"
          >
            Add New Transaction
          </Button>
        </Grid.Col>
      </Grid> */}

      <ExpenseList key={refreshKey} setModal={setFormModalOpen} />

      <Modal
        opened={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title="Add New Transaction"
        size="lg"
      >
        <ExpenseForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default Expenses;