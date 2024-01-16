import { sendRequest } from '../../utils/sendRequest';


const updateRequestStatus = async (request, newStatus, selectedAcademy) => {
    const { id: requestId } = request;

    request.status = newStatus;
    const token = localStorage.getItem('token');
    
    const config = {
      method: 'patch',
      url: `https://b286-62-89-209-162.ngrok-free.app/requests/${requestId}?selected_academy=${selectedAcademy}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(request),
    };

    await sendRequest(config);
}

export default updateRequestStatus;