'use client';

import CustomModal from '@/components/common/modal';
import { db } from '@/confiq/firebase';
import { useUser } from '@/hooks/use-user';
import useFirebase from '@/hooks/useFirebase';
import { craeteURLfromGallaryID, makeDocID } from '@/lib/helpers';
import { addArchivedGallary, removeArchivedGallary, updateInViewGallaryItemByKey } from '@/store/reducers/data';
import { Button, Switch } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { doc, updateDoc } from 'firebase/firestore';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import AddDataContainer from '../dashboard/user/components/addDataContainer';
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
  const dispatch = useDispatch()
  const { deleteSingleGallary } = useFirebase()
  const [editData, setEditData] = React.useState<any>({})
  const { admin, user } = useUser()
  const DeleteFeature = ({ row }: any) => {
    const [deleting, setDeleting] = React.useState(false)

    const deleteHandler = async () => {
      setDeleting(true)
      const onSuccess = (gallary: any) => {
        setDeleting(false)
      }
      const onError = () => {
        setDeleting(false)
      }
      const payload = {
        folderName: row?.folder,
        key: row?.key,
        password: row?.password,
        userId: user?.uid,
        onSuccess,
        onError
      }
      await deleteSingleGallary(payload)
    }

    return (
      <Button
        variant='outlined'
        onClick={deleteHandler}
        style={{
          height: '36px',
        }}
        disabled={deleting}
      >
        {
          deleting ? "Deleting..." : "Delete"
        }
      </Button>
    )
  }

  const AnyOneAddThisSwitch = ({ row }: any) => {
    const changeHandler = async (status: boolean) => {
      try {
        const docRef = await doc(db, 'data', user?.uid, 'folders', row?.folder, 'gallary', makeDocID(row?.key, row?.password));
        await updateDoc(docRef, {
          ...row,
          publicallyEditable: status
        })
        dispatch(updateInViewGallaryItemByKey({ gallaryKey: row?.id, key: "publicallyEditable", value: status }))
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <Switch checked={row?.publicallyEditable} onChange={(e) => changeHandler(e.target.checked)} />
    )
  }


  const PinTOSidebarContainer = ({ row }: any) => {
    const onPin = async () => {
      dispatch(updateInViewGallaryItemByKey({ gallaryKey: row?.key, key: "isPined", value: !row?.isPined }))
      if (!row?.isPined) {
        dispatch(addArchivedGallary({ row }))
      } else {
        dispatch(removeArchivedGallary({ folderName: row?.folder, gallaryKey: row?.key }))
      }
      const docRef = await doc(db, 'data', user?.uid, 'folders', row?.folder, 'gallary', makeDocID(row?.key, row?.password));
      try {
        await updateDoc(docRef, { ...row, isPined: !row?.isPined })
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <Button
        variant='outlined'
        onClick={onPin}
        style={{
          height: '36px',
          whiteSpace: 'pre'
        }}
        disabled={admin}
      >
        {admin ? "" : row?.isPined ? "Remove from sidebar" : "Pin to sidebar"
        }
        {!admin ? "" :
          !row?.isPined ? "UnPined" : "Pined"
        }
      </Button>
    )
  }

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          {/* <TableHead> */}
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>URL</TableCell>
              <TableCell style={{ whiteSpace: 'pre' }}>First Name</TableCell>
              <TableCell style={{ whiteSpace: 'pre' }}>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Action</TableCell>
              <TableCell style={{ minWidth: '200px' }}>Anyone can add this</TableCell>
            </TableRow>
          {/* </TableHead> */}
          <TableBody>
            {rows.map((row: any, i) => {
              return (
                <TableRow hover key={i} >
                  <TableCell>{row?.key}</TableCell>
                  <TableCell>{row?.password}</TableCell>
                  <TableCell style={{ maxWidth: 'fit-content', overflow: "auto", whiteSpace: "pre" }}>
                    {craeteURLfromGallaryID({ gallaryId: row?.key, userId: galleryId, folderName: row?.folder })}
                  </TableCell>
                  <TableCell style={{ whiteSpace: 'pre' }}>{row?.firstName || "Not Provided"}</TableCell>
                  <TableCell style={{ whiteSpace: 'pre' }}>{row?.lastName || "Not Provided"}</TableCell>
                  <TableCell>{row?.email || "Not Provided"}</TableCell>
                  <TableCell>{row?.phoneNumber || "Not Provided"}</TableCell>
                  <TableCell>
                    <DeleteFeature row={row} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='outlined'
                      style={{
                        height: '36px',
                      }}
                      onClick={() => setEditData(row)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <PinTOSidebarContainer row={row} />
                  </TableCell>
                  <TableCell>
                    <AnyOneAddThisSwitch row={row} />
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
        onPageChange={(_, page: any) => setPage(page)}
        onRowsPerPageChange={(e: any) => setRowsPerPage(e.target.value)}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <CustomModal
        width={700}
        open={editData?.key}
        handleClose={() => setEditData({})}
        child={
          <Box maxHeight={'95vh'} width={'100%'} mb={'16px'}>
            <AddDataContainer handleClose={() => setEditData({})} data={editData} />
          </Box>
        }
      />
    </Card>
  );
}
