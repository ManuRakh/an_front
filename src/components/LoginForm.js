import React, { useState } from "react";
import axios from "axios";
import { Box, Input, Select, Button, Center, Text } from "@chakra-ui/react";

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [academy, setAcademy] = useState("physics");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `http://89.111.174.159:3002/auth/login`,
        {
          username,
          password,
          academy,
        }
      );
      console.log(response.data);
      localStorage.setItem("academy", academy);
      setError(null);
      onLoginSuccess(response.data);
    } catch (error) {
      console.error("Ошибка авторизации", error);
      setError("Неверное имя пользователя или пароль");
    }
  };

  const handleAcademyChange = (e) => {
    const selectedAcademy = e.target.value;
    setAcademy(selectedAcademy);
    localStorage.setItem("academy", selectedAcademy);
  };

  return (
    <Center>
      <Box as="form" onSubmit={handleSubmit} w="300px">
        {error && <Text color="red.500">{error}</Text>}
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя пользователя"
          isRequired
          mb="2"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          isRequired
          mb="2"
        />
        <Select
          value={academy}
          onChange={handleAcademyChange}
          isRequired
          mb="2"
        >
          <option value="physics">Академия Физики</option>
          <option value="math">Академия Математики</option>
        </Select>
        <Button type="submit" colorScheme="blue">
          Войти
        </Button>
      </Box>
    </Center>
  );
}

export default LoginForm;
