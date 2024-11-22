import React, { useState } from 'react'
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

function Login() {
    const navigate=useNavigate()

    const [formData,setFormData]=useState({
        email:"",
        password:""
    })

    const toast = useToast();

    const handlechange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      console.log('Form data being sent:', formData); 
      
      try {
        const response = await axios.post('https://helpdeskpro-backend.onrender.com/customer/login', formData);
        console.log(response);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('ID', response.data.id);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('email', response.data.email);
        
        toast({
          title: 'Login Successful.',
          description: `Welcome back, ${response.data.name}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        navigate('/home-customer');
      } catch (error) {
        console.error('Login Error:', error); 
        toast({
          title: 'Error.',
          description: error.response?.data?.message || 'Something went wrong.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    

  return (
    <Flex
      align="center"
      justify="center"
      bg="gray.50"
    >
      <Box
        w="full"
        p={6}
        bg="white"
        rounded="md"
      >
        <Heading
          as="h1"
          size="lg"
          mb={6}
          textAlign="center"
          color="teal.500"
        >
          Login to Customer Account
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                focusBorderColor="teal.500"
                name='email'
                onChange={(e)=>handlechange(e)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                focusBorderColor="teal.500"
                name='password'
                onChange={(e)=>handlechange(e)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              w="full"
            >
              Login
            </Button>
          </Stack>
        </form>

        <Text textAlign="center" mt={4}>
          Don't have an account?{' '}
          <Button
            variant="link"
            colorScheme="teal"
            onClick={()=>navigate('/register-customer')}
          >
            Sign Up
          </Button>
        </Text>
      </Box>
    </Flex>
  );
}

export default Login;
