import React, { useState, useEffect } from 'react';
import {
  TextInput,
  PasswordInput,
  Select,
  Button,
  Group,
  Box
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { adminService } from '../../../services/admin';

const UserForm = ({ onSuccess, editData }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const form = useForm({
    initialValues: {
      name: '',
      username: '',
      password: '',
      role: 2
    },
    validate: {
      name: (value) => (value.length < 3 ? 'Nama too short' : null),
      username: (value) => (value.length < 3 ? 'Username too short' : null),
      password: (value) => (value.length < 6 ? 'Password Min 6 characters' : null),
      role: (value) => (!value ? 'Select role' : null),
    },
  });

  useEffect(() => {
    if (editData) {
      form.setValues({
        ...editData,
        role: editData.role ?? 2
      });

    }
  }, [editData]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
        name: values.name,
        username: values.username,
        password: values.password,
        role: parseInt(values.role, 10) || 2,
      };

      // if (editData) {
      //   await adminService.update(editData.id, payloadUpdate);
      //   showNotification({
      //     title: 'Sukses',
      //     message: 'Pengeluaran berhasil diupdate',
      //     color: 'green',
      //   });
      // } else {
      await adminService.add_user(payload);
      showNotification({
        title: 'Success',
        message: 'User added successfully',
        color: 'green',
      });
      // }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.log("err:", error)
      showNotification({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }

    setLoading(false);
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Enter name"
          {...form.getInputProps('name')}
          mb="md"
        />

        <TextInput
          label="Username"
          placeholder="Enter Username"
          {...form.getInputProps('username')}
          mb="md"
        />

        <PasswordInput
          label="Password"
          placeholder="Enter Password"
          {...form.getInputProps('password')}
          mb="md"
        />

        <Select
          label="Role"
          data={[
            { value: 2, label: 'User' },
            { value: 1, label: 'Admin' }
          ]}
          {...form.getInputProps('role')}
          mb="md"
        />

        <Group position="right">
          <Button type="submit" loading={loading}>
            {editData ? 'Update' : 'Add'} User
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default UserForm;