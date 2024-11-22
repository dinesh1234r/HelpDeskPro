import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Stack, Text, Flex, Input, Select, FormControl, 
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, 
  DrawerContent, Table, Thead, Tbody, Tr, Th, Td, Badge, useDisclosure, useToast, HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  ModalFooter,
  Spacer
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'

function AdminDashBoard() {
  const [tickets, setTickets] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDescription, setTicketDescription] = useState('');
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate=useNavigate()
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    if(token&&decoded.Role!="Admin")
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
    const fetchDashboardData = async () => {
      try {
        const ticketResponse = await axios.get('http://localhost:5000/admin_agent_role/getalltickets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const reverseTicket=ticketResponse.data.reverse();
        setTickets(reverseTicket);
        setTotalTickets(ticketResponse.data.length);

        const initialStatuses = {};
        ticketResponse.data.forEach((ticket) => {
          initialStatuses[ticket._id] = ticket.status;
        });
        setStatuses(initialStatuses);

        const userResponse = await axios.get('http://localhost:5000/admin/customer-count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTotalUsers(userResponse.data.count);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Error fetching dashboard data from the server.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchDashboardData();
  }, []);

  const fetchMessages = async (ticket) => {
    try {
      const ticket_id = ticket.ticketId;
      const response = await axios.get(`http://localhost:5000/report/${ticket_id}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data.messages || []);
      setTicketDescription(ticket.description);
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
      await axios.put(
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
        { sender: 'Admin', content: newMessage },
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
  const handleViewAttachment = (attachmentUrl) => {
    setSelectedAttachment(attachmentUrl);
    openModal();
  };

  return (
    <Flex direction="column" p={6} bg="gray.50" minH="100vh">
      <Box mb={6}>
        <HStack mb={4} bg={'gray.50'}>
          <Text fontWeight={'bold'} fontSize={'3xl'}>Admin Dashboard</Text>
          <Spacer/>
          <Button
            colorScheme="purple"
            onClick={() => navigate('/admin-customer_dashboard')} 
          >
            Go to Customer List Page
          </Button>
          <Button colorScheme='red'
          onClick={()=>{
            localStorage.clear()
            navigate('/')
          }}
          >Logout</Button>
        </HStack>
  <HStack spacing={4} align="center">
    <Box
      bg="teal.100"
      borderRadius="md"
      p={4}
      shadow="md"
      border="1px solid"
      borderColor="teal.300"
      textAlign="center"
      flex="1"
    >
      <Text fontSize="xl" fontWeight="bold" color="teal.800">
        Total Tickets
      </Text>
      <Text fontSize="2xl" fontWeight="extrabold" color="teal.900">
        {totalTickets}
      </Text>
    </Box>

    <Box
      bg="blue.100"
      borderRadius="md"
      p={4}
      shadow="md"
      border="1px solid"
      borderColor="blue.300"
      textAlign="center"
      flex="1"
    >
      <Text fontSize="xl" fontWeight="bold" color="blue.800">
        Total Users
      </Text>
      <Text fontSize="2xl" fontWeight="extrabold" color="blue.900">
        {totalUsers}
      </Text>
    </Box>
  </HStack>
   
</Box>

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
                  <Badge colorScheme={ticket.status === 'Active' ? 'green' :
                    ticket.status === 'Pending' ? 'yellow' : 'red'}>
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

      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Messages for Ticket</DrawerHeader>
          <DrawerBody>
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>Description:</Text>
              <Text>{ticketDescription}</Text>  
            </Box>
            {messages.length === 0 ? (
              <Text>No messages available for this ticket.</Text>
            ) : (
              messages.map((message, index) => (
                <Box key={index} mb={3} p={3} bg="gray.100" borderRadius="md">
                  <Text fontWeight="bold">{message.sender}</Text>
                  <Text>{message.content}</Text>
                  {message.attachment && (
                    <Button
                    size="sm"
                    mt={2}
                    colorScheme="blue"
                    onClick={() => handleViewAttachment(message.attachment)}
                  >
                    View Attachment
                  </Button>
                  )}
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
      <Modal isOpen={isModalOpen} onClose={closeModal} size={'xl'}>
  <ModalOverlay />
  <ModalContent sx={{ maxWidth: "800px", height: "600px" }}>
    <ModalHeader>Attachment</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {selectedAttachment ? (
        <Image src={selectedAttachment} alt="Attachment" maxW="100%" />
      ) : (
        <Text>No attachment to display</Text>
      )}
    </ModalBody>
    <ModalFooter>
      <Button onClick={closeModal} colorScheme="teal">
        Close
      </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
    </Flex>
  );
}

export default AdminDashBoard;
