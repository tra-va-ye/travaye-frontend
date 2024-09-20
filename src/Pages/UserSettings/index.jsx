import { notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useGetLocationsQuery } from "../../redux/Api/locationApi";
import {
  useDeleteMyProfileMutation,
  useUpdateUserProfileMutation,
} from "../../redux/Api/authApi";
import { BsBoxArrowInLeft } from "react-icons/bs";
import {
  TogleButton,
} from "../../components/Layout/BusinessSidebar";
import { InsightBox } from "../Business/Settings";
import { Button } from "../../components/UI/Buttons";
import { FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import Loader from "../../components/UI/Loader";
import { logout } from "../../redux/Slices/authSlice";
import UserSidebar from "../../components/Layout/UserSidebar";

export const passwordRegex = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

const UserSettings = () => {
  const [seePass, setSeePass] = useState(false);
  const [updateProfile, { isLoading: updateProfileLoading }] = useUpdateUserProfileMutation();
  const [showDashboard, setShowDashboard] = useState(false);
  const dispatch = useDispatch();

  const [deleteProfile] = useDeleteMyProfileMutation();

  const [locations, setLocations] = useState([]);
  const { data, isError, error, isSuccess } = useGetLocationsQuery({
    page: 1,
    count: 10,
  });

  const userData = useSelector((store) => store.auth.user);
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
        duration: 5,
        type: "warning",
        placement: "bottomRight",
        closeIcon: 
        <Button
          className="!text-sm px-1.5 py-1 !ml-5"
          onClick={async() => {
            if (!passwordRegex.test(userInfo?.password)) {
              return notification.error({
                message:
                "Password must contain at least 8 characters, one uppercase, one number and one special case character",
                duration: 3,
                placement: "bottomRight",
              });
            }
            sendUpdateData();
          }}  
        >Yes</Button>
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
  
  const handleDeleteUserProfile = () => {
    notification.warning({
      message: "Are you sure you want to Delete Your Profile?",
      duration: 5,
      type: "warning",
      placement: "bottomRight",
      closeIcon:
        <Button 
          className="!text-sm px-1.5 py-1 !ml-5"
          onClick={async () => {
            const response = await deleteProfile({userType: "user", id: userData._id });
            
            if (response?.data?.message) {
              notification.success({
                message: response?.data?.message,
                duration: 3,
                type: "success",
                placement: "bottomRight"
              });
            } else {
              notification.error({
                message: response?.error?.data?.error,
                duration: 3,
                type: "error",
                placement: "bottomRight"
              })
            }
            dispatch(logout());
          }}
        >Yes</Button>
    });
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
      <UserSidebar showDashboard={showDashboard} userInfo={userData} />
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
            <p>{userData?.likedLocations?.length || "None"}</p>
          </InsightBox>
          <InsightBox>
            <h6>Number of Businesses Reviewed</h6>
            <p>{userData?.reviews?.length || "None"}</p>
          </InsightBox>
          <InsightBox>
            <h6>Number of Profiles Previewed</h6>
            <p>{userData?.profilesPreviewed?.length}</p>
          </InsightBox>
          <InsightBox>
            <h6>Number of Visits</h6>
            <p>{userData?.numberOfVisits || "0"} Outing{userData?.numberOfVisits > 1 ? "s" : ""}</p>
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
          <Button color="#FF3D00" className="!border-none ml-auto" onClick={handleDeleteUserProfile}>
            Delete Profile
          </Button>
        </div>
      </Main>
    </Container>
  );
};

export default UserSettings;

const Container = styled.div`
  display: flex;
  background-color: #c4c5c72d;

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
