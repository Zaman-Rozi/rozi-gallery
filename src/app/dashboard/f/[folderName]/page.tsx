'use client'
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable, type Customer } from '@/components/dashboard/customer/customers-table';
import { useUser } from '@/hooks/use-user';
import useFirebase from '@/hooks/useFirebase';
import { paths } from '@/paths';
import { selectGalleries } from '@/store/selectors/aurh';
import { selectInViewGallaries, selectInViewGallariesLoading } from '@/store/selectors/data';
import { Box, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useSelector } from 'react-redux';


export default function Page(props) {
    const router = useRouter()
    const { params } = props
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
    const [page, setPage] = React.useState<number>(0);
    const galleries = useSelector(selectGalleries)
    const { getGallariesByFoldersName } = useFirebase()
    const inViewGallaries = useSelector(selectInViewGallaries)
    const paginatedCustomers = applyPagination(inViewGallaries, page, rowsPerPage);
    const isPending = useSelector(selectInViewGallariesLoading)
    const { user } = useUser()

    React.useEffect(() => {
        const { folderName } = params
        getGallariesByFoldersName({ folderName, userId: user?.uid })
    }, [])

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">{params?.folderName}</Typography>
                </Stack>
                <div>
                    <Button onClick={() => router.push(paths.dashboard.overview)} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
                        Add
                    </Button>
                </div>
            </Stack>
            <CustomersFilters setSearch={() => null} placeholder="Search by key" />
            {isPending ?
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <CircularProgress />
                </Box> : <CustomersTable
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
    return rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}