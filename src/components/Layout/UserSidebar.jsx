import React from 'react'
import { Dashboard } from "../../Pages/BusinessProfile"
import { useUpdateProfilePhotoMutation } from '../../redux/Api/authApi';
import Avatar from "../../assets/user-avatar.png";
import { Spin } from 'antd';
import { IoIosCamera } from "react-icons/io";

const UserSidebar = ({ showDashboard, userInfo }) => {
  const [updateProfile, { isLoading: updatingPhoto }] = useUpdateProfilePhotoMutation();

  return (
    <Dashboard showDashboard={showDashboard}>
    <div className="relative">
      {updatingPhoto && (
        <Spin className="absolute bottom-[50%] left-[50%]" />
      )}
      <img
        className="rounded-full w-[150px] h-[150px]"
        src={userInfo?.profilePhoto || Avatar}
        alt="avatar"
      />
      <label htmlFor="photo">
        <IoIosCamera className="text-black text-[25px] absolute bottom-[15%] right-[5%] cursor-pointer !block" />
      </label>
      <input
        onChange={(e) => {
          const profileData = new FormData();
          profileData.append("picture", e.target.files[0]);
          updateProfile(profileData);
        }}
        id="photo"
        accept="image/*"
        type="file"
        className="hidden"
      />
    </div>
    <div className="mb-3 -mt-2">
      <h2 className="mt-1 text-black text-2xl font-semibold text-center mb-0">{`${userInfo?.fullName}`}</h2>
      <h6 className="text-[#E9A309] text-lg">{`@${userInfo?.username}`}</h6>
      <p className="mt-0">{userInfo?.occupation || "No Occupation Provided"}</p>
    </div>
    <div>
      <div className="px-3">
        <h5 className="mb-1 text-xl">About</h5>
        <h6>{userInfo?.aboutUser || "No User bio"}</h6>
      </div>
      <div className="mt-4">
        <h5 className="text-xl">Total Outings</h5>
        <h6>{userInfo?.numberOfVisits || `${userInfo?.numberOfVisits} Outings` || "None"}</h6>
      </div>
      <div className="mt-4">
        <h5 className="text-xl">Total Reviews</h5>
        <h6>{userInfo?.reviews?.length || "None"}</h6>
      </div>
      <div className="mt-5">
        <h5 className="text-xl">Travaye Points</h5>
        <p>Coming Soon</p>
      </div>
    </div>
  </Dashboard>
  )
}

export default UserSidebar