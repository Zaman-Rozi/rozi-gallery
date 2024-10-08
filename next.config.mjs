/** @type {import('next').NextConfig} */
const config = {
    env: {
        apiKey: "AIzaSyAiCL9MOrnZmvkaq9NMxtI-UVk9hEOnbTc",
        authDomain: "my-gallary-ac93e.firebaseapp.com",
        projectId: "my-gallary-ac93e",
        storageBucket: "my-gallary-ac93e.appspot.com",
        messagingSenderId: "926606607566",
        appId: "1:926606607566:web:620b177aa3070e0f9c7c9f",
        measurementId: "G-83DFM0VPHG",
        storageBucketPath:'gs://my-gallary-ac93e.appspot.com',
        frontEndURL:"https://rozi-gallery.vercel.app"
        // frontEndURL:"http://localhost:3000"
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default config;
