import { sendRequest } from "../../utils/sendRequest";
import dotenv from "dotenv";
dotenv.config();

const fetchWorkersFn = async (selectedAcademy) => {
    const token = localStorage.getItem('token');
        const currentAcademy = localStorage.getItem('academy');

        const config = {
          method: 'get',
          url: `${process.env.main_host}/workers?all=true&selected_academy=${selectedAcademy || currentAcademy}`,
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await sendRequest(config);

        return response;
}

export default fetchWorkersFn;