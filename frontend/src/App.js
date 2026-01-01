import React from 'react';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './AppRouter';
import './App.css';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;