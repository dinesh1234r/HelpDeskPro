import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Stack, Text, Flex, Input, Select, FormControl, 
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, 
  DrawerContent, Table, Thead, Tbody, Tr, Th, Td, Badge, useDisclosure, useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  ModalFooter,
  VStack,Alert,
  HStack,AlertIcon,AlertDescription,
  Spacer
} from '@chakra-ui/react';
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { storage, ref, uploadBytes, getDownloadURL } from "../Firebase/firebase";

function ServiceAgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDescription, setTicketDescription] = useState(''); 
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate=useNavigate()
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const [selectedAttachment, setSelectedAttachment] = useState(null);
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
        const reverseTicket=response.data.reverse();
        setTickets(reverseTicket);
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

  const handleViewAttachment = (attachmentUrl) => {
    setSelectedAttachment(attachmentUrl);
    openModal();
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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async (file) => {
    const storageRef = ref(storage, `attachments/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) {
      toast({
        title: "Error",
        description: "Message content or an attachment is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let attachmentUrl = null;
    if (selectedFile) {
      try {
        attachmentUrl = await uploadFile(selectedFile); 
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Error",
          description: "Failed to upload the attachment.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    try {
      console.log(attachmentUrl)
      const response = await axios.post(
        `http://localhost:5000/report/${selectedTicketId}/messages`,
        {
          sender: "Agent",
          content: newMessage,
          attachment: attachmentUrl, 
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
      setSelectedFile(null); 
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Flex direction="column" p={6} bg="gray.50" minH="100vh">
      <HStack mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Service Agent Dashboard</Text>
        <Spacer/>
        <Button colorScheme='red'
        onClick={()=>{
          localStorage.clear()
          navigate('/')
        }}
        >Logout</Button>
      </HStack>

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

      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader >
            <VStack>
              <Text>Messages for Ticket</Text>
              <Alert status="info" borderRadius="md" boxShadow="sm" >
        <AlertIcon />
        <AlertDescription>
        <HStack>
          <Text fontSize="md" fontWeight="bold" mb={1}>
            Note:
          </Text>
          <Text fontSize="sm">
          Attachment cannot be sent without message text.
          </Text>
          </HStack>
        </AlertDescription>
      </Alert>
              
            </VStack>
          </DrawerHeader>
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
            <Input type="file" onChange={handleFileChange} size="sm" accept="image/*,application/pdf" mr={2} />
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

export default ServiceAgentDashboard;
