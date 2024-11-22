import React, { useState,useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Stack,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const navigate=useNavigate()
  const toast = useToast();

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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.put(
        'https://helpdeskpro-backend.onrender.com/customer/update-password',
        { oldPassword:currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast({
        title: 'Success',
        description: response.data.message || 'Password updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" minH="100vh" bg="gray.50" p={6}>
      <Box maxW="md" w="full" p={6} boxShadow="lg" bg="white" rounded="md">
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal.500">
          Update Password
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleChange}
                focusBorderColor="teal.500"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                focusBorderColor="teal.500"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                focusBorderColor="teal.500"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" size="lg" w="full">
              Update Password
            </Button>
            <Button colorScheme='red'
            onClick={()=>{
              navigate('/home-customer')
            }}>
              Go to Home Page
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
}

export default Profile;
