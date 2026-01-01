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
  Button
} from '@mantine/core';
import { IconEdit, IconTrash, IconRefresh } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { expensesService } from '../../services/expenses';
import ExpenseForm from './ExpenseForm';
import { useDecimal } from '../../hooks/useDecimal';

const ExpenseList = () => {
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
      // const data = await expensesService.getDataTable();

      // const data = await expensesService.getAll();
      // setExpenses(data);

      const data = await expensesService.getDataTable({
        page: 1,
        limit: 100,
        // search: filters.search || '',
        sort: 'expenses_id,DESC',
        // customWhere: filters.customWhere || {},
      });
      setExpenses(data.data);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Gagal memuat data pengeluaran',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await expensesService.delete(id);
      showNotification({
        title: 'Sukses',
        message: 'Pengeluaran berhasil dihapus',
        color: 'green',
      });
      loadExpenses();
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Gagal menghapus pengeluaran',
        color: 'red',
      });
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditModalOpen(true);
  };

  const rows = expenses.map((expense) => (
    <tr key={expense.id}>
      <td>
        <Badge color={expense.type === 2 ? 'green' : 'red'}>
          {expense.type === 2 ? 'Pemasukan' : 'Pengeluaran'}
        </Badge>
      </td>
      <td>
        {/* <Text>{expense.category?.name}</Text> */}
        {/* <Text>{expense.category_id}</Text> */}
        <Text style={{ fontWeight: 'bold' }}>{expense.category.name}</Text>
      </td>
      <td>
        <Text weight={500}>{expense.description}</Text>
      </td>
      <td>
        <Text>Rp {cleanDecimal(expense.amount?.toLocaleString())}</Text>
      </td>
      <td>
        <Text>{new Date(expense.expense_date).toLocaleDateString('id-ID')}</Text>
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
    return <Text>Memuat data...</Text>;
  }

  return (
    <>
      <ScrollArea>
        <Group position="apart" mb="xl">
          <Title order={1}>Dashboard</Title>
          <Button 
            color='green'
            leftIcon={<IconRefresh size="1rem" />} 
            onClick={loadExpenses}
            loading={loading}
          >
            Refresh
          </Button>
        </Group>
        <Table verticalSpacing="sm">
          <thead>
            <tr>
              <th>Tipe</th>
              <th>Kategori</th>
              <th>Deskripsi</th>
              <th>Jumlah</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Pengeluaran"
        size="lg"
      >
        <ExpenseForm
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

export default ExpenseList;