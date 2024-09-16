'use client'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import * as React from 'react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';
import { useUser } from '@/hooks/use-user';
import useFirebase from '@/hooks/useFirebase';
import useUserDashboard from '@/hooks/useUserDashboard';
import { selectArchivedGallaries, selectUserFolders } from '@/store/selectors/data';
import { useSelector } from 'react-redux';

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

export default function Layout({ children   }: LayoutProps): React.JSX.Element {
  const { key } = useUserDashboard({})
  const { admin, user } = useUser()
  const archivedGallary = useSelector(selectArchivedGallaries)
  const folders: any[] = useSelector(selectUserFolders)
  let getArcStories = 1
  const { getUserFolders, getGallariesByFoldersName } = useFirebase()

  const getInitialData = async () => {
    await getUserFolders()
  };
  
  React.useEffect(() => {
    if (folders && folders?.length > 0) {
      folders?.forEach((folder: string) => getGallariesByFoldersName({ folderName: folder, userId: user?.uid }))
    }
  }, [folders])


  React.useEffect(() => {
    if (archivedGallary?.length === 0 && getArcStories === 1 && !key && !admin) {
      getArcStories = 0
      getInitialData()
    }
  }, [])

  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <SideNav />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
          {
            !key &&
            <MainNav />
          }
          <main>
            <Container maxWidth="xl" sx={{ py: '64px' }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
    </AuthGuard>
  );
}
