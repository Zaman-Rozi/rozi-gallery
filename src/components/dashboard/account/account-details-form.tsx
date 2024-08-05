'use client';

import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import { Spinner } from '@phosphor-icons/react';
import * as React from 'react';


export function AccountDetailsForm({ user, onSave, loading }: any) {
  const [form, setForm] = React.useState<any>({
    firstName: user?.firstName,
    lastName: user?.lastName,
    city: user?.city,
    phone: user?.phone,
  })

  const onChangeHandler = (event: any) => {
    setForm({
      ...form,
      [event?.target?.name]: event?.target?.value
    })
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput defaultValue={user?.firstName} onChange={onChangeHandler} label="First name" name="firstName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput defaultValue={user?.lastName} onChange={onChangeHandler} label="Last name" name="lastName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput disabled defaultValue={user?.email} label="Email address" name="email" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput defaultValue={user?.phone} placeholder='+' onChange={onChangeHandler} label="Phone number" name="phone" type="number" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput defaultValue={user?.city} name='city' onChange={onChangeHandler} label="City" />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {
            loading ? <CircularProgress /> :
              <Button disabled={
                form?.firstName === user?.firstName &&
                form?.lastName === user?.lastName &&
                form?.phone === user?.phone &&
                form?.city === user?.city ||
                form?.firstName?.length === 0 ||
                form?.lastName?.length === 0 ||
                form?.phone?.length === 0 ||
                form?.city?.length === 0
              }
                variant="contained"
                onClick={() => onSave(form)}
              >
                Save details
              </Button>
          }
        </CardActions>
      </Card>
    </form>
  );
}
