'use client';
import CustomModal from '@/components/common/modal';
import useUserDashboard from '@/hooks/useUserDashboard';
import { Alert, Avatar, Box, Typography } from '@mui/material';
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
import { Check } from '@phosphor-icons/react';
import Image from 'next/image';
import { memo } from 'react';

const AddDataContainer = () => {
    const {
        loading,
        errors,
        handleMethod,
        inputRef,
        state,
        selectedImageURL,
        setSelectedImageURL,
        successPopup,
        setSuccessPopup
    } = useUserDashboard()


    const ImageComponents = memo(() => (
        <Box>
            {
                state?.selectFiles && state?.selectFiles?.length > 0 &&
                <Box width={'fit-content'} mx={'auto'} mt={4}>
                    <Card>
                        <CardHeader subheader="Your images" title="Images" />
                        <Box width={'content-fit'} p={'16px'} display={'flex'} gap={'16px'} flexWrap={'wrap'}>
                            {
                                state?.selectFiles?.map((url: any) => (
                                    <Image style={{ borderRadius: '16px', cursor: 'pointer' }} width={200} height={200} onClick={() => setSelectedImageURL(url)} src={URL.createObjectURL(url)} alt='Image' />
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
                            <img style={{ borderRadius: '16px', cursor: 'pointer', width: '100%', height: '100%' }} src={URL.createObjectURL(selectedImageURL)} alt="" />
                        </Box>
                    }
                />
            }
        </Box>
    ))


    return (
        <Box>
            <Box maxWidth={'500px'} mx={'auto'}>
                <Card>
                    <CardHeader subheader="Add your memories" title="Dashboard" />
                    <Divider />
                    <CardContent>
                        <Grid md={6} xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Secret key</InputLabel>
                                <OutlinedInput disabled={loading} value={state?.key} label="First name" name="firstName" onChange={(e: any) => handleMethod('key', e)} />
                                {errors?.keyError ? <FormHelperText>{'Minimum 3 digits key allowed.'}</FormHelperText> : null}

                            </FormControl>
                        </Grid>
                        <Grid md={6} xs={12} mt={4}>
                            <FormControl fullWidth required>
                                <InputLabel>Password</InputLabel>
                                <OutlinedInput disabled={loading} value={state?.password} label="First name" name="firstName" onChange={(e: any) => handleMethod('password', e)} />
                                {errors?.passwordError ? <FormHelperText>{'Minimum 3 digits password allowed.'}</FormHelperText> : null}
                            </FormControl>
                        </Grid>
                    </CardContent>
                    {errors?.filesError ?
                        <Box px={'2rem'}>
                            <Alert color={'error'}>{'Minimum 1 file allowed'}</Alert>
                        </Box>
                        : null}
                    <CardActions>
                        <Button onClick={() => handleMethod('upload')} fullWidth variant="text">
                            Select picture
                        </Button>
                    </CardActions>

                </Card>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                        disabled={loading}
                        variant="contained"
                        onClick={() => handleMethod('onSubmit')}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </CardActions>
                <input
                    disabled={loading}
                    accept="image/*"
                    ref={inputRef}
                    style={{ display: 'none' }}
                    type='file'
                    onChange={(e: any) => handleMethod('selectFiles', e)}
                    multiple
                />
            </Box>
            <ImageComponents />
            <CustomModal open={successPopup} handleClose={() => setSuccessPopup(false)} child={<Box>
                <Box display="flex" alignItems="center" flexDirection={'column'} justifyContent="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                        <Check size={32} />
                    </Avatar>
                </Box>
                <Typography fontWeight={700} fontSize={20} my={4} textAlign={'center'}> Details saved successfuly</Typography>
            </Box>} />
        </Box>
    )
}

export default AddDataContainer