import axios from "axios";

export const useExternalAPI = () => {
    const sendData = ({ data }: any) => {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://rest.gohighlevel.com/v1/contacts/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImVYZUo5RGJHSWhWNldaN0JoTFlUIiwiY29tcGFueV9pZCI6Im1vQ1R4c01uQWpEV3lpNEI4UElBIiwidmVyc2lvbiI6MSwiaWF0IjoxNzA2MTkwMzg0MDc3LCJzdWIiOiJ1c2VyX2lkIn0.0YxXsP2VlMhFwALkVkTyB_9d__At33BmeJxBdx4X6B8'
            },
            data: JSON.stringify(data)
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return {
        sendData
    }
}