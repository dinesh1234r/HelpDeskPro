import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Input,
  useDisclosure,
  useToast,
  Text,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  ModalFooter,VStack,Alert,AlertIcon,AlertDescription
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { storage, ref, uploadBytes, getDownloadURL } from "../Firebase/firebase";

function ViewTickets() {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const decoded = jwtDecode(token);
    if (decoded.Role !== "Customer") {
      toast({
        title: "Unauthorized",
        description: "You are not authorized to view this page.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await axios.get("https://helpdeskpro-backend.onrender.com/report/get-tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error",
          description: "Failed to fetch tickets.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTickets();
  }, [navigate, toast]);

  const openDrawer = async (ticket) => {
    setCurrentTicket(ticket);
    try {
      const response = await axios.get(
        `https://helpdeskpro-backend.onrender.com/report/${ticket.ticketId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(response.data.messages || []);
      onOpen();
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleViewAttachment = (attachmentUrl) => {
    setSelectedAttachment(attachmentUrl);
    openModal();
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
        `https://helpdeskpro-backend.onrender.com/report/${currentTicket.ticketId}/messages`,
        {
          sender: "Customer",
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
          <Button mt={4} colorScheme="red" size="lg" w="full" onClick={() => navigate("/home-customer")}>
            Go to Home
          </Button>
          <Button
            mt={4}
            colorScheme="teal"
            size="lg"
            w="full"
            onClick={() => navigate("/create-ticket")}
          >
            Create New Ticket
          </Button>
        </HStack>
      </Box>

      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
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
                  <Text fontSize="sm" color="gray.500">
                    {new Date(message.timestamp).toLocaleString()}
                  </Text>
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

export default ViewTickets;
