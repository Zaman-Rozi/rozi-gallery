import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

export function AccountInfo({ user, onUpload, loading }: any) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user?.avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.firstName}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.lastName}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.phone}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.city}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button onClick={onUpload} fullWidth variant="text">
          {
            loading ? <CircularProgress /> :
              'Upload picture'
          }
        </Button>
      </CardActions>
    </Card>
  );
}
