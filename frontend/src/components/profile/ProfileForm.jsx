import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Text,
  NumberInput,
  Select,
  Button,
  Group,
  Box,
  FileButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCamera, IconUpload } from '@tabler/icons-react';

const ProfileForm = ({ onSuccess, editData, setModal }) => {
  const [loading, setLoading] = useState(false);

  console.log(editData)
  const form = useForm({
    initialValues: {
      name: '',
      face_id: null,
      role: 2,
      username: '',
    },
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

      const payload = [item];
      const payloadUpdate = {
        name: item.name,
      };

      onSuccess?.();
    } catch (error) {
      console.log("err:", error)
      showNotification({
        title: 'Error',
        message: 'Terjadi kesalahan',
        color: 'red',
      });
    }

    setLoading(false);
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>

        <fieldset style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
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
              {...form.getInputProps('face_id')}
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
              // onChange={setFile} 
              accept="image/png,image/jpeg"
              variant="outline"
            >
              {(props) => <Button {...props}><IconUpload /></Button>}
            </FileButton>
          </Group>

          <Group position="right">
            <Button type="submit" loading={loading}>
              Save
            </Button>
          </Group>

        </fieldset>

      </form>
    </Box>
  );
};

export default ProfileForm;