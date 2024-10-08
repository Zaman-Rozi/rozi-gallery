'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { useSelection } from '@/hooks/use-selection';
import { Button, CircularProgress, Input, InputBase, Link, OutlinedInput, Switch } from '@mui/material';
import { db } from '@/confiq/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import CustomModal from '@/components/common/modal';
import { Lock, LockKey, Trash } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import { removeAdminUser, updateAdminUser } from '@/store/reducers/admin';

function noop(): void {
    // do nothing
}

export interface Customer {
    id: string;
    avatar: string;
    name: string;
    email: string;
    address: { city: string; state: string; country: string; street: string };
    phone: string;
    createdAt: Date;
}

interface CustomersTableProps {
    count?: number;
    page?: number;
    rows?: Customer[];
    rowsPerPage?: number;
    admins?: any[]
    navigateHandler?: any
    setRowsPerPage?: any;
    setPage?: any;
    getAdminUsers?: any;
}

export function UsersTable({
    count = 0,
    rows = [],
    page = 0,
    rowsPerPage = 0,
    admins = [],
    navigateHandler = () => { },
    setRowsPerPage,
    setPage,
    getAdminUsers
}: CustomersTableProps): React.JSX.Element {
    const rowIds = React.useMemo(() => {
        return rows?.map((customer) => customer?.id);
    }, [rows]);
    const [blockModak, setBlockModal] = React.useState(false)
    const [blockLoading, setBlockLoading] = React.useState(false)
    const [blockModakData, setBlockModalData] = React.useState<any>({})
    const [removeModal, setRemoveModal] = React.useState(false)
    const [removeLoading, setRemoveLoading] = React.useState(false)
    const [removeModakData, setRemoveModalData] = React.useState<any>({})
    const { selectOne, deselectOne, selected } = useSelection(rowIds);
    const dispatch = useDispatch()

    const blockUnblockHandlet = async (item: any) => {
        setBlockLoading(true)
        try {
            const docRef = doc(db, 'Users', item?.id);
            await updateDoc(docRef, {
                ...item,
                blocked: !item?.blocked
            });
            dispatch(updateAdminUser({ id: item?.id, data: { blocked: !item?.blocked } }))
        } catch (error) {
            console.error('Error updating document:', error);
        } finally {
            setBlockLoading(false)
            setBlockModal(false)
        }
    }
    const deleteHandler = async (item: any) => {
        setRemoveLoading(true)
        try {
            const docRef = doc(db, 'Users', item?.id);
            await updateDoc(docRef, {
                ...item,
                deleted: true
            });
            dispatch(removeAdminUser({ id: item?.id }))
            getAdminUsers()
        } catch (error) {
            console.error('Error updating document:', error);
        } finally {
            setRemoveLoading(false)
            setRemoveModal(false)
        }
    }

    const updateLimitHandler = async (item: any, limit: number) => {
        try {
            const docRef = doc(db, 'Users', item?.uid);
            await updateDoc(docRef, {
                ...item,
                gallariesLimit: limit || 20
            });
            dispatch(updateAdminUser({ id: item?.id, data: { gallariesLimit: limit } }))
            // getAdminUsers()
        } catch (error) {
            console.error('Error updating document:', error);
        } finally {
            setRemoveLoading(false)
            setRemoveModal(false)
        }
    }

    const MaxLimitCompo = ({ limit, row }: any) => {
        const [noOfGallaries, setNoOfGallaries] = React.useState<number>(limit || 20)
        const [editable, setEditable] = React.useState<boolean>(true)
        return (
            <Box display={'flex'} gap={'8px'} alignItems={'center'}>
                <OutlinedInput disabled={editable} onChange={(e: any) => setNoOfGallaries(e.target.value)} value={noOfGallaries} type='number' maxRows={1} onClick={(e) => e.stopPropagation()} defaultValue={20} style={{ maxHeight: "40px", minWidth: "80px", maxWidth: "100px" }} />
                <Button
                    style={{
                        width: '20px',
                        height: "30px"
                    }}
                    variant='outlined'
                    onClick={() => {
                        if (!editable) {
                            updateLimitHandler(row, noOfGallaries)
                        }
                        setEditable(!editable)
                    }}
                >
                    {
                        editable ? "Edit" : "Save"
                    }
                </Button>
            </Box>
        )
    }


    return (
        <Card>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                    {/* <TableHead> */}
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>F/Name</TableCell>
                            <TableCell>L/Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Blocked</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>No. of Gallaries</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    {/* </TableHead> */}
                    <TableBody>
                        {rows.map((row: any, i) => {
                            return (
                                <TableRow onClick={() => navigateHandler(row?.uid)} style={{ cursor: 'pointer' }} hover key={row?.id}>
                                    <TableCell>
                                        {i + 1}
                                    </TableCell>
                                    <TableCell>
                                        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                                            <Avatar src={row?.avatar} />
                                            <Typography variant="subtitle2">{row?.firstName}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {row?.lastName}
                                    </TableCell>
                                    <TableCell>
                                        {row?.email}
                                    </TableCell>
                                    <TableCell padding="checkbox">
                                        <Switch
                                            disabled={admins?.find((admin: any) => admin?.email === row?.email) && admins?.find((admin: any) => admin?.isBlocked === false)}
                                            onClick={(e: any) => e?.stopPropagation()} checked={row?.blocked} onChange={() => {
                                                setBlockModalData(row)
                                                setBlockModal(true)
                                            }} />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={admins?.find((admin: any) => admin?.email === row?.email) && admins?.find((admin: any) => admin?.isBlocked === false)}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    selectOne(row.id);
                                                } else {
                                                    deselectOne(row.id);
                                                }
                                            }}
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <MaxLimitCompo limit={row?.gallariesLimit} row={row} />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            disabled={admins?.find((admin: any) => admin?.email === row?.email) && admins?.find((admin: any) => admin?.isBlocked === false)}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setRemoveModalData(row)
                                                setRemoveModal(true)
                                            }}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>
            <Divider />
            <TablePagination
                component="div"
                count={count}
                onPageChange={(_, page) => setPage(page)}
                onRowsPerPageChange={(e: any) => setRowsPerPage(e.target.value)}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
            <CustomModal
                open={blockModak}
                handleClose={() => setBlockModal(false)}
                child={
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        flexDirection={'column'}
                        gap={'16px'}
                        alignItems={'center'}
                        py={'16px'}
                    >
                        <Lock size={'50px'} />
                        <Typography fontWeight={700}>
                            {`You really want to ${!blockModakData?.blocked ? "block" : "unblock"} this user`}
                        </Typography>
                        <Button
                            onClick={() => blockUnblockHandlet(blockModakData)}
                            style={{ fontSize: 16, fontWeight: 700, width: '100%', maxWidth: "300px" }}
                        >{
                                blockLoading ? <CircularProgress size={'24px'} /> :
                                    !blockModakData?.blocked ? "Block" : "Unblock"
                            }
                        </Button>
                    </Box>
                }
            />
            <CustomModal
                open={removeModal}
                handleClose={() => setRemoveModal(false)}
                child={
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        flexDirection={'column'}
                        gap={'16px'}
                        alignItems={'center'}
                        py={'16px'}
                    >
                        <Trash size={'50px'} />
                        <Typography fontWeight={700}>
                            {`You really want to ${!removeModakData?.deleted ? "delete" : "recover"} this user`}
                        </Typography>
                        <Button
                            onClick={() => deleteHandler(removeModakData)}
                            style={{ fontSize: 16, fontWeight: 700, width: '100%', maxWidth: "300px" }}
                        >{
                                removeLoading ? <CircularProgress size={'24px'} /> :
                                    !removeModakData?.deleted ? "Delete" : "Recover"
                            }
                        </Button>
                    </Box>
                }
            />
        </Card>
    );
}
