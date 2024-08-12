import CustomModal from '@/components/common/modal';
import useUserDashboard from '@/hooks/useUserDashboard';
import { Alert, Box, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import { Spinner } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import React from 'react';

const GallaryItem = () => {
    const {
        handleGetGallary,
        getGallariesErrors,
        popupState,
        getGallaryLoading,
        filesURLs,
        selectedImageURL,
        setSelectedImageURL,
        downloadImagesAsZip,
        downloading
    } = useUserDashboard()

    return (
        <Box >
            <Box maxWidth={500} mx={'auto'}>
                <Card>
                    <CardHeader subheader="Access your gallary" title="Gallary" />
                    <Divider />
                    <CardContent>
                        <Grid md={6} xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel >Password</InputLabel>
                                <OutlinedInput disabled={getGallaryLoading} value={popupState?.password} label="First name" name="firstName" onChange={(e: any) => handleGetGallary('password', e)} />
                                {getGallariesErrors?.passwordError ? <FormHelperText>{'Minimum 3 digits password allowed.'}</FormHelperText> : null}
                            </FormControl>
                        </Grid>
                    </CardContent>
                    {popupState?.notFound ?
                        <Box px={'2rem'}>
                            <Alert color={'error'}>{popupState?.errorMsg}</Alert>
                        </Box>
                        : null}
                    <CardActions>
                        {
                            getGallaryLoading ?
                                <Box display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
                                    <Spinner />
                                </Box>
                                :
                                <Button disabled={getGallaryLoading} onClick={() => handleGetGallary('getGallary')} fullWidth variant="text">
                                    Get gallary
                                </Button>
                        }
                    </CardActions>

                </Card>
            </Box>
            {
                downloading ?
                    <CircularProgress style={{ margin: '1rem auto', display: 'block' }} /> :
                    filesURLs?.filesUrls && filesURLs?.filesUrls?.length > 0 ?
                        <Button style={{ height: '48px', maxWidth: '130px', margin: '1rem auto', display: 'block' }} disabled={getGallaryLoading} onClick={() => downloadImagesAsZip({ urls: filesURLs?.filesUrls })} fullWidth variant="text">
                            Download all
                        </Button> :
                        null
            }
            {
                filesURLs?.filesUrls && filesURLs?.filesUrls?.length > 0 &&
                <Box width={'fit-content'} mx={'auto'} mt={4}>
                    <Card>
                        <CardHeader subheader="Your images" title="Images" />
                        <Box width={'content-fit'} p={'16px'} display={'flex'} gap={'16px'} flexWrap={'wrap'}>
                            {
                                filesURLs?.filesUrls?.map((url: string) => (
                                    <Image onClick={() => setSelectedImageURL(url)} style={{ borderRadius: '16px', cursor: 'pointer' }} width={200} height={200} src={url} alt='Image' />
                                ))
                            }
                        </Box>
                    </Card>
                </Box>
            }
            {
                selectedImageURL &&
                <CustomModal
                    open
                    handleClose={() => setSelectedImageURL(null)}
                    child={
                        <Box>
                            <img style={{ borderRadius: '16px', cursor: 'pointer', width: '100%', height: '100%' }} src={selectedImageURL} alt="" />
                        </Box>
                    }
                />
            }
        </Box>
    )
}

export { GallaryItem };
