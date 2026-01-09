import React, { useState } from 'react';
import { Title, Button, Modal, Grid, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import UserList from '../components/admin/user/UserList';
import { useDecimal } from '../hooks/useDecimal';


const Admin = () => {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { sumDecimals, formatDisplay, cleanDecimal } = useDecimal()

  const handleSuccess = () => {
    setFormModalOpen(false);
    setRefreshKey(prev => prev + 1); // Force re-render ExpenseList
  };

  return (
    <div>

      <UserList key={refreshKey} setModal={setFormModalOpen} />

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

export default Admin;