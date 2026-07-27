import React, { useState, useRef } from 'react';
import { Modal } from '@mantine/core';
import UserForm from '../components/admin/user/UserForm';
import UserList from '../components/admin/user/UserList';
import { useDecimal } from '../hooks/useDecimal';


const Admin = () => {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const userListRef = useRef(null);
  const { sumDecimals, formatDisplay, cleanDecimal } = useDecimal()

  const handleSuccess = () => {
    setFormModalOpen(false);
    // Reload data using UserList's reloadData function
    if (userListRef.current?.reloadData) {
      userListRef.current.reloadData();
    }
  };

  return (
    <div>

      <UserList ref={userListRef} setModal={setFormModalOpen} />

      <Modal
        opened={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title="Add"
        size="lg"
      >
        <UserForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default Admin;
