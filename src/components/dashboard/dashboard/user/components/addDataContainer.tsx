'use client';
import useFirebase from '@/hooks/useFirebase';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Form } from './form';

const AddDataContainer = ({ data, handleClose , userId}: any) => {
    const { getFileUrl, createGallary } = useFirebase()
    const [userData, setData] = useState(false)

    useEffect(() => {
        setData(data)
    }, [data])

    const onSubmit = async (state: any, onSuccess: () => null, onError = () => null , prevFiles = []) => {
        try {
            const gallaryKey = `${state?.key};${state?.password}`
            if (state?.files && gallaryKey) {
                let files: string[] = await Promise.all(
                    state?.files?.map(async (file: any) => {
                        return await getFileUrl(file)
                    })
                );
                if (files && files?.length > 0) {

                    if (await createGallary(state, data?.key ? [ ...files , ...prevFiles ] : files, userData ? false : true , userId)) {
                        onSuccess()
                    } else {
                        onError()
                    }
                }
            }
        } catch (error) {
            onError()
        }
    }

    return (
        <Box >
            <Box maxWidth={'500px'} mx={'auto'}>
                <Form
                    onSubmit={onSubmit}
                    data={userData}
                    onClose={handleClose}
                />
            </Box>
        </Box>
    )
}

export default AddDataContainer