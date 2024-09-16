'use client'
import { GallaryItem } from '@/components/dashboard/dashboard/user/components/gallaryItems';
import { Box } from '@mui/material';


export default function Page(props) {
    const { params } = props

    return (
        <Box>
            <GallaryItem params={params}/>
        </Box>
    );
}

