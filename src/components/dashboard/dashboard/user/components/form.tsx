'use client';
import CustomModal from '@/components/common/modal';
import { addFolder } from '@/store/reducers/data';
import { selectUserFolders } from '@/store/selectors/data';
import { Avatar, Box, Button, Card, CardActions, CardHeader, Divider, MenuItem, Select, TextField, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Check, Plus, X } from '@phosphor-icons/react';
import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, FormInput } from './components';
import useFirebase from '@/hooks/useFirebase';

export const Form = (props: any) => {
    const inputRef: any = useRef()
    const [showAddPopup, setShowAddFolderPopup] = useState(false)
    const [successPopup, setSuccessPopup] = useState(false)
    const [popupImage, setPopupImage] = useState<null | string>(null)
    const userFolders = useSelector(selectUserFolders)
    const [loading, setLoading] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [uploadedFiles, setUploadedFiles] = useState([])
    const {
        onSubmit,
        data,
        onClose
    } = props

    const isExistingData = data?.key


    const STATE_OBJECT_KEYS = {
        FIRST_NAME: 'firstName',
        LAST_NAME: 'lastName',
        EMAIL: 'email',
        PHONE_NUMBER: 'phoneNumber',
        FOLDER: 'folder',
        KEY: 'key',
        PASSWORD: 'password',
        FILES: 'files',
    }

    const VALIDATION_REGEX = {
        [STATE_OBJECT_KEYS.FIRST_NAME]: /^[A-Za-z\s'-]{1,50}$/, // Allows letters, spaces, apostrophes, hyphens, up to 50 characters
        [STATE_OBJECT_KEYS.LAST_NAME]: /^[A-Za-z\s'-]{1,50}$/,  // Similar rules as first name
        [STATE_OBJECT_KEYS.EMAIL]: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Basic email validation
        [STATE_OBJECT_KEYS.PHONE_NUMBER]: /^\+?[0-9]{10,15}$/, // Allows optional leading '+' and digits (10 to 15 digits)
        [STATE_OBJECT_KEYS.FOLDER]: /^[A-Za-z0-9-_]{1,100}$/, // Allows alphanumeric, hyphen, underscore, up to 100 characters
        [STATE_OBJECT_KEYS.KEY]: /^[A-Za-z0-9-_]{1,100}$/, // Similar rules as folder
        [STATE_OBJECT_KEYS.PASSWORD]: /^.{3,}$/, // Minimum 3 characters, allows any character
    };

    const ERROR_MESSAGES = {
        [STATE_OBJECT_KEYS.FIRST_NAME]: 'First name must be between 1 to 50 characters long and can only contain letters, spaces, apostrophes, and hyphens.',
        [STATE_OBJECT_KEYS.LAST_NAME]: 'Last name must be between 1 to 50 characters long and can only contain letters, spaces, apostrophes, and hyphens.',
        [STATE_OBJECT_KEYS.EMAIL]: 'Please enter a valid email address.',
        [STATE_OBJECT_KEYS.PHONE_NUMBER]: 'Phone number must be between 10 to 15 digits and may start with a "+".',
        [STATE_OBJECT_KEYS.FOLDER]: 'Folder name must be between 1 to 100 characters long and can only contain alphanumeric characters, hyphens, and underscores.',
        [STATE_OBJECT_KEYS.KEY]: 'Key must be between 1 to 100 characters long and can only contain alphanumeric characters, hyphens, and underscores.',
        [STATE_OBJECT_KEYS.PASSWORD]: 'Password must be at least 3 characters long.',
        [STATE_OBJECT_KEYS.FILES]: 'One file should be selected',
    };

    const initialState = {
        [STATE_OBJECT_KEYS.FIRST_NAME]: '',
        [STATE_OBJECT_KEYS.LAST_NAME]: '',
        [STATE_OBJECT_KEYS.EMAIL]: '',
        [STATE_OBJECT_KEYS.PHONE_NUMBER]: '',
        [STATE_OBJECT_KEYS.FOLDER]: 'default',
        [STATE_OBJECT_KEYS.KEY]: '',
        [STATE_OBJECT_KEYS.PASSWORD]: '',
        [STATE_OBJECT_KEYS.FILES]: [],
    }

    const [state, setState] = useState<any>(initialState)
    const [folders, setFolders] = useState(userFolders || [])
    const { } = useFirebase()
    const dispatch = useDispatch()
    const [error, setError] = useState({
        name: null,
        message: ''
    })

    const validator = (state, setErrorsNull = false) => {
        let isValid = true;
        for (const key in STATE_OBJECT_KEYS) {
            const stateKey = STATE_OBJECT_KEYS[key];
            const value = state[stateKey];
            const regex = VALIDATION_REGEX[stateKey];
            const errorMessage = ERROR_MESSAGES[stateKey];

            if (!regex?.test(value) && (key?.toLowerCase() !== STATE_OBJECT_KEYS.FILES)) {
                isValid = false;
                if (!setErrorsNull) {
                    setError({
                        name: stateKey,
                        message: errorMessage
                    })
                } else {
                    setError({
                        name: null,
                        message: ''
                    })
                }
                return
            } else {
                if (key?.toLowerCase() === STATE_OBJECT_KEYS.FILES) {
                    if (value?.length <= 0) {
                        setError({
                            name: stateKey,
                            message: errorMessage
                        })
                        return
                    } else {
                        setError({
                            name: null,
                            message: ''
                        })
                    }
                }
            }
        }
        return isValid;
    };


    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value })
        setError({
            name: null,
            message: ''
        })
    }

    const setStateHandler = (key, value) => {
        setState({ ...state, [key]: value })
    }

    useEffect(() => {
        if (data) {
            setState({ ...data, files: [] })
            setUploadedFiles(data?.files)
        } else {
            setState(initialState)
        }
    }, [data])

    const onSetFolderName = () => {
        if (folderName) {
            if (!folders?.includes(folderName)) {
                setFolders([...folders, folderName])
                dispatch(addFolder({ folderName }))
            }
        }

        setShowAddFolderPopup(false)
        setStateHandler(STATE_OBJECT_KEYS.FOLDER, folderName || 'default')
        setFolderName("")
    }

    const onSubmitHandler = () => {
        const onSuccess = () => {
            if (data) {
                onClose()
            }
            setLoading(false)
            setSuccessPopup(true)
        }
        const onError = () => {
            setLoading(false)
        }
        setLoading(true)
        onSubmit(state, onSuccess, onError, uploadedFiles)
        setState(initialState)
        inputRef.current.value = null
    }

    return (
        <>
            <Card>
                <CardHeader subheader="Add your memories" title="Dashboard" />
                <Divider />
                <CardContent>
                    <Flex
                        flexDirection={'column'}
                    >
                        <FormInput
                            label="First Name"
                            value={state[STATE_OBJECT_KEYS.FIRST_NAME]}
                            name={STATE_OBJECT_KEYS.FIRST_NAME}
                            onChange={onChangeHandler}
                            errorMsg={error}
                        />
                        <FormInput
                            label="Last Name"
                            value={state[STATE_OBJECT_KEYS.LAST_NAME]}
                            name={STATE_OBJECT_KEYS.LAST_NAME}
                            onChange={onChangeHandler}
                            errorMsg={error}
                        />
                        <FormInput
                            label="Email"
                            value={state[STATE_OBJECT_KEYS.EMAIL]}
                            name={STATE_OBJECT_KEYS.EMAIL}
                            onChange={onChangeHandler}
                            errorMsg={error}
                        />
                        <FormInput
                            label="Phone Number"
                            type='number'
                            value={state[STATE_OBJECT_KEYS.PHONE_NUMBER]}
                            name={STATE_OBJECT_KEYS.PHONE_NUMBER}
                            onChange={onChangeHandler}
                            errorMsg={error}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Folder</InputLabel>
                            <Select
                                disabled={isExistingData}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={state[STATE_OBJECT_KEYS.FOLDER]}
                                label="Folder"
                                onChange={onChangeHandler}
                                name={STATE_OBJECT_KEYS.FOLDER}
                            >
                                <MenuItem value={'default'}>Default</MenuItem>
                                {
                                    folders && folders.length > 0 && (
                                        folders.map((folder, index) => (
                                            <MenuItem
                                                key={index}
                                                value={folder}
                                            >
                                                {folder}
                                            </MenuItem>
                                        ))
                                    )
                                }
                                <MenuItem
                                    onClick={() => setShowAddFolderPopup(true)}
                                    value={'add'}>
                                    <Flex
                                        alignItems={'center'}
                                    >
                                        <Plus /> Add
                                    </Flex>
                                </MenuItem>
                            </Select>
                            {
                                error?.name === STATE_OBJECT_KEYS.FOLDER && (
                                    <Typography
                                        fontSize={12}
                                        color={'red'}
                                        lineHeight={'14px'}
                                        px={'8px'}
                                        pt={'2px'}
                                    >
                                        {error?.message}
                                    </Typography>
                                )
                            }
                        </FormControl>
                        <FormInput
                            disabled={isExistingData}
                            label="Secret key"
                            value={state[STATE_OBJECT_KEYS.KEY]}
                            name={STATE_OBJECT_KEYS.KEY}
                            onChange={onChangeHandler}
                            errorMsg={error}
                        />
                        <FormInput
                            disabled={isExistingData}
                            label="Password"
                            value={state[STATE_OBJECT_KEYS.PASSWORD]}
                            name={STATE_OBJECT_KEYS.PASSWORD}
                            onChange={onChangeHandler}
                            errorMsg={error}
                        />
                        <CardActions>
                            <Flex
                                width={'100%'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                flexDirection={'column'}
                                gap={0}
                            >
                                <Button onClick={() => inputRef?.current?.click()} fullWidth variant="text">
                                    Select picture
                                </Button>
                                {
                                    error?.name === STATE_OBJECT_KEYS.FILES && (
                                        <Typography
                                            fontSize={12}
                                            color={'red'}
                                            lineHeight={'14px'}
                                            px={'8px'}
                                            pt={'2px'}
                                        >
                                            {error?.message}
                                        </Typography>
                                    )
                                }
                            </Flex>
                        </CardActions>
                    </Flex>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button
                            disabled={loading}
                            variant="contained"
                            onClick={() => validator(state) && onSubmitHandler()}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </CardActions>
                </CardContent>
                <input
                    disabled={loading}
                    accept="image/*"
                    ref={inputRef}
                    style={{ display: 'none' }}
                    type='file'
                    onChange={(e: any) => setState({ ...state, [STATE_OBJECT_KEYS.FILES]: [...Array.from(e.target.files)] })}
                    multiple
                />
                <CustomModal
                    open={showAddPopup}
                    handleClose={() => null}
                    child={
                        <Flex
                            flexDirection={'column'}
                            gap={'12px'}
                            width={'100%'}
                        >
                            <TextField
                                label="Folder"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                            />
                            <Button
                                disabled={loading}
                                variant="contained"
                                onClick={onSetFolderName}
                            >
                                Save
                            </Button>
                        </Flex>
                    }
                />
                <CustomModal
                    open={successPopup}
                    handleClose={() => setSuccessPopup(false)}
                    child={
                        <Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                flexDirection="column"
                                justifyContent="center"
                                sx={{ mb: 3 }}
                            >
                                <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64 }}>
                                    <Check fontSize="large" />
                                </Avatar>
                            </Box>
                            <Typography
                                fontWeight={700}
                                fontSize={20}
                                my={2}
                                textAlign="center"
                            >
                                Gallery saved successfully
                            </Typography>
                        </Box>
                    }
                />
            </Card>
            <Box
                pb={'16px'}
            >
                {
                    state?.files && state?.files?.length > 0 &&
                    <Box width={'fit-content'} mx={'auto'} mt={4}>
                        <Card>
                            <CardHeader subheader="Your images" title="Selected Images" />
                            <Flex width={'content-fit'} p={'16px'} flexWrap={'wrap'}>
                                {
                                    state?.files?.map((url: any) => (
                                        <Box
                                            position={'relative'}
                                            onClick={() => setPopupImage(URL.createObjectURL(url))}
                                        >
                                            <Flex
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setStateHandler('files', state?.files?.filter((file: File) => file?.name !== url?.name))
                                                }}
                                                position={'absolute'}
                                                top={-4}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                right={-4}
                                                bgcolor={'#000'}
                                                borderRadius={'50%'}
                                                width={24}
                                                height={24}
                                            >
                                                <X color='#FFF' />
                                            </Flex>
                                            <Image style={{ borderRadius: '16px', cursor: 'pointer' }} width={192} height={192} onClick={() => null} src={URL.createObjectURL(url)} alt='Image' />
                                        </Box>
                                    ))
                                }
                            </Flex>
                        </Card>
                    </Box>
                }
            </Box>
            <Box
                pb={'16px'}
            >
                {
                    uploadedFiles && uploadedFiles?.length > 0 &&
                    <Box width={'fit-content'} mx={'auto'} mt={4}>
                        <Card>
                            <CardHeader subheader="Your images" title="Images" />
                            <Flex width={'content-fit'} p={'16px'} flexWrap={'wrap'}>
                                {
                                    uploadedFiles?.map((url: any) => (
                                        <Box
                                            position={'relative'}
                                            onClick={() => setPopupImage(url)}
                                        >
                                            <Flex
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setUploadedFiles(uploadedFiles.filter((file: string) => file !== url))
                                                }}
                                                position={'absolute'}
                                                top={-4}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                right={-4}
                                                bgcolor={'#000'}
                                                borderRadius={'50%'}
                                                width={24}
                                                height={24}
                                            >
                                                <X color='#FFF' />
                                            </Flex>
                                            <Image style={{ borderRadius: '16px', cursor: 'pointer' }} width={192} height={192} onClick={() => null} src={url} alt='Image' />
                                        </Box>
                                    ))
                                }
                            </Flex>
                        </Card>
                    </Box>
                }
            </Box>
            <CustomModal
                open={popupImage}
                handleClose={() => setPopupImage(null)}
                child={
                    <Flex
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <img
                            width={'90%'}
                            height={'100%'}
                            src={popupImage}
                            alt=''
                        />
                    </Flex>
                }
            />
        </>
    )
}