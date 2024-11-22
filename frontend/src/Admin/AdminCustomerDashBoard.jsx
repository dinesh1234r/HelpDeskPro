import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Flex, Table, Thead, Tbody, Tr, Th, Td,
  Input, FormControl, useToast, useDisclosure, Text,
  HStack, Badge,
  Spacer
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'

function AdminCustomerDashBoard() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newName, setNewName] = useState('');
  const toast = useToast();
  const navigate=useNavigate()

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
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/customers-list', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch customer data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchCustomers();
  }, []);

  const handleEditUsername = (customerId) => {
    setEditingCustomer(customerId);
    const customer = customers.find((c) => c._id === customerId);
    setNewName(customer.name);
  };

  const handleSaveUsername = async (customerId) => {
    if (!newName.trim()) {
      toast({
        title: 'Error',
        description: 'Username cannot be empty.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/admin/customers/${customerId}`,
        {  newName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === customerId ? { ...customer, name: newName } : customer
        )
      );

      setEditingCustomer(null);
      toast({
        title: 'Success',
        description: 'Username updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating username:', error);
      toast({
        title: 'Error',
        description: 'Failed to update username.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" p={6} bg="gray.50" minH="100vh">
      <HStack>
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Customer List</Text>
      </Box>
      <Spacer/>
      <Box mb={4} >
        <Button colorScheme='gray' mr={2}
        onClick={()=>{
          navigate('/admin-customer_register')
        }}
        >
          Create Customer
        </Button>
        <Button
          colorScheme="teal"
          onClick={() => navigate('/admin_dashboard')} 
        >
          Go to Home Page
        </Button>
      </Box>
      </HStack>
      <Box bg="white" shadow="md" borderRadius="md" p={4}>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers.map((customer) => (
              <Tr key={customer._id}>
                <Td>
                  {editingCustomer === customer._id ? (
                    <FormControl>
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter new name"
                        size="sm"
                      />
                    </FormControl>
                  ) : (
                    <Text>{customer.name}</Text>
                  )}
                </Td>
                <Td>
                  <Text>{customer.email}</Text>
                </Td>
                <Td>
                  {editingCustomer === customer._id ? (
                    <>
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleSaveUsername(customer._id)}
                        mr={2}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => setEditingCustomer(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleEditUsername(customer._id)}
                    >
                      Edit Name
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}

export default AdminCustomerDashBoard;
