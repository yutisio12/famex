import React, { useState, useEffect } from 'react';
import {
  // TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  Box,
  Textarea
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { expensesService } from '../../services/expenses';

const ExpenseForm = ({ onSuccess, editData }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const form = useForm({
    initialValues: {
      amount: '',
      description: '',
      category_id: '',
      expense_date: new Date(),
      type: '1'
    },
    validate: {
      amount: (value) => (value <= 0 ? 'Jumlah harus lebih dari 0' : null),
      description: (value) => (value.length < 3 ? 'Deskripsi terlalu pendek' : null),
      category_id: (value) => (!value ? 'Pilih kategori' : null),
    },
  });

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return null;

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (form.values.type) {
      loadCategory()
    }
  }, [form.values.type]);

  const loadCategory = async () => {
    try {
      setLoading(true);

      const data = await expensesService.category();
      const filteredCategories = data.filter(e => e.type == form.values.type)
      console.log(form.values.type)
      setCategories(filteredCategories);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Gagal memuat data category',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editData) {
      form.setValues({
        ...editData,
        amount: Number(editData.amount),
        expense_date: new Date(editData.expense_date),
        type: String(editData.type ?? '1'),
        category_id: String(editData.category_id ?? '')
      });

      if (editData.type) {
        loadCategory(editData.type);
      }
    } else {
      loadCategory(form.values.type)
    }
  }, [editData]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const item = {
        type: parseInt(values.type, 10) || 1,
        category_id: parseInt(values.category_id, 10),
        amount: Number(values.amount),
        description: values.description,
        // expense_date:
        //   values.expense_date instanceof Date
        //     ? values.expense_date.toISOString().slice(0, 10)
        //     : values.expense_date
        expense_date: values.expense_date
      };

      const formattedData = {
        ...item,
        expense_date: formatDateToYYYYMMDD(item.expense_date)
      };

      const payload = [item];
      const payloadUpdate = {
        type: item.type,
        category_id: item.category_id,
        amount: item.amount,
        description: item.description,
        expense_date: item.expense_date,
      };

      if (editData) {
        // console.log("Pl:", editData)
        await expensesService.update(editData.id, payloadUpdate);
        showNotification({
          title: 'Success',
          message: 'Expense updated successfully',
          color: 'green',
        });
        // return // belum dibuat updatenya
      } else {
        await expensesService.create(payload);
        showNotification({
          title: 'Success',
          message: 'Expense added successfully',
          color: 'green',
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.log("err:", error)
      showNotification({
        title: 'Error',
        message: 'An error occurred',
        color: 'red',
      });
    }

    setLoading(false);
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <NumberInput
          label="Amount"
          placeholder="Enter amount"
          min={0}
          // precision={2}
          disableScrollWheel
          thousandSeparator="."
          parser={(value) => value.replace(/\./g, '').replace(',', '.')}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? value
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
              : ''
          }
          {...form.getInputProps('amount')}
          mb="md"
        />

        <Textarea
          label="Description"
          placeholder="Enter description"
          {...form.getInputProps('description')}
          mb="md"
        />


        <DatePicker
          label="ExpenseDate"
          {...form.getInputProps('expense_date')}
          mb="md"
        />

        <Select
          label="Type"
          data={[
            { value: '1', label: 'Expense' },
            { value: '2', label: 'Income' }
          ]}
          {...form.getInputProps('type')}
          mb="md"
        />

        <Select
          label="Category"
          placeholder="Select category"
          data={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
          {...form.getInputProps('category_id')}
          mb="md"
        />

        <Group position="right">
          <Button type="submit" loading={loading}>
            {editData ? 'Update' : 'Add'} Expense
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default ExpenseForm;