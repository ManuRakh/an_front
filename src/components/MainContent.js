import React from "react";
import LoginForm from "./LoginForm";
import { Box, Heading, Text } from "@chakra-ui/react";

function MainContent({ isAuthenticated, handleLoginSuccess }) {
  return (
    <Box
      as="main"
      backgroundImage="linear-gradient(45deg, #FFB6C1, #87CEEB)"
      padding="4"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        className="intro"
        p="6"
        borderRadius="md"
        boxShadow="lg"
        backgroundColor="white"
        width={{ base: "90%", md: "70%", lg: "50%" }}
        textAlign="center"
        marginBottom="4"
      >
        <Heading as="h1" mb="4" color="#333">
          Добро пожаловать в удобную систему обмена сообщениями!
        </Heading>
        <Text mb="4" color="#555">
          Откройте новые возможности обмена информацией между институтами Академии Наук Республики Таджикистан.
        </Text>
        {!isAuthenticated && <LoginForm onLoginSuccess={handleLoginSuccess} />}
      </Box>
      <Box
        className="features"
        p="6"
        borderRadius="md"
        boxShadow="lg"
        backgroundColor="white"
        width={{ base: "90%", md: "70%", lg: "70%" }}
        textAlign="center"
        marginTop="4"
      >
        <Box className="feature" mb="8">
          <Heading as="h2" color="#4CAF50">
            Обменивайтесь заявками между институтами
          </Heading>
          <Text color="#777" fontSize="lg">
            Передавайте важные сообщения и заявки с легкостью между институтами академии РТ.
          </Text>
        </Box>
        <Box className="feature" mb="8">
          <Heading as="h2" color="#FFC107">
            Получайте интерактивные оповещения
          </Heading>
          <Text color="#777" fontSize="lg">
            Будьте в курсе событий! Получайте уведомления посредством SMS/Email с оперативной доставкой.
          </Text>
        </Box>
        <Box className="feature">
          <Heading as="h2" color="#FF5722">
            Будьте в курсе изменений
          </Heading>
          <Text color="#777" fontSize="lg">
            Следите за изменениями в ваших заявках и держите руку на пульсе современных технологий.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default MainContent;
