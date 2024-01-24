import React, { useState, useEffect } from "react";
import axios from "axios";
import { sendRequest } from "../utils/sendRequest";
import "../css/RequestForm.css";
import fetchWorkersFn from "./utils/fetchAllWorkers";
import {
  Box,
  Button,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from "@chakra-ui/react";

function CreateRequestForm({ onSetIsAuthenticated }) {
  const toast = useToast();
  const [academies, setAcademies] = useState([]);
  const [selectedAcademy, setSelectedAcademy] = useState("physics");
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [description, setDescription] = useState("");
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");

  const showMessage = (text, type = "success", duration = 3000) => {
    setMessageText(text);
    setMessageType(type);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
    }, duration);
  };

  useEffect(() => {
    const fetchAcademies = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          method: "get",
          url: `http://45.87.247.215:3002/supporting_academies`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const response = await sendRequest(config);

        setAcademies(response);
        setSelectedAcademy(response[0]);
      } catch (error) {
        console.error("Ошибка при получении данных о академиях", error);
        const errMsg = error.response?.data?.error || "Произошла ошибка";
        setErrorMessage(errMsg);

        showMessage(errMsg, "error", 3000);

        if (errMsg === "Not authenticated") {
          return onSetIsAuthenticated(false);
        }
      }
    };

    fetchAcademies();
  }, []);

  useEffect(() => {
    if (selectedAcademy) {
      const fetchWorkers = async () => {
        try {
          const response = await fetchWorkersFn(selectedAcademy);

          setWorkers(response);
          setSelectedWorker(response[0] || "");
        } catch (error) {
          console.error("Ошибка при получении данных о сотрудниках", error);
          const errMsg = error.response?.data?.error;
          if (errMsg === "Not authenticated") {
            onSetIsAuthenticated(false);
          }
        }
      };

      fetchWorkers();
    }
  }, [selectedAcademy, onSetIsAuthenticated]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const foundWorker =
        typeof selectedWorker === "string"
          ? workers.find((worker) => worker.id === selectedWorker)
          : selectedWorker;

      if (!foundWorker) {
        console.error("Selected worker not found");
        return;
      }

      const requestData = {
        worker_id: foundWorker.id,
        receiver_user_id: foundWorker.user_id,
        description,
      };

      const token = localStorage.getItem("token");

      const config = {
        method: "post",
        url: `http://45.87.247.215:3002/requests?selected_academy=${selectedAcademy}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(requestData),
      };

      await sendRequest(config);

      showMessage("Заявка успешно создана!", "success", 3000);

      setSelectedWorker("");
      setDescription("");
      toast({
        title: "Заявка успешно создана!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Ошибка при отправке заявки", error);
      setErrorMessage(errMsg);
      toast({
        title: "Произошла ошибка",
        description:
          error.response?.data?.error || "Ошибка при отправке заявки",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      if (errMsg === "Not authenticated") {
        return onSetIsAuthenticated(false);
      }
    }
  };

  return (
    <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={4} align="stretch">
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Выберите академию:</FormLabel>
            <Select
              value={selectedAcademy}
              onChange={(e) => setSelectedAcademy(e.target.value)}
            >
              {academies.map((academy) => (
                <option key={academy} value={academy}>
                  {academy}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Выберите сотрудника:</FormLabel>
            <Select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
            >
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} {worker.surname}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Описание заявки:</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" mt={4}>
            Отправить заявку
          </Button>
        </form>
      </VStack>
    </Box>
  );
}

export default CreateRequestForm;
