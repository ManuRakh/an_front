import { sendRequest } from "../../utils/sendRequest";
import dotenv from "dotenv";
dotenv.config();

const getMe = async () => {
    const token = localStorage.getItem('token');
    const config = {
      method: 'get',
      url: `${process.env.main_host}/users/me`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await sendRequest(config);

    return response;
}

export default getMe;