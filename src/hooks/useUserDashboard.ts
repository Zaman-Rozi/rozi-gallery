'use client';

import { db, storage } from '@/confiq/firebase';
import { useUser } from '@/hooks/use-user';
import { updateSearchData, updateUserGallaryItemByKey } from '@/store/reducers/auth';
import { selectSearchData } from '@/store/selectors/aurh';
import { saveAs } from 'file-saver';
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import JSZip from 'jszip';
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useUserDashboard = (props) => {
    const [state, setState] = useState<any>({})
    const [downloading, setDownloading] = useState<any>(false)
    const [limitOut, setLimitOut] = useState<any>(false)
    const [popupState, setPopupState] = useState<any>({
        popupState: ""
    })
    const [errors, setErrors] = useState<any>({
        keyError: true,
        passwordError: true
    })
    const [getGallariesErrors, setGetGallariesErrors] = useState<any>({
        passwordError: true
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [successPopup, setSuccessPopup] = useState<boolean>(false)
    const [selectedImageURL, setSelectedImageURL] = useState<any>(null)
    const [getGallaryLoading, setGetGallaryLoading] = useState<boolean>(false)
    const filesURLs = useSelector(selectSearchData)
    const inputRef = useRef<any>()
    const { user } = useUser()
    const searchParams = useSearchParams();
    const key = searchParams.get("key");
    const gallaryId = searchParams.get("id");
    const dispatch = useDispatch()

    useEffect(() => {
        if (state?.key && state?.key?.length > 2) {
            setErrors({
                ...errors,
                keyError: false
            })
        } else {
            setErrors({
                ...errors,
                keyError: true
            })
        }
    }, [state?.keyError])

    useEffect(() => {
        if (state?.selectFiles && state?.selectFiles?.length > 0) {
            setErrors({
                ...errors,
                filesError: false
            })
        } else {
            setErrors({
                ...errors,
                filesError: true
            })
        }
    }, [state?.selectFiles])

    const onChangeHandler = (type: string, e: any) => {
        if (type === 'password' && e?.target?.value?.length > 2) {
            setErrors({
                ...errors,
                passwordError: false
            })
        } else {
            setErrors({
                ...errors,
                passwordError: true
            })
        }
        if (type === 'selectFiles') {
            setState({ ...state, [type]: Array.from(e?.target?.files) })
            return
        }
        setState({ ...state, [type]: e?.target?.value })
    }

    const getAllowedReq = async () => {
        if (!user?.uid) {
            console.error('User UID is not defined');
            return 0
        }

        const usersCollection = collection(db, 'Users');
        const q = query(usersCollection, where('uid', '==', user.uid));

        try {
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log('No matching documents.');
                return 0;  // Return 0 or handle this case as needed
            } else {
                const galleries = [];
                querySnapshot.forEach((doc) => {
                    galleries.push({ id: doc.id, ...doc.data() });
                });
                return Number(galleries?.[0]?.gallariesLimit);  // Return the retrieved documents
            }
        } catch (error) {
            console.error('Error checking value: ', error);

            return 0
        }
    };

    const getGalleriesL = async () => {
        const collectionRef = collection(db, 'Gallaries', user?.uid, 'Gallary');
        try {
            const querySnapshot = await getDocs(collectionRef);
            const galleriesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
            }));
            return galleriesData?.length || 0
        } catch (error) {
            console.error("Error getting galleries data: ", error);
            return 0
        }
    }

    const onSubmitHandler = async () => {
        console.log(state);
        const { key, password, selectFiles } = state
        console.log(state);
        if (!selectFiles) {
            setErrors({
                ...errors,
                filesError: true
            })
            return
        }
        if (key && password && selectFiles) {
            setLoading(true)
            if (selectFiles.length > 0) {
                const totalGallaries: number = await getGalleriesL()
                const allowNoOfGallaries: number = await getAllowedReq()
                // @ts-ignore
                if (totalGallaries >= allowNoOfGallaries) {
                    setLimitOut(true)
                    setLoading(false)
                    return
                } else {
                    setLimitOut(false)
                }

                inputRef.current.value = null
                let filesUrls: string[] = await Promise.all(
                    selectFiles.map(async (file: any) => {
                        const storageRef = ref(storage, file?.name || 'others');
                        const snapshot = await uploadBytes(storageRef, file);
                        const downloadURL = await getDownloadURL(snapshot.ref);
                        return downloadURL;
                    })
                );
                if (filesUrls?.length > 0 && user?.uid) {
                    try {
                        const docRef = doc(db, 'Gallaries', user?.uid);
                        const subcollectionRef = collection(docRef, 'Gallary');
                        const specificDocRef = doc(subcollectionRef, `${key};${password}`);

                            await setDoc(specificDocRef,
                                {
                                    filesUrls: arrayUnion(...filesUrls),
                                    userDetails: {
                                        firstName: state.firstName,
                                        lastName: state.lastName,
                                        email: state.email,
                                        phone: state.phone,
                                    }
                                },
                                {
                                    merge: true
                                },

                            );
                        setSuccessPopup(true)
                    } catch (error) {
                        console.log(error);
                    } finally {
                        const existingData = props?.existingData || {}
                        if (existingData && existingData?.id) {
                            props?.handleClose && props?.handleClose()
                            if (key && gallaryId) {
                                handleGetGallary('getGallary', password)
                            }
                            const docId = existingData?.id || ''
                            const docFiles = existingData?.filesUrls || []
                            dispatch(updateUserGallaryItemByKey({
                                id: docId,
                                key: "userDetails",
                                value: {
                                    firstName: state.firstName,
                                    lastName: state.lastName,
                                    email: state.email,
                                    phone: state.phone,
                                }
                            }))
                            dispatch(updateUserGallaryItemByKey({
                                id: docId,
                                key: "filesUrls",
                                value: [...docFiles, ...filesUrls]
                            }))
                        } else {
                            setState({
                                password: "",
                                key: ""
                            })
                        }
                        setLoading(false)
                    }
                } else {
                    setLoading(false)
                    return;
                }
            } else {
                setLoading(false)
                return;
            }

        }
    }

    const handleMethod = (type: string, data?: any) => {
        if (type === 'key' || type === 'password' || type === 'firstName' || type === 'lastName' || type === 'email' || type === 'phone') {
            onChangeHandler(type, data)
        }
        if (type === 'upload') {
            inputRef.current?.click()
        }
        if (type === 'selectFiles') {
            onChangeHandler(type, data)
        }
        if (type === 'onSubmit') {
            onSubmitHandler()
        }
    }

    const getGallaryHandler = async (password?: string) => {
        if ((popupState?.password && popupState?.password?.length > 2 || password) && gallaryId && key) {
            dispatch(updateSearchData({}))
            setGetGallaryLoading(true)
            const docRef = doc(db, 'Gallaries', gallaryId, 'Gallary', `${key};${password || popupState?.password}`);
            try {
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    const galleryData: any = { id: docSnapshot.id, ...docSnapshot.data() };
                    dispatch(updateSearchData(galleryData))
                    setPopupState({ ...popupState, password: '', notFound: false })
                } else {
                    setPopupState({ ...popupState, password: '', notFound: true, errorMsg: 'Not found' })
                }
            } catch (error) {
                setPopupState({ ...popupState, password: '', notFound: true, errorMsg: 'Something went wrong' })
                console.error('Error getting gallery data:', error);
            } finally {
                setGetGallaryLoading(false)
            }
        }
    }

    const downloadImagesAsZip = async ({ urls }: any) => {
        setDownloading(true)
        const zip = new JSZip();
        const imgFolder = zip.folder('images');

        const fetchImage = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const blob = await response.blob();
                return blob;
            } catch (error) {
                console.error('Error fetching image:', error);
                return null;
            }
        };

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const blob = await fetchImage(url);
            if (blob) {
                imgFolder.file(`image${i + 1}.jpg`, blob);
            }
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'images.zip');
            setDownloading(false)
        }).catch((error) => {
            console.log(error);
            setDownloading(false)
        })
    };

    const handleGetGallary = (type: string, data?: any) => {
        if (type === 'password') {
            setPopupState({ ...popupState, password: data?.target?.value })
        }
        if (type === 'getGallary') {
            getGallaryHandler(data)
        }
    }

    useEffect(() => {
        const existingData = props?.existingData || {}
        const details = existingData?.userDetails || {}
        const docId = existingData?.id || ''
        const docFiles = existingData?.filesUrls || ''
        if (props?.existingData && props?.existingData?.id) {
            setState({
                email: details?.email || "",
                firstName: details?.firstName || "",
                lastName: details?.lastName || "",
                phone: details?.phone || "",
                key: docId?.split(';')?.[0] || "",
                password: docId?.split(';')?.[1] || "",
                userFiles: docFiles || []
            })
        }
    }, [props?.existingData])

    const onSingleDeleteHandler = async (item: string) => {
        if (props?.existingData) {
            const filteredFiles = state?.userFiles?.filter((file: string) => file !== item)
            setState({
                ...state,
                userFiles: filteredFiles || []
            })
            const existingData = props?.existingData || {}
            const docId = existingData?.id || ''
            const payload = {
                id: docId,
                key: "filesUrls",
                value: filteredFiles
            }
            dispatch(updateUserGallaryItemByKey(payload))
            if (filesURLs && gallaryId && key) {
                console.log(state);

                dispatch(updateSearchData({ ...filesURLs, filesUrls: filteredFiles }))
            }
            try {
                const docRef = doc(db, 'Gallaries', user?.uid, 'Gallary', docId);
                await updateDoc(docRef, {
                    filesUrls: arrayRemove(item)
                });
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        dispatch(updateSearchData({}))
    }, [])

    return {
        loading,
        errors,
        handleMethod,
        inputRef,
        key,
        handleGetGallary,
        getGallariesErrors,
        popupState,
        getGallaryLoading,
        filesURLs,
        state,
        selectedImageURL,
        setSelectedImageURL,
        successPopup,
        setSuccessPopup,
        downloadImagesAsZip,
        downloading,
        limitOut,
        onSingleDeleteHandler
    }
}

export default useUserDashboard