'use client';

import { createFolderURL } from '@/lib/helpers';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
interface CustomersTableProps {
    count?: number;
    page?: number;
    rows?: any[];
    rowsPerPage?: number;
    setRowsPerPage?: any;
    setPage?: any;
    router: any
}
const FoldersTable = ({ count = 0,
    rows = [],
    page = 0,
    rowsPerPage = 0,
    setRowsPerPage,
    setPage,
    router
}: CustomersTableProps) => {
    return (
        <Card>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                        <TableRow>
                            <TableCell>Folders</TableCell>
                        </TableRow>
                    <TableBody>
                        {rows.map((row: any, i) => {
                            return (
                                <TableRow
                                    hover key={i}
                                >
                                    <TableCell
                                        onClick={() => router.push(createFolderURL(row))}
                                        style={{ cursor: 'pointer' }}
                                    >{row}</TableCell>
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
                onPageChange={(_, page: any) => setPage(page)}
                onRowsPerPageChange={(e: any) => setRowsPerPage(e.target.value)}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    )
}

export default FoldersTable