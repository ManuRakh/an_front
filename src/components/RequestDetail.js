import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Select,
  Button,
  Badge,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { sendRequest } from "../utils/sendRequest";
import generateWorkersPromises from "./utils/getWorkers";
import updateRequestStatus from "./utils/updateRequestStatus";
import { convertStatusToRu } from "./utils/convertStatusToEn";
import Comments from "./Comments";

const RequestDetail = ({ onSetIsAuthenticated }) => {
  const { requestId } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [statusOptions] = useState([
    "scheduled",
    "processing",
    "review",
    "approved",
  ]);
  const [newStatus, setNewStatus] = useState(statusOptions[0]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const selectedAcademy = localStorage.getItem("academy");

        const config = {
          method: "get",
          url: `http://45.87.247.215:3002/requests/${requestId}?selected_academy=${selectedAcademy}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const response = await sendRequest(config);
        const workersPromises = generateWorkersPromises(
          [response],
          token,
          true
        );

        const [workersData] = await Promise.all(workersPromises);
        response.workerData = workersData;

        setRequestData(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data about workers", error);
        const errMsg = error.response?.data?.error;
        if (errMsg === "Not authenticated") {
          onSetIsAuthenticated(false);
        }
      }
    };

    fetchData();
  }, [requestId, onSetIsAuthenticated]);

  const updateStatus = async () => {
    try {
      setIsLoading(true);
      await updateRequestStatus(
        requestData,
        newStatus,
        requestData.receiving_academy
      );

      setRequestData((prevData) => ({
        ...prevData,
        status: newStatus,
      }));

      toast({
        title: "Статус обновлен!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка при обновлении статуса",
        description: "Пожалуйста, попробуйте еще раз.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} mt={4} className="incoming-requests-container-details">
      {isLoading ? (
        <Spinner size="lg" />
      ) : requestData ? (
        <Box>
          <Text fontSize="2xl">
            Запрос полученный от {requestData.sender_academy}
          </Text>

          <Text>
            <strong>Статус:</strong>{" "}
            <Badge
              borderRadius="full"
              px={2}
              colorScheme={getStatusColor(newStatus)}
            >
              {convertStatusToRu(requestData.status)}
            </Badge>
          </Text>
          <Text>
            <strong>Исполнитель:</strong> {requestData.workerData?.name}{" "}
            {requestData.workerData?.surname}
          </Text>
          <Text>
            <strong>Должность:</strong> {requestData.workerData?.name}{" "}
            {requestData.workerData?.spec}
          </Text>
          <Text>
            <strong>Описание:</strong> {requestData.description}
          </Text>
          <Select
            className="status-select"
            onChange={(e) => setNewStatus(e.target.value)}
            value={newStatus}
            mt={4}
          >
            {statusOptions.map((option) => (
              <option key={convertStatusToRu(option)} value={option}>
                {convertStatusToRu(option)}
              </option>
            ))}
          </Select>

          <Button
            className="update-status-button"
            onClick={updateStatus}
            colorScheme="teal"
            mt={4}
            isLoading={isLoading}
            loadingText="Обновление..."
          >
            Обновить статус
          </Button>
          <Comments requestId={requestData.identifier} />
        </Box>
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
};

export default RequestDetail;

function getStatusColor(status) {
  switch (status) {
    case "scheduled":
      return "blue";
    case "processing":
      return "orange";
    case "review":
      return "yellow";
    case "approved":
      return "green";
    default:
      return "gray";
  }
}
