'use client'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { useUser } from '@/hooks/use-user';
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from '@/confiq/firebase';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/store/reducers/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function Page(): React.JSX.Element {
  const { user } = useUser()
  const dispatch = useDispatch()
  const [loading, setLoading] = React.useState<boolean>(false)
  const inputRef = React.useRef<any>()


  const onSave = async (data: any) => {
    setLoading(true)
    const washingtonRef = doc(db, "Users", user?.uid);
    try {
      await updateDoc(washingtonRef, data);
      dispatch(updateUser(data))
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  const uploadHandler = async (file: any) => {
    setLoading(true)
    try {
      const storageRef = ref(storage, file?.name || 'others');
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      onSave({ avatar: downloadURL })
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo loading={loading} onUpload={() => inputRef?.current?.click()} user={user} />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm loading={loading} onSave={onSave} user={user} />
        </Grid>
      </Grid>
      <input
        disabled={loading}
        accept="image/*"
        ref={inputRef}
        style={{ display: 'none' }}
        type='file'
        onChange={(e: any) => uploadHandler(e?.target?.files[0])}
      />
    </Stack>
  );
}
