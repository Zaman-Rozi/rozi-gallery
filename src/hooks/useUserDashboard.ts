'use client';

import { db, storage } from '@/confiq/firebase';
import { useUser } from '@/hooks/use-user';
import { arrayUnion, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const useUserDashboard = () => {
    const [state, setState] = useState<any>({})
    const [downloading, setDownloading] = useState<any>(false)
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
    const [filesURLs, updateFilesURL] = useState<any>({})
    const inputRef = useRef<any>()
    const { user } = useUser()
    const searchParams = useSearchParams();
    const key = searchParams.get("key");
    const gallaryId = searchParams.get("id");

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

    const onSubmitHandler = async () => {
        const { key, password, selectFiles } = state
        if (!selectFiles) {
            setErrors({
                ...errors,
                filesError: true
            })
            return
        }
        if (key && password && selectFiles) {
            if (selectFiles.length > 0) {
                inputRef.current.value = null
                setLoading(true)
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
                        setState({
                            password: "",
                            key: ""
                        })
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

    const getGallaryHandler = async () => {
        if (popupState?.password && popupState?.password?.length > 2 && gallaryId && key) {
            updateFilesURL({})
            setGetGallaryLoading(true)
            const docRef = doc(db, 'Gallaries', gallaryId, 'Gallary', `${key};${popupState?.password}`);
            try {
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    const galleryData: any = { id: docSnapshot.id, ...docSnapshot.data() };
                    updateFilesURL(galleryData)
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
        }).catch((error)=>{
            console.log(error);
            setDownloading(false)
        })
    };

    const handleGetGallary = (type: string, data?: any) => {
        if (type === 'password') {
            setPopupState({ ...popupState, password: data?.target?.value })
        }
        if (type === 'getGallary') {
            getGallaryHandler()
        }
    }
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
        downloading
    }
}

export default useUserDashboard