import { sendRequest } from "../../utils/sendRequest";

const fetchWorkersFn = async (selectedAcademy) => {
    const token = localStorage.getItem('token');
        const currentAcademy = localStorage.getItem('academy');

        const config = {
          method: 'get',
          url: `https://b286-62-89-209-162.ngrok-free.app/workers?all=true&selected_academy=${selectedAcademy || currentAcademy}`,
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await sendRequest(config);

        return response;
}

export default fetchWorkersFn;