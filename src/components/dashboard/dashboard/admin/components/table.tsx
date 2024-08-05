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
import { Button, Link } from '@mui/material';

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
    setRowsPerPage?:any;
    setPage?:any;
}

export function UsersTable({
    count = 0,
    rows = [],
    page = 0,
    rowsPerPage = 0,
    admins = [],
    navigateHandler = () => { },
    setRowsPerPage,
    setPage
}: CustomersTableProps): React.JSX.Element {
    const rowIds = React.useMemo(() => {
        return rows.map((customer) => customer.id);
    }, [rows]);

    const { selectOne, deselectOne, selected } = useSelection(rowIds);


    return (
        <Card>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>F/Name</TableCell>
                            <TableCell>L/Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Terms</TableCell>
                            <TableCell>isAdmin</TableCell>
                            <TableCell>about</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: any, i) => {
                            const isSelected = selected?.has(row.id);
                            return (
                                <TableRow hover key={row.id} selected={isSelected}>
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
                                        <Checkbox
                                            checked={row?.terms}
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
                                    <TableCell>
                                        <Button onClick={() => navigateHandler(row?.uid)}>gallaries</Button>
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
                onPageChange={(_ , page)=>setPage(page)}
                onRowsPerPageChange={(e:any)=>setRowsPerPage(e.target.value)}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
}
