import React, { useState, useEffect } from "react";
import { sendRequest } from "../utils/sendRequest";
import { Box, Input, Button, Text } from "@chakra-ui/react";
import Logout from "./Logout";
import getMe from "../components/utils/getMe";

function UserProfile() {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Имя",
  });

  const fetchUser = async () => {
    try {
      const response = await getMe();
      setUser(response);
    } catch (error) {
      console.error("Ошибка при получении данных пользователя", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      const interval = setInterval(() => {
        const token = localStorage.getItem("token");
        if (token) {
          fetchUser();
          clearInterval(interval);
        }
      }, 1000);
    } else {
      fetchUser();
    }
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        method: "patch",
        url: `http://89.111.174.159:3002/users/me`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(user),
      };

      await sendRequest(config);
      await fetchUser();
      setEditing(false);
    } catch (error) {
      console.error("Ошибка при сохранении данных пользователя", error);
    }
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  return (
    <Box className="user-profile" p="4">
      {editing ? (
        <>
          <Input
            type="text"
            value={user.name}
            onChange={(e) =>
              setUser((prevUser) => ({ ...prevUser, name: e.target.value }))
            }
            mb="2"
          />

          <Button colorScheme="blue" onClick={handleSave} mr="2">
            Сохранить
          </Button>
        </>
      ) : (
        <>
          <Text fontSize="lg" fontWeight="bold" mb="2">
            {user.name} {user.surname}
          </Text>
          <Button colorScheme="blue" onClick={toggleEdit} mr="2">
            Редактировать
          </Button>
        </>
      )}
      <Logout />
    </Box>
  );
}

export default UserProfile;
