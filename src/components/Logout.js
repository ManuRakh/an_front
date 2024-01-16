import React from "react";
import { Button } from "@chakra-ui/react";
import axios from "axios";

function Logout() {
  const handleLogout = () => {
    const token = localStorage.getItem("token");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://3547-45-10-55-124.ngrok-free.app/auth/logout`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log("Logout successful", response.data);
        localStorage.clear();
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    <Button colorScheme="red" onClick={handleLogout} ml="2">
      Выйти
    </Button>
  );
}

export default Logout;
