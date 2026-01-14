// import React from "react";
import { NavLink, Stack, MediaQuery } from '@mantine/core'
import {
  IconDashboard,
  IconCash,
  IconFaceId,
  IconUser,
  IconLogout
} from '@tabler/icons-react'
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navigation = ({ opened = true }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, role } = useAuth()

  let menuItems = [
    { icon: IconDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: IconCash, label: 'Expense', path: '/expenses' },
    { icon: IconFaceId, label: 'Profile', path: '/profile' },
    { icon: IconUser, label: 'User', path: '/admin/user' },
  ]

  const adminIndex = [0, 1, 2, 3];
  const staffIndex = [0, 1, 2];
  
  if(role == 2){
    menuItems = menuItems.filter((_, index) => 
      staffIndex.includes(index)
    );
  } else if(role == 1){
    menuItems = menuItems.filter((_, index) => 
      adminIndex.includes(index)
    );
  }


  return (
    opened ? (
      <Stack spacing={0} p="md" bg="white">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            active={location.pathname === item.path}
            label={opened ? item.label : ''}
            icon={<item.icon size="1rem" />}
            onClick={() => navigate(item.path)}
            style={{
              border: location.pathname === item.path ? '1px solid #dee2e6' : 'none',
              justifyContent: opened ? 'flex-start' : 'center',
              padding: opened ? undefined : '10px'
            }}
            title={!opened ? item.label : undefined}
          />
        ))}
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <NavLink
            label="Logout"
            icon={<IconLogout size="1rem" />}
            onClick={logout}
          />
        </MediaQuery>
      </Stack>
    ) : ''
  )

}

export default Navigation