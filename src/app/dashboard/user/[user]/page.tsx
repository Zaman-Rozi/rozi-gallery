'use client'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import * as React from 'react';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import FoldersTable from '@/components/dashboard/dashboard/user/components/foldersTable';
import { paths } from '@/paths';
import { selectGalleries } from '@/store/selectors/aurh';
import { selectFoldersLoading, selectUserFolders } from '@/store/selectors/data';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import useFirebase from '@/hooks/useFirebase';

export default function Page({ params }: any) {
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(0);
  const {getUserFolders} = useFirebase()
  const router = useRouter()
  const galleries = useSelector(selectGalleries)
  const userFolders = useSelector(selectUserFolders)
  const paginatedCustomers = applyPagination(userFolders, page, rowsPerPage);
  const isPending = useSelector(selectFoldersLoading)
  React.useEffect(() => {
    if (params && params?.user) {
      getUserFolders(params?.user)
    }
  }, [])
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Folder</Typography>
        </Stack>
        <div>
          <Button onClick={() => router.push(paths.dashboard.overview)} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters setSearch={() => null} placeholder="Search folder" />
      {isPending ?
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <CircularProgress />
        </Box> : <FoldersTable
          count={galleries?.length}
          page={page}
          rows={paginatedCustomers}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          router={router}
        />}
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}