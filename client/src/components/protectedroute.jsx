import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedroles = ['user','admin'] }) {
    const { token, user } = useSelector((state) => state.auth);

  console.log("Redux user:", user);
  
    if (!token || !user) {
      return <Navigate to="/login" replace />;
    }
    console.log(!user.role || !allowedroles.includes(user.role))
  
    if (!user.role || !allowedroles.includes(user.role)) {
      return <Navigate to="/login"  replace />;
    }
    
  
    return children;
  }
  

export default  PrivateRoute