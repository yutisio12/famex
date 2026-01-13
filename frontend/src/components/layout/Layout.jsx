import React, { useState } from 'react';
import { AppShell } from '@mantine/core';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [opened, setOpened] = useState(true);

  const toggleNavigation = () => {
    setOpened((prev) => !prev);
  };

  return (
    <AppShell
      navbar={<Navigation opened={opened} />}
      header={<Header opened={opened} onToggle={toggleNavigation} />}
      footer={<Footer />}
      padding="md"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF1F5 100%)',
        color: '#1F2937',
      }}
    >
      {/* Children content */}
      <div style={{ minHeight: 'calc(100vh - 100px)' }}>
        {children}
      </div>
    </AppShell>
  );
};

export default Layout;