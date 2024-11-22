import React, { useState,useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'

function AdminCustomerAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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
    },[])

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/customer/register', {
        name,
        email,
        password
      });
      

      toast({
        title: 'Registration Successful',
        description: `Welcome, ${response.data.name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/admin-customer_dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box maxW="lg" w="full" p={6} boxShadow="lg" bg="white" rounded="md">
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal.500">
          Create an Account
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                focusBorderColor="teal.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                focusBorderColor="teal.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                focusBorderColor="teal.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                focusBorderColor="teal.500"
              />
            </FormControl>

            <Button type="submit" colorScheme="teal" size="lg" w="full">
              Register
            </Button>
            <Button
            colorScheme='red'
             onClick={()=>{navigate('/admin-customer_dashboard')}}>
                Go to Customer list page
            </Button>
          </Stack>
        </form>

        
      </Box>
    </Flex>
  );
}

export default AdminCustomerAdd;
