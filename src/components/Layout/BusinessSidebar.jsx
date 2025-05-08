import React from 'react';
import styled from 'styled-components';
import { useUpdateProfilePhotoMutation } from '../../redux/Api/authApi';
import Avatar from '../../assets/user-avatar.png';
import { IoIosCamera } from 'react-icons/io';
import { Spin } from 'antd';

const Dashboard = ({ showDashboard, businessData }) => {
  const [updateProfilePhoto, { isLoading: isPhotoLoading }] =
    useUpdateProfilePhotoMutation();
  console.log(businessData);

  return (
    <DashboardContainer showDashboard={showDashboard}>
      <div className='relative'>
        {isPhotoLoading && (
          <Spin className='absolute bottom-[50%] left-[50%]' />
        )}
        <img
          className='rounded-full w-[150px] h-[150px]'
          src={businessData?.profilePhoto || Avatar}
          alt='avatar'
        />
        <label htmlFor='photo'>
          <IoIosCamera className='text-black text-[25px] absolute bottom-[15%] right-[5%] cursor-pointer !block' />
        </label>
        <input
          onChange={(e) => {
            const profileData = new FormData();
            profileData.append('picture', e.target.files[0]);
            updateProfilePhoto(profileData);
          }}
          id='photo'
          accept='image/*'
          type='file'
          className='hidden'
        />
      </div>
      <div>
        <h3 className='mt-5 text-[#9D9D9D] text-2xl font-bold mb-2 px-2'>
          {businessData?.businessName}
        </h3>
        <h6 className='text-[#E9A309] text-lg font-semibold mb-2 px-2'>
          {businessData?.businessEmail}
        </h6>
        <p className='mt-1 text-[#9d9d9d] font-semibold'>
          {businessData?.businessCategory
            ? `${businessData?.businessCategory
                ?.replace('%26', '&')
                ?.split('-')
                ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                ?.join(' ')}`
            : 'No Category'}
        </p>
        {/* </div> */}
      </div>
      <div>
        <div>
          <h6 className='text-xl font-bold text-[#009F57] mt-7'>Address</h6>
          <p className='mt-1.5 px-2 text-[#9d9d9d] text-lg'>
            {businessData?.businessAddress}
          </p>
        </div>
        <div>
          <h6 className='text-xl font-bold text-[#009F57] mt-6'>About</h6>
          <p className='mt-1.5 px-4'>
            {businessData?.description || 'No description yet'}
          </p>
        </div>
        <div className='mt-6'>
          <h5>Profile Views</h5>
          <p>{businessData?.profileVisits || 'None'}</p>
        </div>
        <div className='mt-6'>
          <h5>Price Range</h5>
          <p>{businessData?.budgetClass?.label}</p>
        </div>
      </div>
    </DashboardContainer>
  );
};

export const DashboardContainer = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 24%;
  position: relative;

  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgb(255, 254, 252);
  border-top: 0;
  border-right: 2px solid transparent;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16);
  padding-block: 30px;
  z-index: 5;
  transition: all ease-in-out 500ms !important;

  ::-webkit-scrollbar {
    width: 12px; /* Set the width of the scrollbar */
  }

  ::-webkit-scrollbar-thumb {
    background-color: #9d9d9d;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: #d9d9d9;
  }
  &:nth-child(5) div {
    margin-top: 1rem;
  }

  h5 {
    color: #009f57;
    font-weight: 700;
  }

  @media (max-width: 1150px) {
    max-width: ${(props) => (props.showDashboard ? 'auto' : '0')};
    width: 25%;
  }

  @media (max-width: 950px) {
    width: 34%;
  }

  @media (max-width: 720px) {
    width: 45%;
  }

  @media (max-width: 560px) {
    width: 56%;
  }
`;

export const TogleButton = styled.button`
  position: absolute;
  display: none;
  top: 120px;
  z-index: 1000 !important;
  background-color: white;
  border-radius: 50%;
  padding: 8px;
  padding-right: 4px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
  transition: all ease-in-out 300ms;
  cursor: pointer;
  opacity: 0.7;
  transform: scale(1)
    rotate(${(props) => (props.showDashboard ? '' : '180')}deg) !important;

  &:focus {
    opacity: 1;
  }

  @media (max-width: 1150px) {
    transform: scale(1)
      rotate(${(props) => (props.showDashboard ? '' : '180')}deg) !important;
    display: block;
    left: ${(props) => (props.showDashboard ? '22%' : '10px')};
  }

  @media (max-width: 950px) {
    left: ${(props) => (props.showDashboard ? '30.5%' : '10px')};
  }

  @media (max-width: 720px) {
    left: ${(props) => (props.showDashboard ? '38%' : '10px')};
  }

  @media (max-width: 560px) {
    left: ${(props) => (props.showDashboard ? '50.5%' : '10px')};
  }
`;

export default Dashboard;
