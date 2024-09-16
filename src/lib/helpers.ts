import { saveAs } from 'file-saver';
import JSZip from "jszip";

interface ICraeteURLfromGallaryID {
    gallaryId: string
    userId: string
    folderName: string
}
export const craeteURLfromGallaryID = ({ gallaryId, userId, folderName }: ICraeteURLfromGallaryID) => {
    if (typeof gallaryId === 'string') {
        const URL = `${process?.env?.frontEndURL}/dashboard/f/${folderName}/gallary/${userId}/${gallaryId}`
        return URL
    } else {
        console.log('error while creating redirect link');
        return ''
    }
}

export const createFolderURL = (folderName: string) => {
    if (typeof folderName === 'string') {
        const URL = `${process?.env?.frontEndURL}/dashboard/f/${folderName}`
        return URL
    } else {
        console.log('error while creating redirect link');
        return ''
    }
}

export const makeDocID = (key: string, password: string) => {
    return `${key};${password}`
}


export const downloadImagesAsZip = async ({ urls, onSuccess, onError }: any) => {
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
        onSuccess()
    }).catch((error) => {
        onError()
        console.log(error);
    })
};
