import React from "react";
import LoginForm from "./LoginForm";
import { Box, Heading, Text } from "@chakra-ui/react";

function MainContent({ isAuthenticated, handleLoginSuccess }) {
  return (
    <Box
      as="main"
      bgGradient="linear(to-b, #87CEEB, #4682B4)"
      p="4"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        className="intro"
        p="6"
        borderRadius="xl"
        boxShadow="xl"
        bg="white"
        w={{ base: "90%", md: "70%", lg: "50%" }}
        textAlign="center"
        mb="4"
        transition="all 0.3s"
        _hover={{ transform: "scale(1.05)" }}
        position="relative"
        overflow="hidden"
      >
        <Heading
          as="h1"
          mb="4"
          color="#333"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
        >
          Добро пожаловать в удобную систему обмена сообщениями!
        </Heading>
        <Text mb="4" color="#555" fontSize="lg">
          Откройте новые возможности обмена информацией между институтами Академии
          Наук Республики Таджикистан.
        </Text>
        {!isAuthenticated && (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            borderRadius="xl"
            boxShadow="xl"
            bg="white"
            p="6"
          />
        )}
      </Box>
      <Box
        className="features"
        p="6"
        borderRadius="xl"
        boxShadow="xl"
        bg="white"
        w={{ base: "90%", md: "70%", lg: "70%" }}
        textAlign="center"
        mt="4"
        position="relative"
        overflow="hidden"
      >
        <Box className="feature" mb="8">
          <Heading as="h2">Обменивайтесь заявками между институтами</Heading>
          <Text fontSize="lg">
            Передавайте важные сообщения и заявки с легкостью между институтами
            академии РТ.
          </Text>
        </Box>
        <Box className="feature" mb="8">
          <Heading as="h2">Получайте интерактивные оповещения</Heading>
          <Text fontSize="lg">
            Будьте в курсе событий! Получайте уведомления посредством SMS/Email с
            оперативной доставкой.
          </Text>
        </Box>
        <Box className="feature">
          <Heading as="h2">Будьте в курсе изменений</Heading>
          <Text fontSize="lg">
            Следите за изменениями в ваших заявках и держите руку на пульсе
            современных технологий.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default MainContent;
