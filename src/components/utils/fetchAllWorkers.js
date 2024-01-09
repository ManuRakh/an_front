import { sendRequest } from "../../utils/sendRequest";

const fetchWorkersFn = async (selectedAcademy) => {
    const token = localStorage.getItem('token');
        const currentAcademy = localStorage.getItem('academy');

        const config = {
          method: 'get',
          url: `http://151.248.115.23:3002/workers?all=true&selected_academy=${selectedAcademy || currentAcademy}`,
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await sendRequest(config);

        return response;
}

export default fetchWorkersFn;