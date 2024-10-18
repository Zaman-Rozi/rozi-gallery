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
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Divider, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from '@mui/material';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { GallaryItem } from '../user/components/gallaryItems';
import { UsersTable } from './components/table';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import CustomModal from '@/components/common/modal';
import { AddUser } from './components/addUser';
import { Check } from '@phosphor-icons/react';
import { useUser } from '@/hooks/use-user';
import { sendEmailForAddUser } from '@/confiq/email';


export default function AdminDashboard() {
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
    const [page, setPage] = React.useState<number>(0);
    const router = useRouter()
    const dispatch = useDispatch()
    const adminUsers = useSelector(selectAdminUsers)
    const admins = useSelector(selectAdmins)
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const paginatedCustomers = applyPagination(adminUsers, page, rowsPerPage);
    const [successPopup, setSuccessPopup] = React.useState<boolean>(false)
    const [addUserPopup, setAddUserPopup] = React.useState<boolean>(false)
    const {admin} = useUser()

    const getAdminUsers = async () => {
        setIsPending(true)
        const usersCollectionRef = collection(db, 'Users');
        const adminsCollectionRef = collection(db, 'Admins');

        try {
            const queryResOfUsers = await getDocs(usersCollectionRef);
            const queryResOfAdmin = await getDocs(adminsCollectionRef);
            const usersData = []
            queryResOfUsers.docs.forEach((doc) => {
                if (!doc?.data()?.deleted) {
                    usersData.push(
                        {
                            id: doc.id,
                            ...doc.data()
                        }
                    )
                }
            });
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
        if (admin) {
            router.push(`${paths.dashboard.overview}/user/${id}`)
        }else{
            router.push(`${paths.dashboard.overview}/${id}`)
        }
    }

    const onAddUserHandler = async (input: string) => {
        if (input && input.length > 0) {
            setLoading(true)
            try {
                setLoading(true)
                await addDoc(collection(db, 'allowedUsers'), {
                    email: input,
                });
                sendEmailForAddUser({to_name:"user", message:"You have been invited on FocusFuse. Please create your account", email_to: input})
                setAddUserPopup(false)
                setSuccessPopup(true)
                setTimeout(() => {
                    setSuccessPopup(false)
                }, 3000);
            } catch (e) {
                console.error('Error adding document: ', e);
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <Box>
            <Stack spacing={3}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">Users</Typography>
                    </Stack>
                    <div>
                        <Button
                            onClick={() => setAddUserPopup(true)}
                            startIcon={
                                <PlusIcon fontSize="var(--icon-fontSize-md)" />
                            }
                            variant="contained">
                            Add
                        </Button>
                    </div>
                </Box>
                <CustomersFilters placeholder="Search Users by Email" />
                {isPending ?
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <CircularProgress />
                    </Box> :
                    <UsersTable
                        getAdminUsers={getAdminUsers}
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
            <CustomModal
                open={addUserPopup}
                handleClose={() => setAddUserPopup(false)}
                child={
                    <AddUser loading={loading} onAddUser={(input: string) => onAddUserHandler(input)} />
                }
            />
            <CustomModal
                open={successPopup}
                handleClose={() => setSuccessPopup(false)}
                child={
                    <Box>
                        <Box display="flex" alignItems="center" flexDirection={'column'} justifyContent="center" mb={2}>
                            <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                                <Check size={32} />
                            </Avatar>
                        </Box>
                        <Typography fontWeight={700} fontSize={20} my={4} textAlign={'center'}> Details saved successfuly</Typography>
                    </Box>
                }
            />
        </Box>
    );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
