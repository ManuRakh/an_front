import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Link as ChakraLink,
  VStack,
  HStack,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { sendRequest } from "../utils/sendRequest";
import generateWorkersPromises from "./utils/getWorkers";
import updateRequestStatus from "./utils/updateRequestStatus";
import {
  convertStatusToEn,
  convertStatusToRu,
} from "./utils/convertStatusToEn";

function ViewRequests({ onSetIsAuthenticated }) {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [groupedRequests, setGroupedRequests] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const statusOptions = [
    "Отправлено",
    "В процессе",
    "На проверке",
    "Подтверждено",
  ];

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const selectedAcademy = localStorage.getItem("academy");
        const config = {
          method: "get",
          url: `http://45.87.247.215:3002/requests/outcoming/requests?selected_academy=${selectedAcademy}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const response = await sendRequest(config);

        const workersPromises = generateWorkersPromises(response, token, false);

        const workersData = await Promise.all(workersPromises);

        const updatedRequests = response.map((request) => {
          const matchingWorker = workersData.find(
            (worker) => worker.id === request.worker_id
          );

          return {
            ...request,
            workerData: matchingWorker,
          };
        });

        setIncomingRequests(updatedRequests);
        const newGroupedRequests = statusOptions.reduce((acc, status) => {
          acc[status] = updatedRequests.filter(
            (request) => request.status === convertStatusToEn(status)
          );
          return acc;
        }, {});
        setGroupedRequests(newGroupedRequests);
      } catch (error) {
        console.error("Ошибка при получении присланных заявок", error);
        const errMsg = error.response?.data?.error || "Произошла ошибка";
        setErrorMessage(errMsg);
        if (errMsg === "Not authenticated") {
          onSetIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncomingRequests();
  }, []);

  return (
    <Box
      p={4}
      mt={4}
      className="incoming-requests-container"
      bgGradient="linear(to-r, cyan.400, blue.500)"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="white">
        Отправленные заявки
      </Text>
      {isLoading && <Spinner size="xl" />}
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
      {!isLoading && (
        <HStack spacing={4} align="stretch" className="requests-columns">
          {statusOptions.map((status) => (
            <VStack
              key={status}
              align="stretch"
              className={`request-column request-column-${status}`}
              flex={{ base: 1, md: 0.25 }}
              boxShadow="lg"
              p={4}
              borderRadius="md"
              bg="white"
              mb={4}
              _hover={{ boxShadow: "xl", transform: "scale(1.01)" }}
              transition="all 0.3s"
            >
              <Text
                fontSize="lg"
                fontWeight="semibold"
                mb={2}
                textAlign={"center"}
                color="gray.800"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
              {(groupedRequests[status] || []).map((request) => (
                <Box
                  key={request.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  mb={4}
                  className="incoming-requests-item"
                >
                  <Text>
                    <strong>Академия Получившая Запрос:</strong>{" "}
                    {request.receiving_academy}
                  </Text>
                  <Text>
                    <strong>Исполнитель:</strong>{" "}
                    {`${request.workerData?.name} ${request.workerData?.surname}`}
                  </Text>
                  <Text>
                    <strong>Описание:</strong> {request.description}
                  </Text>
                  <Text>
                    <strong>Статус:</strong>{" "}
                    <Badge
                      colorScheme={
                        request.status === convertStatusToEn("Отправлено")
                          ? "blue"
                          : request.status === convertStatusToEn("В процессе")
                          ? "orange"
                          : request.status === convertStatusToEn("На проверке")
                          ? "yellow"
                          : "green"
                      }
                      borderRadius="full"
                      px={2}
                    >
                      {convertStatusToRu(request.status)}
                    </Badge>
                  </Text>
                  <ChakraLink
                    as={Link}
                    to={`/incoming-requests/${request.id}`}
                    color="teal.500"
                    mt={2}
                    _hover={{ textDecoration: "underline" }}
                  >
                    Открыть карточку заявки
                  </ChakraLink>
                </Box>
              ))}
            </VStack>
          ))}
        </HStack>
      )}
    </Box>
  );
}

export default ViewRequests;
