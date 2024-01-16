import { sendRequest } from "../../utils/sendRequest";

const getMe = async () => {
    const token = localStorage.getItem('token');
    const config = {
      method: 'get',
      url: `https://3547-45-10-55-124.ngrok-free.app/users/me`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(config);

    return response;
}

export default getMe;