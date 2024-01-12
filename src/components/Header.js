import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Spacer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import UserProfile from "./UserProfile";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Box as="header" bg="gray.100" boxShadow="md" p="4">
      <Flex align="center" justify="space-between">
        <Link to="/">
          <Text
            as="span"
            fontWeight="500"
            px="10px"
            py="5px"
            borderRadius="5px"
            _hover={{ backgroundColor: "#e7e7e7" }}
            mx="2"
          >
            Главная страница
          </Text>
        </Link>
        <Link to="/create-request">
          <Text
            as="span"
            fontWeight="500"
            px="10px"
            py="5px"
            borderRadius="5px"
            _hover={{ backgroundColor: "#e7e7e7" }}
            mx="2"
          >
            Создать заявку
          </Text>
        </Link>
        <Link to="/view-requests">
          <Text
            as="span"
            fontWeight="500"
            px="10px"
            py="5px"
            borderRadius="5px"
            _hover={{ backgroundColor: "#e7e7e7" }}
            mx="2"
          >
            Посмотреть созданные заявки
          </Text>
        </Link>
        <Link to="/incoming-requests">
          <Text
            as="span"
            fontWeight="500"
            px="10px"
            py="5px"
            borderRadius="5px"
            _hover={{ backgroundColor: "#e7e7e7" }}
            mx="2"
          >
            Посмотреть присланные заявки
          </Text>
        </Link>
        <Link to="/about">
          <Text
            as="span"
            fontWeight="500"
            px="10px"
            py="5px"
            borderRadius="5px"
            _hover={{ backgroundColor: "#e7e7e7" }}
            mx="2"
          >
            Об Институте
          </Text>
        </Link>
        <Link to="/contacts">
          <Text
            as="span"
            fontWeight="500"
            px="10px"
            py="5px"
            borderRadius="5px"
            _hover={{ backgroundColor: "#e7e7e7" }}
            mx="2"
          >
            Контактная Информация
          </Text>
        </Link>
        <Spacer />
        <ProfileButton />
      </Flex>
    </Box>
  );
}

const ProfileButton = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button color="gray.600" fontWeight="medium" fontSize="sm" mx="2">
          Профиль
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Ваш профиль</PopoverHeader>
        <PopoverBody>
          <UserProfile />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Header;
