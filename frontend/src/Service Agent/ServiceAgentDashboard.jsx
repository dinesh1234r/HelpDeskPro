import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Stack, Text, Flex, Input, Select, FormControl, 
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, 
  DrawerContent, Table, Thead, Tbody, Tr, Th, Td, Badge, useDisclosure, useToast
} from '@chakra-ui/react';
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom';

function ServiceAgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDescription, setTicketDescription] = useState('');  // Track ticket description
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate=useNavigate()
  // Fetch tickets for Service Agent
  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    if(token&&decoded.Role!="Agent")
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
        const response = await axios.get('http://localhost:5000/admin_agent_role/getalltickets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTickets(response.data);
        const initialStatuses = {};
        response.data.forEach((ticket) => {
          initialStatuses[ticket._id] = ticket.status;
        });
        setStatuses(initialStatuses);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast({
          title: 'Error',
          description: 'Error fetching tickets from the server.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchTickets();
  }, []);

  // Fetch messages and description for a specific ticket
  const fetchMessages = async (ticket) => {
    try {
      const ticket_id = ticket.ticketId;
      const response = await axios.get(`http://localhost:5000/report/${ticket_id}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data.messages || []);
      setTicketDescription(ticket.description);  // Set description from the ticket
      setSelectedTicketId(ticket.ticketId);
      onOpen();
    } catch (error) {
      console.error('Error fetching messages for the ticket:', error);
      toast({
        title: 'Error',
        description: 'Error fetching messages for the ticket.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChangeStatus = async (ticket_id) => {
    try {
      const status = statuses[ticket_id];
      const response = await axios.put(
        `http://localhost:5000/admin_agent_role/${ticket_id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTickets(tickets.map((ticket) =>
        ticket._id === ticket_id ? { ...ticket, status } : ticket
      ));
      toast({
        title: 'Success',
        description: `Ticket status updated to ${status}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: 'Error',
        description: 'Error updating ticket status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

    if (!selectedTicketId) {
      toast({
        title: 'Error',
        description: 'No ticket selected.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/report/${selectedTicketId}/messages`,
        { sender: 'Agent', content: newMessage },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
      toast({
        title: 'Success',
        description: 'Message sent to the customer.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Error sending message.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" p={6} bg="gray.50" minH="100vh">
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Service Agent Dashboard</Text>
      </Box>

      {/* Tickets Table */}
      <Box bg="white" shadow="md" borderRadius="md" p={4}>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Ticket ID</Th>
              <Th>Title</Th>
              <Th>Customer</Th>
              <Th>Status</Th>
              <Th>Last Updated</Th>
              <Th>Message</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tickets.map((ticket) => (
              <Tr key={ticket._id}>
                <Td>{ticket.ticketId}</Td>
                <Td>{ticket.title}</Td>
                <Td>{ticket.customerId.name}</Td>
                <Td>
                  <Badge colorScheme={
                    ticket.status === 'Active' ? 'green' :
                      ticket.status === 'Pending' ? 'yellow' : 'red'
                  }>
                    {ticket.status}
                  </Badge>
                </Td>
                <Td>{new Date(ticket.updatedAt).toLocaleString()}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" onClick={() => fetchMessages(ticket)}>
                    View Messages
                  </Button>
                </Td>
                <Td>
                  <FormControl>
                    <Select
                      value={statuses[ticket._id] || ticket.status}
                      onChange={(e) => setStatuses({ ...statuses, [ticket._id]: e.target.value })}
                      size="sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Closed">Closed</option>
                    </Select>
                  </FormControl>
                  <Button mt={2} size="sm" colorScheme="teal" onClick={() => handleChangeStatus(ticket._id)}>
                    Update
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Messages Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Messages for Ticket</DrawerHeader>
          <DrawerBody>
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>Description:</Text>
              <Text>{ticketDescription}</Text>  {/* Show Description */}
            </Box>
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

export default ServiceAgentDashboard;
