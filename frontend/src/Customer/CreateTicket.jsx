import React, { useState,useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'

function CreateTicket() {
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
  });
  const toast = useToast();
  const navigate=useNavigate()

  useEffect(()=>{
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
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description } = ticketData;

    if (!title || !description) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('https://helpdeskpro-backend.onrender.com/report/put-ticket', ticketData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  
        },
      });

      if (response.status === 201) {
        toast({
          title: 'Ticket Created',
          description: 'Your ticket has been successfully created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setTicketData({ title: '', description: '' }); 
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
    >
      <Box
        maxW="lg"
        w="full"
        p={6}
        boxShadow="lg"
        bg="white"
        rounded="md"
      >
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal.500">
          Create a New Ticket
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                placeholder="Ticket title"
                value={ticketData.title}
                onChange={handleChange}
                focusBorderColor="teal.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Describe your issue"
                value={ticketData.description}
                onChange={handleChange}
                focusBorderColor="teal.500"
              />
            </FormControl>

            <Button type="submit" colorScheme="teal" size="lg" w="full">
              Create Ticket
            </Button>
          </Stack>
        </form>
        <Stack direction="row" spacing={4} mt={6}>
          <Button
            colorScheme="red"
            size="lg"
            w="full"
            onClick={() => navigate('/home-customer')}
          >
            Go to Home
          </Button>

          <Button
            colorScheme="teal"
            size="lg"
            w="full"
            onClick={() => navigate('/tickets')}
          >
            View Tickets
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
}

export default CreateTicket;
