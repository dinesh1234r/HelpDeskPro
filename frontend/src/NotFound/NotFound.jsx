// NotFound.js
import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg="gray.100"
    >
      <Heading
        display="inline-block"
        as="h1"
        size="4xl"
        bgGradient="linear(to-r, teal.400, blue.500)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="xl" mt={3} mb={6} color="gray.600">
        Oops! The page you are looking for does not exist.
      </Text>
      <VStack>
        <Button
          as={Link}
          to="/"
          colorScheme="teal"
          size="lg"
        >
          Go Back Home
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound;
