import {Box} from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Customer/Login';
import Register from './Customer/Register';
import Home from './Customer/Home';
import Profile from './Customer/Profile';
import CreateTicket from './Customer/CreateTicket';
import ViewTickets from './Customer/ViewTickets';
import ServiceAgentDashboard from './Service Agent/ServiceAgentDashboard';
import AdminDashboard from './Admin/AdminDashboard';
import AdminCustomerDashBoard from './Admin/AdminCustomerDashBoard';
import AdminCustomerAdd from './Admin/AdminCustomerAdd';
import Auth from './Auth';

function App() {
  console.log(process.env.REACT_APP_API_KEY)
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/register-customer' element={<Register/>}/>
        <Route path='/home-customer' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/create-ticket' element={<CreateTicket/>}/>
        <Route path='/tickets' element={<ViewTickets/>}/>
        <Route path='/Service-agent_dashboard' element={<ServiceAgentDashboard/>}/>
        <Route path='/admin_dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin-customer_dashboard' element={<AdminCustomerDashBoard/>}/>
        <Route path='/admin-customer_register' element={<AdminCustomerAdd/>}/>
      </Routes>
    </Router>
  );
}

export default App;
