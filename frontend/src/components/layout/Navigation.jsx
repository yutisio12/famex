// import React from "react";
import { NavLink, Stack } from '@mantine/core'
import {
  IconDashboard,
  IconCash,
  IconFaceId,
  IconUser,
  IconLogout
} from '@tabler/icons-react'
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const menuItems = [
    { icon: IconDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: IconCash, label: 'Expense', path: '/expenses' },
    { icon: IconFaceId, label: 'Profile', path: '/profile' },
  ]

  return (
    <Stack spacing={0} p="md">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          active={location.pathname === item.path}
          label={item.label}
          icon={<item.icon size="1rem" />}
          onClick={() => navigate(item.path)}
        />
      ))}
      <NavLink
        label="logout"
        icon={<IconLogout size="1rem" />}
        onClick={logout}
      />
    </Stack>
  )

}

export default Navigation