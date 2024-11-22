import React from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Heading,
  Flex,
} from '@chakra-ui/react';
import Login from './Customer/Login';
import LoginService from './Service Agent/LoginService';
import LoginAdmin from './Admin/LoginAdmin';

// Components for each tab
const Customer = () => (
  <Box p={4}>
    <Heading size="md" mb={4}>Customer Information</Heading>
    {/* Add Customer related content here */}
  </Box>
);

const Service = () => (
  <Box p={4}>
    <Heading size="md" mb={4}>Service Information</Heading>
    {/* Add Service related content here */}
  </Box>
);

const Admin = () => (
  <Box p={4}>
    <Heading size="md" mb={4}>Admin Dashboard</Heading>
    {/* Add Admin related content here */}
  </Box>
);

function Auth() {
  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" bg="gray.50" p={4}>
      <Box maxW="3xl" w="full" bg="white" p={6} boxShadow="lg" rounded="md">
        <Tabs isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab>Customer</Tab>
            <Tab>Service</Tab>
            <Tab>Admin</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <LoginService />
            </TabPanel>
            <TabPanel>
              <LoginAdmin />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
}

export default Auth;
