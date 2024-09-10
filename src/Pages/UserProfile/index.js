import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../../assets/user-avatar.png";
import { Button } from "../../components/UI/Buttons";
import LocationBox from "../../components/UI/Location/LocationBox";
import LocationModal from "../../components/UI/Modal/LocationModal";
import { useGetLocationsQuery } from "../../redux/Api/locationApi";
import { notification, Spin } from "antd";
import { useGetMeQuery, useUpdateProfilePhotoMutation } from "../../redux/Api/authApi";
import { IoIosCamera } from "react-icons/io";
import NewLocation from "../../components/UI/Modal/NewLocation";
import ChatIcon from "../../assets/Icons/ChatIcon";
import { Dashboard, Main } from "../BusinessProfile/BusinessProfile";
import ScanIcon from "../../assets/Icons/ScanIcon";
import SupportModal from "../../components/UI/Modal/UserSupportModal";
import { TogleButton } from "../../components/Layout/BusinessSidebar";
import { BsBoxArrowInLeft } from "react-icons/bs";

const UserProfile = () => {
  const [updateProfile, { isLoading: updatingPhoto }] = useUpdateProfilePhotoMutation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [newLocationModal, setNewLocationModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const userType = useSelector((state) => state.auth.userType);

  const toggleShowLocationModal = () => {
    setShowLocationModal((prevState) => !prevState);
  };
  const toggleNewLocationModal = () => {
    setNewLocationModal((prevState) => !prevState);
  };
  const navigate = useNavigate();

  const [firstVisit, setFirstVisit] = useState(true);
  const [locations, setLocations] = useState([]);

  // Categories and locationCity are queries for the backend and they are in array formats
  // I am joining every element in the array using .join() to make the request query a single query in a request to avoid server overload
  // and making replacing spaces with hyphens and making them lowercase

  const {
    data,
    isError,
    error,
    isSuccess,
    refetch: refetchLocations
  } = useGetLocationsQuery({
    page: 1,
    count: 10
  });
  const location = useLocation();
  const {
    data: userData,
    isSuccess: userSuccess,
  } = useGetMeQuery({
    userType: userType,
  });
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if (isSuccess) {
      const filtered = data?.data?.filter(locs => locs.business.businessVerified === "verified");
      console.log(filtered);
      setLocations(data?.data);
    }
    if (isError) {
      notification.error({
        message: error?.error,
        duration: 3,
        placement: "bottomRight",
      });
    }
  }, [data, error?.error, isError, isSuccess, locations]);

  useEffect(() => {
    if (userSuccess) {
      setUserInfo(userData?.user);
    }
  }, [userData?.user, userSuccess]);

  useEffect(() => {
    // Check if it's the first visit
    if (firstVisit) {
      // Set firstVisit to false after the initial render
      setFirstVisit(false);
    } else {
      // Fetch data again when the page is revisited
      refetchLocations();
    }
  }, [location.pathname, firstVisit, refetchLocations]);
  const userLikedLocations = userInfo?.likedLocations;
  
  // Filter out any undefined values in case a location name doesn't match any location
  const filteredUserLikedLocations = userLikedLocations?.filter(Boolean) || [];

  return (
    <Container>
      <TogleButton showDashboard={showDashboard}>
        <BsBoxArrowInLeft size={28} fill="black" onClick={() => setShowDashboard(prev => !prev)} />
      </TogleButton>
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
            <h6>27 Outings</h6>
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
      <Main>
        <button className="fixed right-9 bottom-8 shadow-md rounded-full" onClick={() => setShowSupportModal(true)}>
          <ChatIcon />
        </button>
        <button className="fixed right-9 bottom-24 p-2.5 bg-[#FDEECE] rounded-full shadow-md">
          <ScanIcon />
        </button>
        <div className="d-flex justify-content-between align-items-center mb-5 mt-3">
          <div className="flex justify-start items-center gap-2 flex-wrap">
            <Link to="/create-event">
              <Button color="green">
                Create an Event
              </Button>
            </Link>
            <Link to="/plan-a-trip">
              <Button>Plan A Trip</Button>
            </Link>
            <button
              className="text-[#E9A309] font-semibold underline !scale-100"
              onClick={() => navigate('/settings')}
            >
              Settings{">"}
            </button>
          </div>
          <Button color="green" onClick={toggleNewLocationModal}>
            Created Events
          </Button>
        </div>
        <BoxContainer>
          {showLocationModal && (
            <LocationModal onClick={toggleShowLocationModal} />
          )}
          {showSupportModal && (
            <SupportModal username={userInfo?.username} onClick={() => setShowSupportModal((prev) => !prev)} />
          )}
          {newLocationModal && <NewLocation onClick={toggleNewLocationModal} />}
          {
            filteredUserLikedLocations.length < 1 ?
              <p>
                No Liked Locations Yet,{" "}
                <Button onClick={() => navigate(`/business-locations`)}>
                  Add some here{" "}
                </Button>{" "}
              </p>
            : <GridContainer>
                {filteredUserLikedLocations.map((location, i) => (
                    <LocationBox
                      onClick={() => {
                        navigate(`/location/${location?._id}`);
                      }}
                      location={location}
                      key={i}
                    />
                  )
                )}
              </GridContainer>
          }
        </BoxContainer>
      </Main>
    </Container>
  );
};

export default UserProfile;

const BoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  @media (max-width: 532px) {
    display: grid;
    place-items: center;
  }
`;

const Container = styled.div`
  display: flex;
  background-color: #c4c5c72d;
  a {
    text-decoration: none;
  }
  button {
    transform: scale(0.7);
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    place-items: center;
  }
`;