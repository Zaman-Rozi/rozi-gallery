import CustomModal from '@/components/common/modal';
import useFirebase from '@/hooks/useFirebase';
import { downloadImagesAsZip } from '@/lib/helpers';
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
import AddDataContainer from './addDataContainer';

const GallaryItem = ({ params }: any) => {
    const [editData, setEditData] = React.useState<any>({})
    const [password, setPassword] = React.useState<string>('')
    const [selectedImageURL, setSelectedImageURL] = React.useState<string | null>(null)
    const [notFound, setNotFound] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [downloading, setDownloading] = React.useState<boolean>(false)
    const [data, setData] = React.useState<any>({})
    const { getSingleGallary } = useFirebase()

    const onSubmit = async () => {
        if (password.length <= 2) {
            return
        }
        const onSuccess = (gallary: any) => {
            setPassword('')
            setData(gallary)
            setLoading(false)
        }
        const onError = () => {
            setLoading(false)
            setNotFound(true)
        }
        const payload = {
            folderName: params?.folderName,
            key: params?.key,
            userId: params?.userId,
            password,
            onSuccess,
            onError
        }
        setLoading(true)
        await getSingleGallary(payload)
    }

    const downloadFilesHandler = () => {
        const onSuccess = () => {
            setDownloading(false)
        }
        const onError = () => {
            setDownloading(false)
        }
        setDownloading(true)
        downloadImagesAsZip({
            urls: data?.files,
            onSuccess,
            onError
        })
    }

    const onPasswordChange = (password) => {
        setPassword(password)
        setNotFound(false)
        setData({})
    }

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
                                <OutlinedInput disabled={false} value={password} label="First name" name="firstName" onChange={(e) => onPasswordChange(e.target.value)} />
                                {password.length < 3 ? <FormHelperText>{'Minimum 3 digits password allowed.'}</FormHelperText> : null}
                            </FormControl>
                        </Grid>
                    </CardContent>
                    {notFound ?
                        <Box px={'2rem'}>
                            <Alert color={'error'}>{'Gallary not exist.'}</Alert>
                        </Box>
                        : null}
                    <CardActions>
                        {
                            loading ?
                                <Box display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
                                    <Spinner />
                                </Box>
                                :
                                <Box width={'100%'}>
                                    {data?.publicallyEditable &&
                                        <Button disabled={loading} onClick={() => setEditData(data)} fullWidth variant="text">
                                            Edit
                                        </Button>
                                    }
                                    <Button disabled={loading} onClick={onSubmit} fullWidth variant="text">
                                        Get gallary
                                    </Button>
                                </Box>
                        }
                    </CardActions>
                </Card>
            </Box>
            {
                downloading ?
                    <CircularProgress style={{ margin: '1rem auto', display: 'block' }} /> :
                    data?.files && data?.files?.length > 0 ?
                        <Button style={{ height: '48px', maxWidth: '130px', margin: '1rem auto', display: 'block' }} disabled={loading} onClick={downloadFilesHandler} fullWidth variant="text">
                            Download all
                        </Button> :
                        null
            }
            {
                data?.files && data?.files?.length > 0 &&
                <Box width={'fit-content'} mx={'auto'} mt={4}>
                    <Card>
                        <CardHeader subheader="Your images" title="Images" />
                        <Box width={'content-fit'} p={'16px'} display={'flex'} gap={'16px'} flexWrap={'wrap'}>
                            {
                                data?.files?.map((url: string) => (
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
            <CustomModal
                width={700}
                open={editData?.key}
                handleClose={() => {
                    setEditData({})
                }}
                child={
                    <Box maxHeight={'95vh'} width={'100%'} mb={'16px'}>
                        <AddDataContainer userId={params?.userId} handleClose={() => setEditData({})} data={editData} />
                    </Box>
                }
            />
        </Box>
    )
}

export { GallaryItem };
