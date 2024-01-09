import { sendRequest } from "../../utils/sendRequest";

const generateWorkersPromises = (response, token, sender = false) => {
    const workersPromises = response.map(async (request) => {
        const workerId = request.worker_id;
        const senderAcademy = request.sender_academy;
        const receivingAcademy = request.receiving_academy;
        const workerConfig = {
          method: 'get',
          url: `http://151.248.115.23:3002/workers/${workerId}?selected_academy=${sender === true ? senderAcademy: receivingAcademy }`,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const workerResponse = await sendRequest(workerConfig);

        return {
          ...workerResponse,
          workerId,
        };
      });

      return workersPromises;
}

export default generateWorkersPromises;