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
import { adminService } from '../../../services/admin';
import UserForm from './UserForm';
import DataTable from '../../../components/helper_component/DataTable';

const UserList = forwardRef(({ setModal }, ref) => {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
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
      accessorKey: "id",
      header: "No",
      cell: info => info.row.index + 1,
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: info => <Text fw="bold">{info.getValue()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: info => info.getValue() || "N/A",
    },
    {
      accessorKey: "face_id",
      header: "Face ID",
      cell: info => (info.getValue() == 1 ? "Yes" : "No"),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: info => (info.getValue() == 1 ? "Admin" : "User"),
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

  const fetchUsers = async ({ page, limit, sort, search }) => {
    let data = []
    try {
      data = await adminService.user_list({
        page,
        limit,
        sort,
        search,
      })
      setLoading(false)
      return data
    } catch (error) {
      let err_message = error.response.data.message
      showNotification({
        title: 'Error',
        message: err_message,
        color: 'red',
      });
      setLoading(false)
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      return data
    }


  }

  useEffect(() => {
    fetchUsers({
      page: 1,
      limit: 10,
      sort: 'id,ASC',
    })
  }, []);

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
        if (dataTableRef.current?.loadData) {
          dataTableRef.current.loadData();
        }
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

  const handleEdit = (user) => {
    setSelectedUser(user);
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
                  onClick={() => dataTableRef.current?.loadData()}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Group>
            </Group>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <DataTable ref={dataTableRef} columns={columns} fetchData={fetchUsers} />
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
            if (dataTableRef.current?.loadData) {
              dataTableRef.current.loadData();
            }
          }}
        />
      </Modal>
    </>
  );
});

export default UserList;