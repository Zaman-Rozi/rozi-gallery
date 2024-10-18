import emailjs from '@emailjs/browser';

const serviceId = "service_bem8ta5"
const publicKey = "GeYIq0wvSd2gDRAt5"
const templateId = "template_n2l1zxd"
type TemplateOptions = {
    to_name: string;
    message: string;
    email_to: string;
};
type TemplateOptionsGallery = {
    to_name: string;
    message?: string;
    email_to: string;
    gallery_link: string;
    password: string;
};
const sendEmailForAddUser = (templateOptions:TemplateOptions) => {
    emailjs.send(serviceId, templateId, templateOptions, publicKey).then(
        () => {
            console.log('SUCCESS!');
        },
        (error) => {
            console.log('FAILED...', error.text);
        },
    );
};

const sendEmailForAddGallery = (templateOptions:TemplateOptionsGallery) => {
    emailjs.send(serviceId, templateId, templateOptions, publicKey).then(
        () => {
            console.log('SUCCESS!');
        },
        (error) => {
            console.log('FAILED...', error.text);
        },
    );
};
export { sendEmailForAddUser, sendEmailForAddGallery }