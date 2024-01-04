import axios  from 'axios';

const sendRequest = async (config) => {
    const response = await axios.request(config);

    return response?.data?.data?.result;
}

export {
    sendRequest,
}