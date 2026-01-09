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
import { useDecimal } from '../../../hooks/useDecimal';

const UserList = ({ setModal }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const { sumDecimals, formatDisplay, cleanDecimal } = useDecimal()

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {

      const data = await adminService.user_list({
        page: 1,
        limit: 100,
        // search: filters.search || '',
        sort: 'id,DESC',
        // customWhere: filters.customWhere || {},
      });
      setExpenses(data.data);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to load expense data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // try {
    //   await expensesService.delete(id);
    //   showNotification({
    //     title: 'Success',
    //     message: 'Data Has Been Deleted',
    //     color: 'green',
    //   });
    //   loadExpenses();
    // } catch (error) {
    //   showNotification({
    //     title: 'Error',
    //     message: 'Failed to delete data',
    //     color: 'red',
    //   });
    // }
  };

  const handleAmount = (value) => {

    if (!value) return '';

    const numeric = value.replace(/\D/g, '');
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditModalOpen(true);
  };

  const rows = expenses.map((expense, key) => (
    <tr key={expense.id}>
      <td>
        {key + 1}
      </td>
      <td>
        <Text style={{ fontWeight: 'bold' }}>{expense.username}</Text>
      </td>
      <td>
        <Text weight={500}>{expense.name}</Text>
      </td>
      <td>
        <Text weight={500}>{expense.face_id == 1 ? 'Yes' : 'No'}</Text>
      </td>
      <td>
        <Text weight={500}>{expense.role == 1 ? 'Admin' : 'User'}</Text>
      </td>
      <td>
        <Group spacing="xs">
          <ActionIcon color="blue" onClick={() => handleEdit(expense)}>
            <IconEdit size="1rem" />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => handleDelete(expense.id)}>
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
                  onClick={loadExpenses}
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
                  <th>No</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Face ID</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Card.Section>
          {/* <Card.Section inheritPadding py="sm" withBorder>
            <Group justify="flex-end">
              <Button variant="subtle">Cancel</Button>
              <Button>Save</Button>
            </Group>
          </Card.Section> */}
        </Card>

      </ScrollArea>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Modify Expense"
        size="lg"
      >
        <UserForm
          editData={selectedExpense}
          onSuccess={() => {
            setEditModalOpen(false);
            loadExpenses();
          }}
        />
      </Modal>
    </>
  );
};

export default UserList;