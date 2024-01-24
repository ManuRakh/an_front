import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Dashboard.css";
import WorkerList from "./WorkerList.js";
import { sendRequest } from "../utils/sendRequest.js";
import fetchWorkersFn from "./utils/fetchAllWorkers.js";
import getMe from "./utils/getMe.js";
import {
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";

function Dashboard({ onSetIsAuthenticated }) {
  const [worker, setWorker] = useState({ spec: "", name: "", surname: "" });
  const [workers, setWorkers] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState([]);

  const [user, setUser] = useState({
    name: "",
    phone: "",
    telegram: "",
    role: "",
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    setWorker({ ...worker, [e.target.name]: e.target.value });
  };

  const handleChangeUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const token = localStorage.getItem("token");
        const currentAcademy = localStorage.getItem("academy");

        const config = {
          method: "get",
          url: `http://45.87.247.215:3002/workers?selected_academy=${currentAcademy}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const response = (await sendRequest(config))?.filter(
          (res) => res !== null
        );

        setWorkers(response);
      } catch (error) {
        console.error("Ошибка при получении данных о сотрудниках", error);
        const errMsg = error.response.data.error;
        if (errMsg === "Not authenticated") onSetIsAuthenticated(false);
      }
    };

    const fetchAllWorkers = async () => {
      try {
        const response = await fetchWorkersFn();

        setAllWorkers(response);
      } catch (error) {
        console.error("Ошибка при получении данных о сотрудниках", error);
        const errMsg = error.response.data.error;
        if (errMsg === "Not authenticated") onSetIsAuthenticated(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getMe();

        setIsAdmin(response.role === "admin");
      } catch (error) {
        console.error("Ошибка при получении данных о пользователях", error);
      }
    };

    fetchWorkers();
    fetchAllWorkers();
    fetchUsers();
  }, []);

  const handleDeleteWorker = async (workerId) => {
    try {
      const token = localStorage.getItem("token");
      const currentAcademy = localStorage.getItem("academy");
      await sendRequest({
        method: "delete",
        url: `http://45.87.247.215:3002/workers/${workerId}?selected_academy=${currentAcademy}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setAllWorkers((currentWorkers) =>
        currentWorkers.filter((w) => w.id !== workerId)
      );
      if (workers[0]?.id === workerId) setWorkers([]);
    } catch (error) {
      console.error("Ошибка при удалении сотрудника", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      worker.user_id = userId;
      const config = {
        method: "post",
        url: `http://45.87.247.215:3002/workers`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: worker,
      };

      const foundWorker = await sendRequest(config);

      if (foundWorker)
        setAllWorkers((currentWorkers) => [...currentWorkers, foundWorker]);

      setWorkers([foundWorker]);
    } catch (error) {
      console.error("Ошибка при создании воркера", error);
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const currentAcademy = localStorage.getItem("academy");

      const config = {
        method: "post",
        url: `http://45.87.247.215:3002/users?selected_academy=${currentAcademy}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: user,
      };

      await sendRequest(config);

      console.log("User was created successfully");
    } catch (error) {
      console.error("Ошибка при создании воркера", error);
    }
  };
  return (
    <Box className="dashboard-container">
      <Heading as="h5">
        Один пользователь может иметь не более 1 работника академии в системе.
        Если вы админ, вам доступно создание пользователей, после этого
        пользователь сам создаст себе работника академии
      </Heading>

      <WorkerList workers={allWorkers} onDeleteWorker={handleDeleteWorker} />

      {workers.length === 0 && (
        <Box className="create-worker-form">
          <Heading as="h2">Создание Работника</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Должность</FormLabel>
              <Input
                type="text"
                name="spec"
                value={worker.spec}
                onChange={handleChange}
                placeholder="Должность"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Имя</FormLabel>
              <Input
                type="text"
                name="name"
                value={worker.name}
                onChange={handleChange}
                placeholder="Имя"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Фамилия</FormLabel>
              <Input
                type="text"
                name="surname"
                value={worker.surname}
                onChange={handleChange}
                placeholder="Фамилия"
              />
            </FormControl>
            <Button type="submit">Создать Работника</Button>
          </form>
        </Box>
      )}

      <br />

      {isAdmin && (
        <Box className="create-worker-form">
          <Heading as="h1">Админ может создавать пользователей</Heading>
          <br />
          <Heading as="h2">Создание Пользователя</Heading>

          <form onSubmit={handleSubmitUser}>
            <FormControl>
              <FormLabel>Имя пользователя</FormLabel>
              <Input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChangeUser}
                placeholder="Имя"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Роль</FormLabel>
              <Select
                name="role"
                value={user.role}
                onChange={handleChangeUser}
                placeholder="Выберите роль"
              >
                <option value="админ">Админ</option>
                <option value="работник">Работник</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Номер телефона</FormLabel>
              <Input
                type="phone"
                name="phone"
                value={user.phone}
                onChange={handleChangeUser}
                placeholder="Номер телефона"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Телеграм(если есть)</FormLabel>
              <Input
                type="telegram"
                name="telegram"
                value={user.telegram}
                onChange={handleChangeUser}
                placeholder="Telegram"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Никнейм пользователя</FormLabel>
              <Input
                type="username"
                name="username"
                value={user.user}
                onChange={handleChangeUser}
                placeholder="Никнейм пользователя,должен быть уникальным"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChangeUser}
                placeholder="Пароль должен содержать минимум 8 букв и цифр "
              />
            </FormControl>

            <Button type="submit">Создать Пользователя</Button>
          </form>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
