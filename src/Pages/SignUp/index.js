/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import classes from './SignUp.module.css';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../assets/signup-avatar.png';
import { Button } from '../../components/UI/Buttons';
import Loader from '../../components/UI/Loader';
import { businessSignUpSchema, userSignUpSchema } from '../../schemas';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEyeSlash } from 'react-icons/fa6';

import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import {
  useBusinessRegisterMutation,
  useUserRegisterMutation,
} from '../../redux/Api/authApi';
import { setUserType } from '../../redux/Slices/authSlice';

import { AuthFormWrapper, AuthRoutes, ErrorText, RouteLink } from '../Login';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seePass, setSeePass] = useState(false);
  const [userSignUp, setUserSignUp] = useState(true);

  const toggleSignUp = () => {
    setUserSignUp((prevState) => !prevState);
    dispatch(setUserType({ userType: userSignUp ? 'user' : 'business' }));
  };

  const [
    userRegister,
    {
      isLoading: userLoading,
      error: userError,
      isError: userIsError,
      isSuccess: userSuccess,
      data,
    },
  ] = useUserRegisterMutation();

  const [
    businessRegister,
    {
      isLoading: businessLoading,
      error: businessError,
      isError: businessIsError,
      isSuccess: businessSuccess,
      data: businessData,
    },
  ] = useBusinessRegisterMutation();

  useEffect(() => {
    if (userIsError) {
      notification.error({
        message: userError?.data?.error,
        duration: 3,
        placement: 'bottomRight',
      });
    } else if (businessIsError) {
      notification.error({
        message: businessError?.data?.error,
        duration: 3,
        placement: 'bottomRight',
      });
    }

    if (userSuccess) {
      // sessionStorage.setItem('user_id', data?.user?._id);
      sessionStorage.setItem('userType', 'user');
      sessionStorage.setItem('authToken', data?.token);
      navigate('/verify-email');
    } else if (businessSuccess) {
      const businessEmailVerified = businessData?.business.emailVerified;
      sessionStorage.setItem('authToken', businessData?.token);
      // sessionStorage.setItem('user_id', businessData?.business?._id);
      sessionStorage.setItem('userType', 'business');

      if (businessEmailVerified) {
        notification.success({
          message: 'Login Successfully',
          duration: 3,
          placement: 'bottomRight',
        });

        if (businessData?.business?.businessVerified === 'verified') {
          navigate('/business');
        } else if (businessData?.business?.businessVerified === 'pending') {
          notification.warning({
            message: ' Business Verification Pending',
            duration: 3,
            placement: 'bottomRight',
          });
          navigate('/business');
        } else {
          navigate(`/register`);
        }
      } else {
        navigate('/verify-email'); // Redirect to the email verification page
      }
    }
  }, [
    businessError,
    businessIsError,
    businessSuccess,
    navigate,
    userIsError,
    userSuccess,
  ]);

  const onSubmit = async () => {
    if (userSignUp) {
      dispatch(setUserType({ userType: 'user' }));

      await userRegister({
        fullName: values?.fullName,
        username: values?.userName,
        email: values?.email,
        password: values?.passWord,
      });
    } else if (!userSignUp) {
      dispatch(setUserType({ userType: 'business' }));

      await businessRegister({
        businessName: values.businessName,
        businessEmail: values.email,
        address: values.address,
        password: values.passWord,
      });
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {
      fullName: '',
      userName: '',
      passWord: '',
      email: '',
      businessName: '',
      address: '',
      occupation: '',
    },
    validationSchema: userSignUp ? userSignUpSchema : businessSignUpSchema,
    onSubmit,
  });

  return (
    <section className={classes.signup}>
      {(userLoading || businessLoading) && <Loader />}
      <div className='row'>
        <div
          className={`col-md-6 d-flex flex-column justify-content-center align-items-center order-2 order-md-1 ${classes.intro}`}
        >
          <div className='px-5'>
            <h3>
              {userSignUp
                ? 'Adventures for you from people '
                : 'Open a Business Account'}
              <br /> {userSignUp ? '' : 'with'}
              <span>{userSignUp ? 'like you' : ' Travaye'}</span>
            </h3>
            <p>
              {userSignUp
                ? 'Satisfy the explorer in you'
                : 'Enjoy a 2-month Free-Trial'}
            </p>
            {userSignUp ? UserContent : BusinessContent}
          </div>
        </div>
        <div className='col-md-6 d-flex justify-content-center  order-1 order-md-2'>
          <AuthFormWrapper onSubmit={handleSubmit}>
            <AuthRoutes>
              <RouteLink
                onClick={!userSignUp ? toggleSignUp : undefined}
                active={userSignUp}
              >
                User Sign Up
              </RouteLink>
              <RouteLink
                onClick={userSignUp ? toggleSignUp : undefined}
                active={!userSignUp}
              >
                Business Sign Up
              </RouteLink>
            </AuthRoutes>

            <div className='d-flex flex-column'>
              <input
                id={userSignUp ? 'fullName' : 'businessName'}
                name={userSignUp ? 'fullName' : 'businessName'}
                value={userSignUp ? values.fullName : values.businessName}
                className={`${
                  (userSignUp ? errors.fullName : errors.businessName) &&
                  (values.fullName || values.businessName) &&
                  classes['input-error']
                } mt-4`}
                placeholder={userSignUp ? 'Full Name' : 'Business Name'}
                onChange={handleChange}
              />
              {(userSignUp && (values.fullName || values.businessName)
                ? errors.fullName
                : errors.businessName) && (
                <ErrorText>
                  {userSignUp ? errors.fullName : errors.businessName}
                </ErrorText>
              )}
              <input
                id={userSignUp ? 'userName' : 'address'}
                name={userSignUp ? 'userName' : 'address'}
                value={userSignUp ? values.userName : values.address}
                className={`${
                  (userSignUp ? errors.userName : errors.address) &&
                  (values.userName || values.address) &&
                  classes['input-error']
                } mt-4`}
                placeholder={userSignUp ? 'Username' : 'Address'}
                onChange={handleChange}
              />
              {(userSignUp && (values.address || values.userName)
                ? errors.userName
                : errors.address) && (
                <ErrorText>
                  {userSignUp ? errors.userName : errors.address}
                </ErrorText>
              )}
              <input
                id='email'
                name='email'
                value={values.email}
                className={`${
                  errors.email && values.email && classes['input-error']
                } mt-4`}
                type='email'
                placeholder={userSignUp ? 'Email Address' : 'Business Email'}
                onChange={handleChange}
              />{' '}
              {errors.email && values.email && (
                <ErrorText>{errors.email}</ErrorText>
              )}
              {userSignUp && (
                <>
                  <input
                    placeholder='Occupation'
                    id='occupation'
                    type='text'
                    name='occupation'
                    value={values.occupation}
                    className={`${
                      errors.occupation &&
                      values.occupation &&
                      classes['input-error']
                    } mt-4`}
                    onChange={handleChange}
                  />
                  {errors.occupation && values.occupation && (
                    <ErrorText>{errors.occupation}</ErrorText>
                  )}
                </>
              )}
              <span className='relative block mt-4'>
                <input
                  className={`${
                    errors.passWord && values.passWord && classes['input-error']
                  } w-full`}
                  id='passWord'
                  name='passWord'
                  type={seePass ? 'text' : 'password'}
                  placeholder='Password'
                  value={values.passWord}
                  onChange={handleChange}
                />
                {seePass ? (
                  <FaEyeSlash
                    className='absolute right-[2%] top-[10%] translate-y-[50%] cursor-pointer'
                    onClick={() => setSeePass((prev) => !prev)}
                  />
                ) : (
                  <IoEyeSharp
                    className='absolute right-[2%] top-[10%] translate-y-[50%] cursor-pointer'
                    onClick={() => setSeePass((prev) => !prev)}
                  />
                )}
              </span>{' '}
              {errors.passWord && values.passWord && (
                <ErrorText>{errors.passWord}</ErrorText>
              )}
            </div>
            <br />
            {/* <div className="d-flex justify-content-center mt-2">
              {Alternate}
            </div> */}
            {/* <div className={classes.socials}>
              {FaceBookAuth} {GoogleAuth} {AppleAuth}
            </div> */}
            <div
              className={`d-flex justify-content-between mt-3 ${classes.text}`}
            >
              <p className='align-self-center'>
                Already have an account?{' '}
                <Link to='/login'>
                  <span>Login</span>
                </Link>
              </p>
              <Button
                color='green'
                type='submit'
                disabled={
                  errors.email ||
                  errors.passWord ||
                  errors.userName ||
                  errors.fullName ||
                  errors.businessName ||
                  errors.address ||
                  errors.occupation
                }
              >
                Sign Up
              </Button>
            </div>
          </AuthFormWrapper>
        </div>
      </div>
    </section>
  );
};

export default SignUp;

const BusinessContent = (
  <p className={classes.business}>
    Connect your business and events with clients <br />
    from all over the country{' '}
    <span style={{ color: '#009f57' }}>with travaye.</span>
  </p>
);

const UserContent = (
  <div className={classes.user}>
    <p>
      Trusted by over 5k users like{' '}
      <span style={{ color: '#009f57' }}> YOU!</span>
    </p>
    <p>
      “I wanted to go out but i had only 4k on me. <br />
      Luckily i found Travaye and used it. i am so glad <br /> because i enjoyed
      my outing so much!”
    </p>
    <div className='d-flex'>
      <img src={Avatar} alt='avatar' />
      <h5 className='align-self-center ms-3'>Jonathan Ikone</h5>
    </div>
  </div>
);
