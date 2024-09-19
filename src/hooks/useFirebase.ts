import { db, storage } from "@/confiq/firebase";
import { makeDocID } from "@/lib/helpers";
import { addArchivedGallaries, addFolder, removeInViewGallariesByID, updateFolders, updateFoldersLoadingStatus, updateInViewGallaries, updateInViewGallariesLoadingStatus, updateInViewGallaryItemByKey } from "@/store/reducers/data";
import { selectArchivedGallaries } from "@/store/selectors/data";
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "./use-user";
import { useExternalAPI } from "./useExternalAPI";

const useFirebase = () => {
    const { user } = useUser()
    const { sendData } = useExternalAPI()
    const dispatch = useDispatch()
    const archivedGallaries: any[] = useSelector(selectArchivedGallaries)

    const getFileUrl = async (file: File) => {
        if (file) {
            const storageRef = ref(storage, `${file?.name}_${Date.now()}` || 'others');
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        }
    }

    const addFolderForGallary = async (folderName: string) => {
        if (folderName) {
            const docRef = doc(db, 'data', user?.uid);
            dispatch(addFolder({ folderName }))
            await setDoc(docRef, { folders: arrayUnion(...[folderName]) }, {
                merge: true
            })
            return true
        }
        return false
    }

    const createGallary = async (state: any, files: string[], merge = true, userId?: string | undefined | null) => {
        if (state?.folder && (user?.uid || userId) && state?.key && state?.password) {
            const gallaryKey = `${state?.key};${state?.password}`

            const externalData = {
                email: state?.email,
                firstName: state?.firstName,
                lastName: state?.lastName,
                phoneNumber: state?.phoneNumber,
            }
            
            if (merge) {
                await sendData({ data: externalData })
            }

            if (userId || await addFolderForGallary(state?.folder)) {
                const docRef = doc(db, 'data', userId ? userId : user?.uid, 'folders', state?.folder || 'default', 'gallary', gallaryKey);
                await setDoc(docRef, { ...state, files: !merge ? files : arrayUnion(...files) }, {
                    merge: true
                })
                if (!merge) {
                    dispatch(updateInViewGallaryItemByKey({
                        gallaryKey: state?.key,
                        updateAll: { ...state, files }
                    }))
                }
                return true
            }
        }
        return false
    }

    const getUserFolders = async (userId?: string) => {
        if (user?.uid) {
            dispatch(updateFoldersLoadingStatus(true))
            const q = doc(db, "data", user?.uid);
            try {
                const data = await getDoc(q);
                if (!data.exists()) {
                    dispatch(updateFolders({ folders: [] }))
                }
                const folders = data?.data()?.folders
                dispatch(updateFolders({ folders }))
            } catch (error) {
                dispatch(updateFolders({ folders: [] }))
            } finally {
                dispatch(updateFoldersLoadingStatus(false))
            }
        } else {
            dispatch(updateFoldersLoadingStatus(true))
            const q = doc(db, "data", userId);
            try {
                const data = await getDoc(q);
                if (!data.exists()) {
                    dispatch(updateFolders({ folders: [] }))
                }
                const folders = data?.data()?.folders
                dispatch(updateFolders({ folders }))
            } catch (error) {
                dispatch(updateFolders({ folders: [] }))
            } finally {
                dispatch(updateFoldersLoadingStatus(false))
            }
        }
    }

    const getGallariesByFoldersName = async ({ folderName, userId }: any) => {
        if (userId && folderName) {
            dispatch(updateInViewGallariesLoadingStatus(true))
            const q = collection(db, "data", user?.uid, 'folders', folderName, 'gallary');
            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    dispatch(updateInViewGallaries({ gallaries: [] }))
                }
                const gallaries = querySnapshot.docs.map((doc) => doc?.data())
                dispatch(updateInViewGallaries({ gallaries }))
                const archivedGallariesG = gallaries.filter((gal: any) => (gal?.isPined && !archivedGallaries.find((arcGal: any) => arcGal?.key === gal?.key) && !archivedGallaries.find((arcGal: any) => arcGal?.folder === gal?.folder)))
                dispatch(addArchivedGallaries({ gallaries: archivedGallariesG }))
            } catch (error) {
                dispatch(updateInViewGallaries({ gallaries: [] }))
            } finally {
                dispatch(updateInViewGallariesLoadingStatus(false))
            }
        }
    }

    const getSingleGallary = async (props: any) => {
        const { folderName, key, userId, password, onSuccess, onError } = props

        if (folderName && key && userId && password && (user?.uid || userId)) {
            dispatch(updateFoldersLoadingStatus(true))
            const q = doc(db, "data", userId, 'folders', folderName, 'gallary', makeDocID(key, password));
            try {
                const querySnapshot = await getDoc(q);
                if (!querySnapshot.exists()) {
                    onError()
                    return {}
                }
                const data = querySnapshot?.data()
                onSuccess(data)
                return data
            } catch (error) {
                onError()
                return {}
            }
        }
    }

    const deleteSingleGallary = async (props: any) => {
        const { folderName, key, password, userId, onSuccess, onError } = props

        if (folderName && key && userId && password && user?.uid) {
            const docRef = doc(db, "data", userId, 'folders', folderName, 'gallary', makeDocID(key, password));
            try {
                await deleteDoc(docRef)
                dispatch(removeInViewGallariesByID({ id: makeDocID(key, password) }))
                onSuccess()
            } catch (error) {
                console.log(error);
                onError()
            }
        }
    }

    return {
        getFileUrl,
        addFolderForGallary,
        createGallary,
        getUserFolders,
        getGallariesByFoldersName,
        getSingleGallary,
        deleteSingleGallary,
    }
}

export default useFirebase