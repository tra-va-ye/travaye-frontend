import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAdmin = () => {
  const userType = useSelector((state) => state.auth.userType);
//   const { isSuccess, isLoading, data } = useGetMeQuery({ userType });
//   console.log(data);

  return  userType === "admin" ? <Outlet /> : <Navigate to="/" />;

}

export default RequireAdmin