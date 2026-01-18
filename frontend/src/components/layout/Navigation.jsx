// import React from "react";
import { NavLink, Stack, MediaQuery, Drawer, } from '@mantine/core'
import {
  IconDashboard,
  IconCash,
  IconFaceId,
  IconUser,
  IconLogout,
} from '@tabler/icons-react'
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navigation = ({ opened = true, onClose, isMobile }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, role } = useAuth()
  const Wrapper = isMobile ? Drawer : Stack;

  let menuItems = [
    { icon: IconDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: IconCash, label: 'Expense', path: '/expenses' },
    { icon: IconFaceId, label: 'Profile', path: '/profile' },
    { icon: IconUser, label: 'User', path: '/admin/user' },
  ]

  const adminIndex = [0, 1, 2, 3];
  const staffIndex = [0, 1, 2];

  if (role == 2) {
    menuItems = menuItems.filter((_, index) =>
      staffIndex.includes(index)
    );
  } else if (role == 1) {
    menuItems = menuItems.filter((_, index) =>
      adminIndex.includes(index)
    );
  }


  return (
    <Wrapper
      opened={isMobile ? opened : undefined}
      onClose={isMobile ? onClose : undefined}
      size={isMobile ? "md" : undefined}
      position={isMobile ? "left" : undefined}
      spacing={0}
      p="md"
      bg="white"
      style={{
        display: !opened ? 'none' : undefined,
      }}
    >
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          active={location.pathname === item.path}
          label={opened ? item.label : ''}
          icon={<item.icon size="1rem" />}
          onClick={() => {
            navigate(item.path)
            if (isMobile) {
              onClose()
            }
          }}
          style={{
            border: location.pathname === item.path ? '1px solid #dee2e6' : 'none',
            justifyContent: opened ? 'flex-start' : 'center',
            padding: opened ? undefined : '10px'
          }}
          title={!opened ? item.label : undefined}
        />
      ))}
      <MediaQuery
        largerThan="sm"
      // styles={{ display: 'none' }}
      >
        <NavLink
          label="Logout"
          icon={<IconLogout size="1rem" color="#b60d0dff" />}
          onClick={logout}
          style={{
            boxShadow: '0 0 10px rgba(172, 18, 18, 0.2)',
            color: '#b60d0dff',
            borderRadius: '5px',
            marginTop: '10px',
          }}
        />
      </MediaQuery>
    </Wrapper>
  )

}

export default Navigation