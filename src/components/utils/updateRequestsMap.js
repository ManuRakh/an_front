
const updatedRequestsMap = (incomingRequests, requestId, newStatus) => incomingRequests.map((request) => {
    if (request.id === requestId) {
      return {
        ...request,
        status: newStatus,
      };
    }
    return request;
  });

export default updatedRequestsMap;