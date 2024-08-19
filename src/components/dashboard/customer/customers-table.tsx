'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';

import { useSelection } from '@/hooks/use-selection';
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
  galleryId?: string;
  setRowsPerPage?: any;
  setPage?: any;
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  galleryId = '',
  setRowsPerPage,
  setPage
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell> */}
              <TableCell>Key</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              {/* <TableCell>Signed Up</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, i) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell> */}

                  {/* <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}> */}
                  {/* <Avatar src={row?.avatar} /> */}
                  {/* <Typography variant="subtitle2">{i + 1}</Typography> */}
                  {/* </Stack> */}
                  <TableCell>{row?.id?.split(';')[0]}</TableCell>
                  <TableCell>{row?.id?.split(';')[1]}</TableCell>
                  <TableCell style={{maxWidth:"200px", overflow:"auto"}}>
                    {`${process.env.frontEndURL}/dashboard?key=${row?.id?.split(';')[0]}&id=${galleryId}`}
                    {/* {row?.address?.city}, {row?.address?.state}, {row?.address?.country} */}
                  </TableCell>
                  <TableCell>{row?.userDetails?.firstName}</TableCell>
                  <TableCell>{row?.userDetails?.lastName}</TableCell>
                  <TableCell>{row?.userDetails?.email}</TableCell>
                  <TableCell>{row?.userDetails?.phone}</TableCell>
                  {/* 
                  <TableCell>{row?.phone}</TableCell>
                  <TableCell>{dayjs(row?.createdAt).format('MMM D, YYYY')}</TableCell> */}
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
  );
}
