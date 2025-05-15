import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/Slices/authSlice';

const RequireAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType, user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.email) {
      dispatch(logout());
      navigate('/login');
    }
  }, [user, token]);

  return userType === 'admin' ? <Outlet /> : <Navigate to='/' />;
};

export default RequireAdmin;
