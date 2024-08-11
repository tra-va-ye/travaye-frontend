import { Image, notification, Spin } from "antd";
import { useEffect, useState } from "react";
import { FiveStars, FourStars } from "../../components/UI/svgs/svgs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../../assets/user-avatar.png";
import LocationModal from "../../components/UI/Modal/LocationModal";
import NewLocation from "../../components/UI/Modal/NewLocation";
import { useGetLocationsQuery } from "../../redux/Api/locationApi";
import { useGetMeQuery, useUpdateProfilePhotoMutation } from "../../redux/Api/authApi";
import { IoIosCamera } from "react-icons/io";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { TogleButton } from "../../components/Layout/BusinessSidebar";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css/bundle";
import { Navigation } from "swiper";
import ChatIcon from "../../assets/Icons/ChatIcon";
import SupportModal from "../../components/UI/Modal/SupportModal";

const BusinessProfile = () => {
  const [updateProfile, { isLoading }] = useUpdateProfilePhotoMutation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newLocationModal, setNewLocationModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const userType = useSelector((state) => state.auth.userType);
  const navigate = useNavigate();
  const toggleShowLocationModal = () => {
    setShowLocationModal((prevState) => !prevState);
  };

  const [selectedCategories, updateSelectedCategories] = useState([]);
  const [selectedFilters, updateSelectedFilters] = useState([]);
  const [locations, setLocations] = useState([]);
  const { data, isError, error, isSuccess } = useGetLocationsQuery({
    page: 1,
    count: 10,
    categories: selectedCategories
      .map((category) => category.toLowerCase().replace(/\s+/g, "-"))
      .join(","),
    locationCity: selectedFilters.join(","),
  });
  const [userData, setuserData] = useState({});
  const {
    data: businessData
    // isSuccess:,
    // isLoading,
    // refetch,
  } = useGetMeQuery({ userType });

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

  useEffect(() => {
    console.log(businessData.user);
    setuserData(businessData.user);
    if (userData) {
      if (userData?.businessVerified === "verified") {
        navigate(`/${userType}`);
      } else if (userData?.businessVerified === "pending") {
        notification.warning({
          message: " Business Verification Pending",
          duration: 3,
          placement: "bottomRight",
        });
        navigate(`/${userType}`);
        // refetchUserData();
      } else if (userData?.businessVerified === "false") {
        notification.error({
          message: " Business not Verified ",
          duration: 3,
          placement: "bottomRight",
        });
        // refetchUserData();

        // Navigate to the verification page
        // navigate("/register");
      }
    }
  }, [userData, navigate, userType]);

  console.log(userData);

  return (
    <Container>
      <TogleButton showDashboard={showDashboard}>
        <BsBoxArrowInLeft size={28} fill="black" onClick={() => setShowDashboard(prev => !prev)} />
      </TogleButton>
      <Dashboard showDashboard={showDashboard}>
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
              updateProfile(profileData);
            }}
            id="photo"
            accept="image/*"
            type="file"
            className="hidden"
          />
        </div>
        <div>
          <h4 className="mt-2 text-2xl font-bold text-[#9d9d9d] px-3">{userData?.businessName}</h4>
          <h6 className="mt-2 text-[#E9A309] text-lg font-medium">{userData?.businessEmail}</h6>
          <h6 className="mt-1 text-[#9d9d9d] font-semibold">{userData?.businessCategory ? `${userData?.businessCategory
            ?.split("-")
            ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}` : "Parks and Recreation"}</h6>
        </div>
        <div>
          <div className="mt-6">
            <h3 className="">Address</h3>
            <p className="mt-1">{userData?.businessAddress || "Funtasticaland, Ikorodu-Ososun Rd, Lagos 105102, Ikeja"}</p>
          </div>
          <div className="mt-4">
            <h3 className="">About</h3>
            <p className="">{userData?.businessAbout || "Maryland Mall Cinemas is one of Nigeria's leading cinema developers and operators of multiplex cinemas in Nigeria."}</p>
          </div>
          <div className="mt-4">
            <h3>User Visits</h3>
            <p>{userData.visits || "200"}</p>
          </div>
          <div className="mt-4">
            <h3>Average Review</h3>
            <p>{userData.reviewAverage || "4.5 "} stars</p>
          </div>
          <div className="my-4">
            <h3>Price Range</h3>
            <p>{userData.priceRange || "#5 - #10k"}</p>
          </div>
        </div>
      </Dashboard>
      <Main>
        <button className="absolute right-9 bottom-8 shadow-md rounded-full" onClick={() => setShowSupportModal(true)}>
          <ChatIcon />
        </button>
        <div className="">
          {/* <Profile onClick={toggleDashboard}>
            <AccountCircleIcon />
          </Profile> */}
          <div className="flex items-center justify-between">
            <H3 color="#009f57" fontWeight="700" className="mb-1 text-xl md:text-3xl">
              Your Profile
            </H3>
            <button
              className="text-[#E9A309] font-semibold underline !scale-100"
              onClick={() => navigate('/settings')}
            >
              Settings{">"}
            </button>
          </div>
          <div>
            <Swiper
              className='!scale-100'
              slidesPerView={1}
              modules={[ Navigation ]}
              spaceBetween={20}
              loop={true}
              navigation
            >
              {
                userData?.businessLocationImages?.map((imag, i) => (
                  <SwiperSlide key={i}>
                    <img src={imag} className='h-[20rem] w-4/5 rounded-lg border border-red-500' alt={`Poster ${i+1}`} />
                  </SwiperSlide>
                ))
              }
            </Swiper>
          </div>
                
          <div>
            {" "}
            <ReviewContainer
              className={`${
                userType !== "user" ? `w-full` : `px-3`
              } col-md-6  my-4 `}
            >
              <div className="d-flex justify-content-between mb-4 items-center mt-3">
                <ReviewH4 className="text-2xl font-bold">Reviews</ReviewH4>
                <div className="flex gap-2 md:gap-4 flex-col md:flex-row">
                  <p className="text-black font-medium">Average Rating</p>{" "}
                  <i>{FourStars}</i>
                </div>
              </div>
              <Review className={`flex flex-wrap gap-4 flex-1`}>
                {userData?.reviews?.length > 0 ? (
                  userData?.reviews?.map((review, i) => {
                    return (
                      <ReviewCard className="flex-[1_0_30%]" key={i}>
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <ReviewUser>
                              <img
                                src={Avatar}
                                className="img-fluid "
                                alt="pfp"
                              />
                              <p className="" style={{ color: "#009f57" }}>
                                {review?.reviewerFullname}
                              </p>
                            </ReviewUser>
                            <i>{FiveStars}</i>
                          </div>

                          <p>{review?.reviewDescription}</p>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap rounded-lg overflow-hidden mt-3 flex-container">
                            <Image.PreviewGroup
                              preview={{
                                onChange: (current, prev) =>
                                  console.log(
                                    `current index: ${current}, prev index: ${prev}`
                                  ),
                              }}
                            >
                              {review?.reviewImagePaths?.map((image, key) => {
                                return (
                                  <div className={`flex-[1_0_30%] `}>
                                    <Image
                                      src={image}
                                      width={"100%"}
                                      height={150}
                                      className=" object-cover"
                                    />
                                  </div>
                                );
                              })}
                            </Image.PreviewGroup>
                          </div>
                        </div>
                      </ReviewCard>
                    );
                  })
                ) : (
                  <p>No reviews yet</p>
                )}
              </Review>
            </ReviewContainer>
          </div>
        </div>
        <BoxContainer>
          {showLocationModal && (
            <LocationModal onClick={toggleShowLocationModal} />
          )}
          {showSupportModal && (
            <SupportModal onClick={() => setShowSupportModal((prev) => !prev)} />
          )}
          <NewLocation open={newLocationModal} setOpen={setNewLocationModal} />
        </BoxContainer>
      </Main>
    </Container>
  );
};

