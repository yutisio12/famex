import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
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
import { expensesService } from '../../services/expenses';
import ExpenseForm from './ExpenseForm';
import { useDecimal } from '../../hooks/useDecimal';
import DataTable from '../../components/helper_component/DataTable';

const ExpenseList = forwardRef(({ setModal }, ref) => {
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const dataTableRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reloadData: () => {
      if (dataTableRef.current?.loadData) {
        dataTableRef.current.loadData();
      }
    }
  }));

  const columns = [
    {
      accessorKey: "expenses_id",
      header: "No",
      cell: info => info.row.index + 1,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: info => (
        <Badge color={info.getValue() === 2 ? 'green' : 'red'}>
          {info.getValue() === 2 ? 'Income' : 'Expense'}
        </Badge>
      ),
    },

    {
      accessorKey: "category.name",
      header: "Category",
      cell: info => <Text style={{ fontWeight: 'bold' }}>{info.getValue()}</Text>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: info => <Text weight={500}>{info.getValue()}</Text>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: info => <Text style={{ fontWeight: 'bold' }}>Rp. {handleAmount(info.getValue())}</Text>,
    },
    {
      accessorKey: "expense_date",
      header: "Expense Date",
      cell: info => <Text style={{ fontWeight: 'bold' }}>{new Date(info.getValue()).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}</Text>,
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Group spacing="xs" position="center">
          <ActionIcon color="blue" onClick={() => handleEdit(row.original)}>
            <IconEdit size="1rem" />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => handleDelete(row.original.id)}>
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      ),
    },
  ]

  const fetchExpenses = async ({ page, limit, sort, search }) => {
    const data = await expensesService.getDataTable({
      page,
      limit,
      sort,
      search,
    })
    setLoading(false)
    return data
  }

  useEffect(() => {
    fetchExpenses({
      page: 1,
      limit: 10,
      sort: 'expenses_id,DESC',
    })
  }, []);

  const handleDelete = async (id) => {
    try {
      await expensesService.delete(id);
      showNotification({
        title: 'Success',
        message: 'Data Has Been Deleted',
        color: 'green',
      });
      // loadExpenses();
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

    const clean = value.replace(/[^0-9.]/g, '');
    const integerPart = clean.split('.')[0];

    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditModalOpen(true);
  };

  if (loading) {
    return <Text>Loading data...</Text>;
  }

  return (
    <>
      <ScrollArea>

        <Card shadow="md" radius="lg" withBorder>
          <Card.Section withBorder inheritPadding py="sm">
            <Group position="apart">
              <Title order={1}>Expense List</Title>
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
                  onClick={() => dataTableRef.current?.loadData()}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Group>
            </Group>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <DataTable ref={dataTableRef} columns={columns} fetchData={fetchExpenses} />
          </Card.Section>
        </Card>

      </ScrollArea>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Modify Expense"
        size="lg"
      >
        <ExpenseForm
          editData={selectedExpense}
          onSuccess={() => {
            setEditModalOpen(false);
            dataTableRef.current?.loadData();
          }}
        />
      </Modal>
    </>
  );
});

export default ExpenseList;