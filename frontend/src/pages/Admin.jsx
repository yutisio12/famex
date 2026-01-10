import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import UserForm from '../components/admin/user/UserForm';
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
        title="Add User"
        size="lg"
      >
        <UserForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default Admin;