export default BusinessProfile;

const Profile = styled.i`
  margin-right: 10px;
  margin-left: 10px;

  svg {
    transform: scale(${(props) => !props.close && "1.5"});
    cursor: pointer;
  }
  @media (min-width: 1151px) {
    display: none;
  }
`;
const BoxContainer = styled.div`
  @media (max-width: 532px) {
    display: grid;
    place-items: center;
  }
`;

const Container = styled.div`
  display: flex;
  background-color: #c4c5c72d;

  height: calc(100vh - 95px);
  overflow: auto;
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
  a {
    text-decoration: none;
  }
  button {
    transform: scale(0.7);
  }
`;

export const Dashboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 24%;
  height: calc(100vh - 95px);
  position: relative;

  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgb(255, 254, 252);
  border-top: 0;
  border-right: 2px solid transparent;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16);
  padding-block: 50px;
  z-index: 5;

  ::-webkit-scrollbar {
    width: 10px; /* Set the width of the scrollbar */
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

  h3 {
    color: #009f57;
    font-weight: 700;
    font-size: 20px;
  }

  h5 {
    color: #009f57;
    font-weight: 700;
  }

  p {
    color: #9d9d9d;
    padding-inline: 30px;
    margin-top: 6px;
  }

	@media (max-width: 1150px) {
		max-width: ${(props) => (props.showDashboard ? "auto" : "0")};
		width: 25%;
	}

	@media (max-width: 950px) {
		width: 34%;
	}

	@media (max-width: 720px) {
		width: 42%;
	}

	@media (max-width: 560px) {
		width: 56%;
	}
`;

const H3 = styled.h3`
  color: ${(props) => props.color};
  font-weight: ${(props) => `${props.fontWeight}`};
  font-size: ${(props) => `${props.fontSize}px`};
`;
export const Main = styled.div`
  flex: 1 1 0%;
  min-height: auto;
  margin-left: 0;
  padding: 20px 40px;
  overflow: auto;
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

  @media (max-width: 1150px) {
    margin-left: 0;
  }

  
  @media (max-width: 576px) {
    padding: 16px;
  }
`;
const ReviewContainer = styled.div``;
const ReviewH4 = styled.h4`
  color: #009f57;
`;
const Review = styled.div`
  max-height: 50vh;
  display: flex;
  overflow-y: auto;
  padding-right: 15px;
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
`;
const ReviewCard = styled.div`
  background: #ffffff;
  border: 2px solid rgba(0, 159, 87, 0.5);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  p {
    color: #9d9d9d;
    font-weight: 600;
    font-size: 15px;
    line-height: 24px;
  }
`;
const ReviewUser = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
  }
`;
