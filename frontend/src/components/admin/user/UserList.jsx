import React, { useState, useEffect } from 'react';
import {
  Table,
  ActionIcon,
  Group,
  Text,
  Badge,
  Modal,
  ScrollArea,
  Title,
  Button,
  Card
} from '@mantine/core';
import { IconEdit, IconTrash, IconRefresh, IconPlus } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { adminService } from '../../../services/admin';
import UserForm from './UserForm';

const UserList = ({ setModal }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {

      const data = await adminService.user_list({
        page: 1,
        limit: 10,
        // search: filters.search || '',
        sort: 'id,ASC',
        // customWhere: filters.customWhere || {},
      });
      setUsers(data.data);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to load data user',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await adminService.update_user({
        id,
        status_active: 0
      });

      if (result == 'OK') {
        showNotification({
          title: 'Success',
          message: 'Data Has Been Deleted',
          color: 'green',
        });
        loadUsers();
      } else {
        showNotification({
          title: 'Error',
          message: 'Failed to delete data',
          color: 'red',
        });
      }

    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to delete data',
        color: 'red',
      });
    }
  };

  const handleAmount = (value) => {

    if (!value) return '';

    const numeric = value.replace(/\D/g, '');
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const rows = users.map((value, key) => (
    <tr key={value.id} style={{ textAlign: 'center' }}>
      <td>
        {key + 1}
      </td>
      <td>
        <Text style={{ fontWeight: 'bold' }}>{value.username}</Text>
      </td>
      <td>
        <Text weight={500}>{value.name ?? 'N/A'}</Text>
      </td>
      <td>
        <Text weight={500}>{value.face_id == 1 ? 'Yes' : 'No'}</Text>
      </td>
      <td>
        <Text weight={500}>{value.role == 1 ? 'Admin' : 'User'}</Text>
      </td>
      <td>
        <Group spacing="xs">
          <ActionIcon color="blue" onClick={() => handleEdit(value)}>
            <IconEdit size="1rem" />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => handleDelete(value.id)}>
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  if (loading) {
    return <Text>Loading data...</Text>;
  }

  return (
    <>
      <ScrollArea>

        <Card shadow="md" radius="lg" withBorder>
          <Card.Section withBorder inheritPadding py="sm">
            <Group position="apart">
              <Title order={1}>User List</Title>
              <Group justify="flex-end">
                <Button
                  color='violet'
                  leftIcon={<IconPlus size="1rem" />}
                  onClick={() => setModal(true)}
                >
                  New
                </Button>
                <Button
                  color='blue'
                  leftIcon={<IconRefresh size="1rem" />}
                  onClick={loadUsers}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Group>
            </Group>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <Table verticalSpacing="sm">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>No</th>
                  <th style={{ textAlign: 'center' }}>Username</th>
                  <th style={{ textAlign: 'center' }}>Name</th>
                  <th style={{ textAlign: 'center' }}>Face ID</th>
                  <th style={{ textAlign: 'center' }}>Role</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Card.Section>
        </Card>

      </ScrollArea >

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit User"
        size="lg"
      >
        <UserForm
          editData={selectedUser}
          onSuccess={() => {
            setEditModalOpen(false);
            loadUsers();
          }}
        />
      </Modal>
    </>
  );
};

export default UserList;