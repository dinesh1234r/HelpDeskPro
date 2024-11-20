import {Box} from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Customer/Login';
import Register from './Customer/Register';
import Home from './Customer/Home';
import Profile from './Customer/Profile';
import CreateTicket from './Customer/CreateTicket';
import ViewTickets from './Customer/ViewTickets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/create-ticket' element={<CreateTicket/>}/>
        <Route path='/tickets' element={<ViewTickets/>}/>
      </Routes>
    </Router>
  );
}

export default App;
