import { sendRequest } from "../../utils/sendRequest";

const getMe = async () => {
    const token = localStorage.getItem('token');
    const config = {
      method: 'get',
      url: `http://localhost:3002/users/me`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(config);

    return response;
}

export default getMe;