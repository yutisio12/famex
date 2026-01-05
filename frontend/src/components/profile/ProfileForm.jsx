import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Text,
  Select,
  Button,
  Group,
  Box,
  FileButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { authService } from '../../services/auth';
import { IconCamera, IconUpload } from '@tabler/icons-react';
import { loadFaceModels } from '../../face/loadModels';
import { getFaceDescriptor } from '../../face/getDescriptor';

const ProfileForm = ({ onSuccess, editData, setModal }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      face_id: null,
      role: 2,
      username: '',
    }
  });

  const formPassword = useForm({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },

    validate: {
      confirm_password: (value, values) =>
        value !== values.new_password ? 'Password Not Match' : null,
    },

    validateInputOnChange: true,
  });

  useEffect(() => {
  }, []);

  useEffect(() => {
    form.setValues({
      ...editData,
      name: editData.name,
      role: editData.role,
      face_id: editData.face_id,
      username: editData.username,
    });
  }, [editData]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const item = {
        name: values.name,
      };

      const payloadUpdate = {
        name: item.name,
      };

      await authService.update_profile(payloadUpdate);
      showNotification({
        title: 'Success',
        message: 'Profile has been updated',
        color: 'green',
      });

      onSuccess?.();
    } catch (error) {
      console.log("err:", error)
      showNotification({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    }
    setLoading(false);
  };

  const handleChangePassword = async (values) => {
    setLoading(true);

    try {
      const payloadUpdate = {
        current_password: values.current_password,
        new_password: values.new_password,
      };

      await authService.update_password(payloadUpdate);
      showNotification({
        title: 'Success',
        message: 'Password has been updated',
        color: 'green',
      });

      onSuccess?.();
    } catch (error) {
      console.log("err:", error)
      showNotification({
        title: 'Error',
        message: 'Failed to update password',
        color: 'red',
      });
    }
    setLoading(false);
  };

  const handleFileFace = async (uploadFile) => {
    const file = uploadFile
    if (!file) return

    try {
      await loadFaceModels()
      const descriptor = await getFaceDescriptor(file, true)

      const payloadUpdate = {
        face_id: descriptor,
      };
      await authService.update_profile(payloadUpdate);

      showNotification({
        title: 'Success',
        message: 'Face Has Been Registered',
        color: 'green',
      });
    } catch (err) {
      showNotification({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    }
  }

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>

        <fieldset style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, backgroundColor: '#FFFFFF' }}>
          <legend>
            <Text fw={500}>Profile</Text>
          </legend>

          <TextInput
            label="Username"
            placeholder="Your Username"
            {...form.getInputProps('username')}
            disabled
            mb="md"
          />

          <TextInput
            label="Name"
            placeholder="Your Name"
            {...form.getInputProps('name')}
            mb="md"
          />

          <Select
            label="Role"
            data={[
              { value: 1, label: 'Admin' },
              { value: 2, label: 'User' }
            ]}
            {...form.getInputProps('role')}
            disabled
            mb="md"
          />

          <Group align="flex-end" mb="md">
            <TextInput
              label="Face ID"
              placeholder="Your Face ID"
              value={form.values.face_id ? 'Yes' : 'No'}
              disabled
              sx={{ flex: 1 }}
            />

            <Button
              // onClick={handleTakePhoto}
              onClick={() => setModal(true)}
              variant="outline"
            >
              <IconCamera />
            </Button>
            <FileButton
              onChange={handleFileFace}
              accept="image/png,image/jpeg"
              variant="outline"
            >
              {(props) => <Button {...props}><IconUpload /></Button>}
            </FileButton>
          </Group>

          <Group position="right">
            <Button type="submit" loading={loading} onClick={handleSubmit}>
              Save
            </Button>
          </Group>

        </fieldset>

      </form>
      <br />
      <form onSubmit={formPassword.onSubmit(handleChangePassword)}>

        <fieldset style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, backgroundColor: '#FFFFFF' }}>
          <legend>
            <Text fw={500}>Change Password</Text>
          </legend>

          <TextInput
            label="Current Password"
            placeholder="Your Current Password"
            {...formPassword.getInputProps('current_password')}
            mb="md"
            type="password"
          />

          <TextInput
            label="New Password"
            placeholder="Your New Password"
            {...formPassword.getInputProps('new_password')}
            mb="md"
            type="password"
          />

          <TextInput
            label="Confirm Password"
            placeholder="Your Confirm Password"
            {...formPassword.getInputProps('confirm_password')}
            mb="md"
            type="password"
          />

          <Group position="right">
            <Button type="submit" loading={loading} onClick={handleChangePassword}>
              Save
            </Button>
          </Group>

        </fieldset>

      </form>
    </Box>
  );
};

export default ProfileForm;