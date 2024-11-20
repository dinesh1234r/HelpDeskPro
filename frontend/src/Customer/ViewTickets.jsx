import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Stack, Text, Flex, Heading } from '@chakra-ui/react';

function ViewTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/report/get-tickets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" bg="gray.50" p={4}>
      <Box p={5} bg="white" shadow="lg" rounded="md" width="full" maxW="xl">
        <Heading size="lg" mb={6} textAlign="center" color="teal.500">
          Your Tickets
        </Heading>
        <Box
          maxH="400px"
          overflowY="auto"
          border="1px solid #e2e8f0"
          borderRadius="md"
          p={4}
        >
          <Stack spacing={4}>
            {tickets.length === 0 ? (
              <Text>No tickets found. Create a new one!</Text>
            ) : (
              tickets.map((ticket) => (
                <Box key={ticket._id} p={4} shadow="sm" borderWidth="1px" borderRadius="md">
                  <Text fontSize="lg" fontWeight="bold">
                    {ticket.title}
                  </Text>
                  <Text>Ticket ID: {ticket.ticketId}</Text>
                  <Text>Status: {ticket.status}</Text>
                  <Text>{ticket.description}</Text>
                  <Text>Created At: {new Date(ticket.createdAt).toLocaleString()}</Text>
                  <Text>Last Updated: {new Date(ticket.updatedAt).toLocaleString()}</Text>
                </Box>
              ))
            )}
          </Stack>
        </Box>
        <Button
          mt={4}
          colorScheme="teal"
          size="lg"
          w="full"
          onClick={() => (window.location.href = '/create-ticket')}
        >
          Create New Ticket
        </Button>
      </Box>
    </Flex>
  );
}

export default ViewTickets;
