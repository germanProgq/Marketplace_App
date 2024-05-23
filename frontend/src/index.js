import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom/client';
import { getRandomTransition } from './assets/Transitions/getRndTransition';
import { useUser} from './pages/Layout/assets/usercontext';
import { UserProvider } from './pages/Layout/assets/usercontext';
import axios from 'axios';

import ProtectedRoute from './pages/Layout/assets/protectedroute';
import Layout from './pages/Layout/assets/layout';
import HomePage from './pages/main-page';
import Catalog from './pages/Catalog/catalog';
import Cart from './pages/cart';
import Contact from './pages/contact';
import LogIn from './pages/login';
import NoPage from './pages/Layout/nopage';
import ItemDetail from './pages/Items/itemdetail';
import ProfilePage from './pages/UserStuff/userpage'
import UserSettings from './pages/UserStuff/usersettings';
import OrderPage from './pages/orderpage';
import ChangeName from './pages/UserStuff/Change/name';
import ChangeEmail from './pages/UserStuff/Change/email';
import ChangePass from './pages/UserStuff/Change/password';
import AddCatalogItem from './pages/Catalog/Admin/addToCatalog';
import EditUsers from './pages/UserStuff/Change/Admin/editUsers';
import EditCatalog from './pages/Catalog/Admin/editCatalog';
import DeleteUser from './pages/UserStuff/Change/Admin/deleteUser';
import UpdateUserInfo from './pages/UserStuff/Change/Admin/updateUserInfo';
import GeneratePassword from './assets/generatePasswords';
import GrantAdmin from './pages/UserStuff/Change/Owner/giveAdmin';
import RevokeAdmin from './pages/UserStuff/Change/Owner/revokeAdmin';
import GetUserInfo from './pages/UserStuff/Change/Owner/getFullInfo';
import ScrollToTop from './pages/Layout/assets/scrollToTop';
import ImpersonateUser from './pages/UserStuff/Change/Admin/impersonateUser';
import DeleteAccount from './pages/UserStuff/Change/deleteAccount';
import ViewTickets from './pages/Tickets/viewTickets';
import CreateTicket from './pages/Tickets/createTickets';
import TicketDetail from './pages/Tickets/viewSepTicket';
import AdminTicketDetail from './pages/Tickets/admin-ReplyToTicket';
import AdminOpenTickets from './pages/Tickets/admin-Tickets';
import SponsorPage from './pages/sponsor';
import ChangePriority from './pages/UserStuff/Change/priority';





const API = process.env.API || 'http://localhost:4000'




export default function App() {
  const location = useLocation();
  const user = useUser()
  const token = user?.token;

  const login = async(token) => {
    const data = {
      token: token,
    }
    const newUser = await axios.post(`${API}/token-login`, data);
    UpdateUserInfo(newUser.data.user)    
  }
  window.addEventListener('beforeunload', (ev) => {
    if (token) {
      localStorage.setItem('token', user?.token)
    }
  })
  window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
      login(JSON.parse(localStorage.getItem('token')))
    }
  })
  return (
    <AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Layout />}>
        <Route index element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><HomePage /></motion.div>}/>
        <Route path="catalog" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><Catalog /></motion.div>}/>
        <Route path="cart" element={<motion.div variants={getRandomTransition()}initial="initial" animate="animate" exit="exit"><Cart /></motion.div>}/>
        <Route path="contact" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><Contact /></motion.div>}/>
        <Route path="login" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><LogIn /></motion.div>}/>
        <Route path="/items/:id" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ItemDetail /></motion.div>}/>
        <Route path="/users/:username" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProfilePage /></motion.div>}/>
        <Route path="/settings" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><UserSettings /></motion.div>}/>
        <Route path="/order" element={ <motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><OrderPage /></motion.div>}/>
        <Route path="/change/username" element={ <motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ChangeName /></motion.div>}/>
        <Route path="/change/email" element={ <motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ChangeEmail /></motion.div>}/>
        <Route path="/change/password" element={ <motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ChangePass /></motion.div>}/>
        <Route path="/catalog/add" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'seller', 'owner']}><AddCatalogItem /></ProtectedRoute></motion.div>}/>
        <Route path="/users/edit" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'owner']}><EditUsers /></ProtectedRoute></motion.div>}/>
        <Route path="/catalog/edit" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'owner']}><EditCatalog /></ProtectedRoute></motion.div>}/>
        <Route path="/admin/delete/user" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'owner']}><DeleteUser /></ProtectedRoute></motion.div>}/>
        <Route path="/admin/change/user-stuf" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'owner']}><UpdateUserInfo /></ProtectedRoute></motion.div>}/>
        <Route path="/generate/password" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><GeneratePassword /></motion.div>}/>
        <Route path="/owner/grant-admin" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner']}><GrantAdmin /></ProtectedRoute></motion.div>}/>
        <Route path="/owner/revoke-admin" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner']}><RevokeAdmin /></ProtectedRoute></motion.div>}/>
        <Route path="/owner/see-full-data" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner']}><GetUserInfo /></ProtectedRoute></motion.div>}/>
        <Route path="/admin/impersonate" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner', 'admin']}><ImpersonateUser /></ProtectedRoute></motion.div>}/>
        <Route path="/user/delete" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><DeleteAccount /></motion.div>}/>    
        <Route path="/user/tickets" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ViewTickets /></motion.div>}/>   
        <Route path="/user/tickets/create" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><CreateTicket /></motion.div>}/>     
        <Route path="/user/tickets/:ticketId" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><TicketDetail /></motion.div>}/>
        <Route path="/admin/tickets/:ticketId" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner', 'admin']}><AdminTicketDetail /></ProtectedRoute></motion.div>}/>
        <Route path="/admin/tickets" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner', 'admin']}><AdminOpenTickets /></ProtectedRoute></motion.div>}/>
        <Route path="/sponsor" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><SponsorPage /></motion.div>}/>
        <Route path="/change-priority" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner', 'admin']}><ChangePriority /></ProtectedRoute></motion.div>}/>


        
        

        <Route path="*" element={<NoPage />}/>
      </Route>
    </Routes>
  </AnimatePresence>
  );
}
// Using createRoot for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Router><ScrollToTop/><UserProvider><App /></UserProvider></Router>);