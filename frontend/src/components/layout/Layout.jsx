import React, { useState } from 'react';
import { useEffect } from 'react';
import { AppShell } from '@mantine/core';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [opened, setOpened] = useState(false);

  const toggleNavigation = () => {
    setOpened((prev) => !prev);
  };

  function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
      window.matchMedia(`(max-width: ${breakpoint}px)`).matches
    );

    useEffect(() => {
      const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
      const listener = () => setIsMobile(media.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, [breakpoint]);

    return isMobile;
  }

  return (
    <AppShell
      navbar={<Navigation opened={opened} onClose={() => setOpened(false)} isMobile={useIsMobile()} />}
      header={<Header opened={opened} onToggle={toggleNavigation} />}
      footer={<Footer />}
      padding="md"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF1F5 100%)',
        color: '#1F2937',
      }}
    >
      <div style={{ minHeight: 'calc(100vh - 100px)' }}>
        {children}
      </div>
    </AppShell>
  );
};

export default Layout;
