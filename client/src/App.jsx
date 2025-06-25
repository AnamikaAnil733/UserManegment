import React from 'react'
import Login from './components/login.jsx'
import Register from './components/signup.jsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AdminPage from './pages/admin.jsx'
import Profile from './pages/userProfile.jsx'
import EditProfile from './components/editProfile.jsx'
import CreateUser from './components/CreateUser.jsx'

import PrivateRoute from './components/protectedroute.jsx'



function App() {
 

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route   path="/login" element={<Login/>}/>
      <Route    path = "/signup"  element={<Register/>}/>
     
      
      <Route
          path="/edit"
          element={
            <PrivateRoute allowedRoles={['admin', 'user']}>
              <EditProfile />
            </PrivateRoute>
          }
        />

  <Route path="/admin" element={
    <PrivateRoute allowedRoles={['admin']}>
      <AdminPage />
    </PrivateRoute>
  } />

<Route path="/createuser" element={
    <PrivateRoute allowedRoles={['admin']}>
      <CreateUser />
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
