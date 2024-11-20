import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Stack,
  Button,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function CustomerHomePage() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={bgColor}
      p={6}
    >
      <Stack spacing={8} w="full" maxW="xl" align="center">
        <Heading
          as="h1"
          size="lg"
          textAlign="center"
          color="teal.500"
        >
          Welcome to the Helpdesk!
        </Heading>
        <Box
          p={6}
          boxShadow="lg"
          bg={cardBg}
          rounded="md"
          w="full"
        >
          <Heading as="h2" size="md" mb={4} color="teal.400">
            Manage Your Account
          </Heading>
          <Text fontSize="md" mb={6}>
            Access your tickets, manage your profile, and stay updated with your helpdesk requests.
          </Text>
          <Stack spacing={4}>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => navigate('/tickets')}
            >
              View Your Tickets
            </Button>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => navigate('/profile')}
            >
              Manage Profile
            </Button>
          </Stack>
        </Box>

        <Box
          p={6}
          boxShadow="lg"
          bg={cardBg}
          rounded="md"
          w="full"
        >
          <Heading as="h2" size="md" mb={4} color="teal.400">
            Need Help?
          </Heading>
          <Text fontSize="md" mb={6}>
            Create a new support ticket if you are facing an issue.
          </Text>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={() => navigate('/create-ticket')}
          >
            Create New Ticket
          </Button>
        </Box>
      </Stack>
    </Flex>
  );
}

export default CustomerHomePage;
