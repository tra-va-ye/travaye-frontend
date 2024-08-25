import { notification, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Avatar from "../../assets/user-avatar.png";
import { useGetLocationsQuery } from "../../redux/Api/locationApi";
import {
  useUpdateProfilePhotoMutation,
  useUpdateUserProfileMutation,
} from "../../redux/Api/authApi";
import { IoIosCamera } from "react-icons/io";
import { BsBoxArrowInLeft } from "react-icons/bs";
import {
  DashboardContainer,
  TogleButton,
} from "../../components/Layout/BusinessSidebar";
import { InsightBox } from "../Business/Settings";
import { Button } from "../../components/UI/Buttons";
import { FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import Loader from "../../components/UI/Loader";

export const passwordRegex = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

const UserSettings = () => {
  const [seePass, setSeePass] = useState(false);
  const [updateProfilePhoto, { isLoading }] = useUpdateProfilePhotoMutation();
  const [updateProfile, { isLoading: updateProfileLoading }] = useUpdateUserProfileMutation();
  const [showDashboard, setShowDashboard] = useState(false);

  const [locations, setLocations] = useState([]);
  const { data, isError, error, isSuccess } = useGetLocationsQuery({
    page: 1,
    count: 10,
  });

  const userData = useSelector((store) => store.auth.user).payload;
  const [userInfo, setUserInfo] = useState({
    fullName: userData?.fullName,
    username: userData?.username,
    password: "",
    occupation: userData?.occupation,
    aboutUser: userData?.aboutUser
  });

  useEffect(() => {
    if (isSuccess) {
      setLocations(data?.data);
    }
    if (isError) {
      notification.error({
        message: error?.error,
        duration: 3,
        placement: "bottomRight",
      });
    }
  }, [data, error, isError, isSuccess, locations]);

  const handleChange = (field, value) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo?.password) {
      return notification.warning({
        message: "Are you sure you want to change your password?",
        duration: 0,
        type: "warning",
        placement: "bottomRight",
        closeIcon: <Button className="!text-sm px-1.5 py-1 !ml-5">Yes</Button>,
        onClose: async () => {
          if (!passwordRegex.test(userInfo?.password)) {
            return notification.error({
              message:
              "Password must contain at least 8 characters, one uppercase, one number and one special case character",
              duration: 3,
              placement: "bottomRight",
            });
          }
          sendUpdateData();
        }
      });
    }
    sendUpdateData();
  };

  const sendUpdateData = async () => {
    const response = await updateProfile(userInfo);
    if (response?.data?.message) {
      notification.success({
        message: response?.data?.message,
        duration: 3,
        type: "success",
        placement: "bottomRight"
      })
    } else {
      notification.error({
        message: response?.error?.data?.error,
        duration: 3,
        type: "error",
        placement: "bottomRight"
      })
    }
  }

  return (
    <Container>
      <TogleButton showDashboard={showDashboard}>
        <BsBoxArrowInLeft
          size={28}
          fill="black"
          onClick={() => setShowDashboard((prev) => !prev)}
        />
      </TogleButton>
      <DashboardContainer showDashboard={showDashboard}>
        <div className="relative">
          {isLoading && <Spin className="absolute bottom-[50%] left-[50%]" />}
          <img
            className="rounded-full w-[150px] h-[150px]"
            src={userData?.profilePhoto || Avatar}
            alt="avatar"
          />
          <label htmlFor="photo">
            <IoIosCamera className="text-black text-[25px] absolute bottom-[15%] right-[5%] cursor-pointer !block" />
          </label>
          <input
            onChange={(e) => {
              const profileData = new FormData();
              profileData.append("picture", e.target.files[0]);
              updateProfilePhoto(profileData);
            }}
            id="photo"
            accept="image/*"
            type="file"
            className="hidden"
          />
        </div>
        <div>
          <h3 className="mt-4 text-[#000000] text-2xl font-bold">
            {userData?.fullName}
          </h3>
          <h6 className="mt-1 text-[#E9A309] font-medium text-xl ">
            @{userData?.username}
          </h6>
          <p className="mt-1 text-[#9d9d9d] text-lg font-semibold">
            {userData.occupation || "University Student"}
          </p>
        </div>
        <div>
          <div>
            <h5 className="text-xl font-bold text-[#009F57] mt-6 flex gap-1 justify-center">
              About
            </h5>
            <p className="mt-1 px-3">{userData?.aboutUser || "No User bio"}</p>
          </div>
          <div className="mt-6">
            <h5>Total Outings</h5>
            <p>{userData?.outings?.length || "27"} outings</p>
          </div>
          <div className="mt-6">
            <h5>Total Posts</h5>
            <p>{userData?.posts?.length || "6"} posts</p>
          </div>
          <div className="mt-6">
            <h5>Average Review</h5>
            <p>4.5 stars</p>
          </div>
        </div>
      </DashboardContainer>
      <Main>
        {updateProfileLoading && <Loader />}
        <div className="w-full flex justify-between items-center mb-4">
          <h3 className="text-2xl text-[#009F57] font-bold">Settings</h3>
          <button
            className="text-[#E9A309] font-semibold underline"
            onClick={() => window.history.back()}
          >
            Go back{">"}
          </button>
        </div>
        <h5 className="text-xl text-[#E9A309] font-semibold">
          *Edit Basic Information
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row mt-3">
            <div className="col-md-6">
              <div>
                <label htmlFor="name">Full Name</label>
                <input
                  id="fullName"
                  value={userInfo?.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div>
                <label htmlFor="name">Username</label>
                <input
                  id="username"
                  value={userInfo?.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="password">Password</label>
              <span className="relative block">
                <input
                  id="password"
                  placeholder="*********"
                  type={seePass ? "text" : "password"}
                  value={userInfo?.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                {seePass ? (
                  <FaEyeSlash
                    className="absolute right-[4%] top-[10%] translate-y-[50%] cursor-pointer"
                    onClick={() => setSeePass((prev) => !prev)}
                  />
                ) : (
                  <IoEyeSharp
                    className="absolute right-[4%] top-[10%] translate-y-[50%] cursor-pointer"
                    onClick={() => setSeePass((prev) => !prev)}
                  />
                )}
              </span>
            </div>

            <div className="col-md-6">
              <label htmlFor="occupation">Occupation</label>
              <input
                type="text"
                id="occupation"
                placeholder="What do you do for a living"
                value={userInfo?.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="aboutUser">About</label>
              <textarea
                id="aboutUser"
                value={userInfo?.aboutUser || ""}
                onChange={(e) => handleChange("aboutUser", e.target.value)}
                rows={5}
                placeholder="We are a sports and rec brand dedicated to helping athletes destress after a workout session or other related activities."
              />
            </div>
          </div>
        </form>

        <h5 className="text-xl text-[#E9A309] font-semibold py-3.5">
          *View More Data
        </h5>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          <InsightBox>
            <h6>Number of Businesses Liked</h6>
            <p>{userData?.likes?.length || 68}</p>
          </InsightBox>
          <InsightBox>
            <h6>Number of Businesses Reviewed</h6>
            <p>{userData?.reviews?.length || 76}</p>
          </InsightBox>
          <InsightBox>
            <h6>Number of Profiles Viewed</h6>
            <p>168</p>
          </InsightBox>
          <InsightBox>
            <h6>Number of Visits</h6>
            <p>27 Outings</p>
          </InsightBox>
        </div>
        <div className="flex flex-col items-end gap-2.5 my-9">
          <Button
            color="#009F57"
            className="!border-none ml-auto"
            onClick={handleSubmit}
          >
            Update Profile
          </Button>
          {/* <Button color="#FF3D00" className="!border-none ml-auto">
          Cancel Subscription
        </Button> */}
        </div>
      </Main>
    </Container>
  );
};

export default UserSettings;

const Container = styled.div`
  display: flex;
  background-color: #c4c5c72d;

  /* height: calc(100vh - 95px); */
  /* overflow: auto; */

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #9d9d9d;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: #d9d9d9;
  }

  a {
    text-decoration: none;
  }
`;

const Main = styled.div`
  flex: 1 1 0%;
  min-height: auto;
  margin-left: 0;
  padding: 20px 40px;
  overflow: auto;

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: 700;
    font-size: 15px;
  }
  input,
  select,
  textarea {
    outline: none;
    display: block;
    width: 100%;
    background: #ffffff;
    border: 2px solid rgba(0, 159, 87, 0.25);
    border-radius: 5px;

    margin-bottom: 16px;
    padding: 4px 8px;
  }

  ::-webkit-scrollbar {
    width: 12px;
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #9d9d9d;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: #d9d9d9;
  }

  @media (max-width: 1150px) {
    margin-left: 0;
    /* width: 100%; */
  }
`;
