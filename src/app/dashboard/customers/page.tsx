'use client'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';
import * as React from 'react';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { db } from '@/confiq/firebase';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserGalleries } from '@/store/reducers/auth';
import { selectGalleries } from '@/store/selectors/aurh';
import { Box, CircularProgress } from '@mui/material';

export default function Page() {
  const { user } = useUser()
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(0);

  const router = useRouter()
  const dispatch = useDispatch()
  const galleries = useSelector(selectGalleries)

  const paginatedCustomers = applyPagination(galleries, page, rowsPerPage);

  const getGalleries = async () => {
    setIsPending(true)
    const collectionRef = collection(db, 'Gallaries', user?.uid, 'Gallary');

    try {
      const querySnapshot = await getDocs(collectionRef);
      const galleriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      dispatch(updateUserGalleries(galleriesData))
    } catch (error) {
      console.error("Error getting galleries data: ", error);
    } finally {
      setIsPending(false)
    }
  }

  React.useEffect(() => {
    getGalleries()
  }, [])

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Galleries</Typography>
        </Stack>
        <div>
          <Button onClick={() => router.push(paths.dashboard.overview)} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters placeholder="Search gallary by key" />
      {isPending ?
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <CircularProgress />
        </Box> :
        <CustomersTable
          galleryId={user?.uid}
          count={galleries?.length}
          page={page}
          rows={paginatedCustomers}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
        />}
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
