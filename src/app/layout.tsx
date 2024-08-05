'use client';
import type { Viewport } from 'next';
import * as React from 'react';

import '@/styles/global.css';

import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { UserProvider } from '@/contexts/user-context';
import { Provider } from 'react-redux';
import { store } from '@/store';
import dynamic from 'next/dynamic';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

const ChildComponent = ({ children }: LayoutProps) => (
  <UserProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </UserProvider>
);

const Childs = dynamic(() => Promise.resolve(ChildComponent), { ssr: false });

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <LocalizationProvider>
            <Childs>{children}</Childs>
          </LocalizationProvider>
        </Provider>
      </body>
    </html>
  );
}
