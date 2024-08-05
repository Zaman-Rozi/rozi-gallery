'use client';
import { Box  } from '@mui/material';
import AddDataContainer from './components/addDataContainer';
import { GallaryItem } from './components/gallaryItems';
import useUserDashboard from '@/hooks/useUserDashboard';
const UserDashboard = () => {
    const { key } = useUserDashboard()

    return (
        <Box>
            {
                !key ?
                    <AddDataContainer /> : <GallaryItem />
            }
        </Box>
    )
}

export default UserDashboard