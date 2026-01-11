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

  const formEdit = useForm({
    initialValues: {
      name: '',
      username: '',
      role: 2
    },
    validate: {
      name: (value) => (value.length < 3 ? 'Nama too short' : null),
      username: (value) => (value.length < 3 ? 'Username too short' : null),
      role: (value) => (!value ? 'Select role' : null),
    },
  });

  useEffect(() => {
    if (editData) {
      formEdit.setValues({
        ...editData,
        role: editData.role ?? 2
      });

    }
  }, [editData]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      let payload = {
        name: values.name,
        username: values.username,
        password: values.password,
        role: parseInt(values.role, 10) || 2,
      };

      if (editData) {
        const { password, ...payloadEdit } = payload;
        const result = await adminService.update_user({ id: editData.id, ...payloadEdit });
        if (result != 'OK') {
          showNotification({
            title: 'Error',
            message: result.message,
            color: 'red',
          });

          setLoading(false);
          return
        }
        showNotification({
          title: 'Success',
          message: 'User updated successfully',
          color: 'green',
        });
      } else {
        const result = await adminService.add_user(payload);

        if (!result.id) {
          showNotification({
            title: 'Error',
            message: result.message,
            color: 'red',
          });

          if (result.statusCode == 409) {
            form.setValues({
              username: ''
            })
            form.setErrors({
              username: result.message
            })
          }

          setLoading(false);
          return
        }

        showNotification({
          title: 'Success',
          message: 'User added successfully',
          color: 'green',
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.response.data.message || 'Something went wrong',
        color: 'red',
      });
    }

    setLoading(false);
  };

  return (
    <Box>
      <form onSubmit={editData ? formEdit.onSubmit(handleSubmit) : form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Enter name"
          {...editData ? formEdit.getInputProps('name') : form.getInputProps('name')}
          mb="md"
        />

        <TextInput
          label="Username"
          placeholder="Enter Username"
          {...editData ? formEdit.getInputProps('username') : form.getInputProps('username')}
          mb="md"
        />
        {editData ? null : (
          <PasswordInput
            label="Password"
            placeholder="Enter Password"
            {...editData ? formEdit.getInputProps('password') : form.getInputProps('password')}
            mb="md"
          />
        )}

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