import React, { useState, useEffect } from 'react';
import { Title, Button, Modal, Grid, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import RegisterFace from '../components/profile/RegisterFace';
import ProfileForm from '../components/profile/ProfileForm';
import { authService } from '../services/auth';
import { showNotification } from '@mantine/notifications';

const Profile = () => {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  useEffect(() => {
    loadMyProfile();
  }, []);

  const loadMyProfile = async () => {
    try {
      const data = await authService.profile();
      setEditData(data)
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to load profile data',
        color: 'red',
      });
    }
  };

  return (
    <div>
      <Grid>
        <Grid.Col span={3}></Grid.Col>
        <Grid.Col span={6} style={{ textAlign: 'left', flex: 'center' }}>
          <ProfileForm editData={editData} setModal={setFormModalOpen} />
        </Grid.Col>
        <Grid.Col span={3}></Grid.Col>
      </Grid>

      <Modal
        opened={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
        }}
        // title="Register Face"
        size="lg"
        destroyOnClose
      >
        <RegisterFace />
      </Modal>
    </div>
  );
};

export default Profile;