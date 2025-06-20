import React from 'react'
import Login from './components/login.jsx'
import Register from './components/signup.jsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AdminPage from './pages/admin.jsx'
import Profile from './pages/userProfile.jsx'

import PrivateRoute from './components/protectedroute.jsx'



function App() {
 

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route   path="/login" element={<Login/>}/>
      <Route    path = "/signup"  element={<Register/>}/>
      
  <Route path="/admin" element={
    <PrivateRoute allowedRoles={['admin']}>
      <AdminPage />
    </PrivateRoute>
  } />

<Route
  path="/profile"
  element={
    <PrivateRoute allowedRoles={['admin', 'user']}>
      <Profile />
    </PrivateRoute>
  }
/>


    </Routes>
    </BrowserRouter>
   
    </>
  )
}

export default App
