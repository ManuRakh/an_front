import { sendRequest } from '../../utils/sendRequest';
import dotenv from "dotenv";
dotenv.config();

const updateRequestStatus = async (request, newStatus, selectedAcademy) => {
    const { id: requestId } = request;

    request.status = newStatus;
    const token = localStorage.getItem('token');
    
    const config = {
      method: 'patch',
      url: `${process.env.main_host}/requests/${requestId}?selected_academy=${selectedAcademy}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(request),
    };

    await sendRequest(config);
}

export default updateRequestStatus;