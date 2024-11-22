import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerFooter,
  DrawerCloseButton,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Text,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'

function ViewTickets() {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  
  // Fetch tickets on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    if(token&&decoded.Role!="Customer")
    {
      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to view this page.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/')
    }
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
        toast({
          title: 'Error',
          description: 'Failed to fetch tickets.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTickets();
  }, []);

  // Open the drawer and load messages for a selected ticket
  const openDrawer = async (ticket) => {
    setCurrentTicket(ticket);
    try {
      const ticket_id = ticket.ticketId;
      const response = await axios.get(`http://localhost:5000/report/${ticket_id}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data.messages || []);
      onOpen();
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch messages.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Message cannot be empty.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/report/${currentTicket.ticketId}/messages`,
        { sender: 'Customer', content: newMessage },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" bg="gray.50" p={4}>
      <Box p={5} bg="white" shadow="lg" rounded="md" width="full" maxW="6xl">
        <Heading size="lg" mb={6} textAlign="center" color="teal.500">
          Your Tickets
        </Heading>

        <Box overflowX="auto">
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Ticket ID</Th>
                <Th>Status</Th>
                <Th>Description</Th>
                <Th>Created At</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tickets.length === 0 ? (
                <Tr>
                  <Td colSpan="6" textAlign="center">
                    No tickets found. Create a new one!
                  </Td>
                </Tr>
              ) : (
                tickets.map((ticket) => (
                  <Tr key={ticket._id}>
                    <Td>{ticket.title}</Td>
                    <Td>{ticket.ticketId}</Td>
                    <Td>{ticket.status}</Td>
                    <Td>{ticket.description}</Td>
                    <Td>{new Date(ticket.createdAt).toLocaleString()}</Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={() => openDrawer(ticket)}
                      >
                        View Messages
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
        <HStack>
        <Button
          mt={4}
          colorScheme='red'
          size="lg"
          w="full"
          onClick={() => navigate('/home-customer')}
        >
          Go to Home
        </Button>
        <Button
          mt={4}
          colorScheme="teal"
          size="lg"
          w="full"
          onClick={() => navigate('/create-ticket')}
        >
          Create New Ticket
        </Button>
        </HStack>
        
      </Box>

      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Messages for Ticket</DrawerHeader>
          <DrawerBody>
            {messages.length === 0 ? (
              <Text>No messages available for this ticket.</Text>
            ) : (
              messages.map((message, index) => (
                <Box key={index} mb={3} p={3} bg="gray.100" borderRadius="md">
                  <Text fontWeight="bold">{message.sender}</Text>
                  <Text>{message.content}</Text>
                  <Text fontSize="sm" color="gray.500">{new Date(message.timestamp).toLocaleString()}</Text>
                </Box>
              ))
            )}
          </DrawerBody>
          <DrawerFooter>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              mr={2}
            />
            <Button colorScheme="teal" onClick={handleSendMessage}>
              Send
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default ViewTickets;
