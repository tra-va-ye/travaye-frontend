/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetMeQuery } from '../redux/Api/authApi';
import Loader from '../components/UI/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { logout } from '../redux/Slices/authSlice';
import { saveDeviceMessagingToken } from '../firebase/messaging';

const RequireAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess, isLoading, data } = useGetMeQuery({
    userType: sessionStorage.getItem('userType'),
  });
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      saveDeviceMessagingToken(data?.user?._id);
    }
    if (!isLoading && !isSuccess) {
      console.log({ data, isSuccess, isLoading });

      if (!user?._id) {
        navigate('/login');
        dispatch(logout());
      }
    }
  }, [isLoading, data, user]);

  return isLoading ? <Loader /> : isSuccess ? <Outlet /> : null;
};

export default RequireAuth;
