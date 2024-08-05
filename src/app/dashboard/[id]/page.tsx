'use client'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { db } from '@/confiq/firebase';
import { updateAdminGallaries } from '@/store/reducers/admin';
import { selectAdminGalleries } from '@/store/selectors/admin';
import { collection, getDocs } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { useUser } from '@/hooks/use-user';

export default function Page() {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const pathname = usePathname()
  const { isAdmin, user } = useUser()
  if (!pathname?.split('/')?.[2]) {
    return
  }
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(0);
  const dispatch = useDispatch()
  const galleries = useSelector(selectAdminGalleries);
  const paginatedCustomers = applyPagination(galleries, page, rowsPerPage);

  const getGalleries = async (str: string) => {
    if (user?.email) {
      const admin = await isAdmin(user?.email)
      if (admin) {
        setIsPending(true)
        if (str) {
          const collectionRef = collection(db, 'Gallaries', str, 'Gallary');
          try {
            const querySnapshot = await getDocs(collectionRef);
            const galleriesData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }));
            if (galleriesData?.length === 0) {
              dispatch(updateAdminGallaries([]))
            } else {
              dispatch(updateAdminGallaries(galleriesData))
            }
          } catch (error) {
            console.error("Error getting galleries data: ", error);
          } finally {
            setIsPending(false)
          }
        }
      }
    }
  }

  React.useEffect(() => {
    if (pathname?.split('/')?.[2]) {
      getGalleries(pathname?.split('/')?.[2])
    }
  }, [pathname])
  return (
    <div>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4" >Galleries</Typography>
          </Stack>
        </Stack>
        <CustomersFilters search={search} setSearch={setSearch} placeholder="Search gallary by key" />
        {isPending ?
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <CircularProgress />
          </Box> :
          <CustomersTable
            galleryId={pathname?.split('/')?.[2]}
            count={galleries?.length}
            page={page}
            rows={paginatedCustomers}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setPage={setPage}
          />
        }
      </Stack>
    </div>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
