'use client'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { db } from '@/confiq/firebase';
import useUserDashboard from '@/hooks/useUserDashboard';
import { paths } from '@/paths';
import { updateAdmins, updateAdminUsers } from '@/store/reducers/admin';
import { selectAdmins, selectAdminUsers } from '@/store/selectors/admin';
import { Box, CircularProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { GallaryItem } from '../user/components/gallaryItems';
import { UsersTable } from './components/table';

export default function AdminDashboard() {
    const { key } = useUserDashboard()
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
    const [page, setPage] = React.useState<number>(0);
    const router = useRouter()
    const dispatch = useDispatch()
    const adminUsers = useSelector(selectAdminUsers)
    const admins = useSelector(selectAdmins)
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const paginatedCustomers = applyPagination(adminUsers, page, rowsPerPage);

    const getAdminUsers = async () => {
        setIsPending(true)
        const usersCollectionRef = collection(db, 'Users');
        const adminsCollectionRef = collection(db, 'Admins');

        try {
            const queryResOfUsers = await getDocs(usersCollectionRef);
            const queryResOfAdmin = await getDocs(adminsCollectionRef);
            const usersData = queryResOfUsers.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            const adminsData = queryResOfAdmin.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            dispatch(updateAdminUsers(usersData))
            dispatch(updateAdmins(adminsData))
        } catch (error) {
            console.error("Error getting users data: ", error);
        } finally {
            setIsPending(false)
        }
    }

    React.useEffect(() => {
        getAdminUsers()
    }, [])

    const navigateHandler = (id: any) => {
        router.push(`${paths.dashboard.overview}/${id}`)
    }

    return (
        <Box>
            {
                key ?
                <GallaryItem /> : <Stack spacing={3}>
                        <Stack direction="row" spacing={3}>
                            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                                <Typography variant="h4">Users</Typography>
                            </Stack>
                        </Stack>
                        <CustomersFilters placeholder="Search Users by Email" />
                        {isPending ?
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <CircularProgress />
                            </Box> :
                            <UsersTable
                                navigateHandler={navigateHandler}
                                admins={admins}
                                count={adminUsers?.length}
                                page={page}
                                rows={paginatedCustomers}
                                rowsPerPage={rowsPerPage}
                                setRowsPerPage={setRowsPerPage}
                                setPage={setPage}
                            />
                        }
                    </Stack>
            }
        </Box>
    );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
