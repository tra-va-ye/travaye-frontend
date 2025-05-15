import { Image, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '../../assets/user-avatar.png';
import LocationModal from '../../components/UI/Modal/LocationModal';
import NewLocation from '../../components/UI/Modal/NewLocation';
import { useGetLocationsQuery } from '../../redux/Api/locationApi';
import { BsBoxArrowInLeft } from 'react-icons/bs';
import { TogleButton } from '../../components/Layout/BusinessSidebar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper';
import ChatIcon from '../../assets/Icons/ChatIcon';
import { Rating } from '@mui/material';
// import { calculateAverageRating } from '../LocationDetails';
import BusinessSupportModal from '../../components/UI/Modal/BusinessSupportModal';
import Sidebar from '../../components/Layout/BusinessSidebar';
import { addWaterMarkToImage } from '../../utils';

const BusinessProfile = () => {
  // const [updateProfile, { isLoading }] = useUpdateProfilePhotoMutation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newLocationModal, setNewLocationModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const userType = useSelector((state) => state.auth.userType);
  const navigate = useNavigate();
  const toggleShowLocationModal = () => {
    setShowLocationModal((prevState) => !prevState);
  };

  const [locations, setLocations] = useState([]);
  const { data, isError, error, isSuccess } = useGetLocationsQuery({
    page: 1,
    count: 10,
  });
  const businessData = useSelector((store) => store.auth.user);

  useEffect(() => {
    if (isSuccess) {
      setLocations(data?.data);
    }
    if (isError) {
      notification.error({
        message: error?.error,
        duration: 3,
        placement: 'bottomRight',
      });
    }
  }, [data, error, isError, isSuccess, locations]);

  useEffect(() => {
    if (businessData) {
      if (businessData?.businessVerified === 'pending') {
        notification.warning({
          message: ' Business Verification Pending',
          duration: 3,
          placement: 'bottomRight',
        });
      } else if (!businessData?.businessVerified) {
        notification.error({
          message: ' Business not Verified ',
          duration: 3,
          placement: 'bottomRight',
        });
        navigate('/register');
      }
    }
  }, [businessData, navigate, userType, businessData?.user]);

  return (
    <Container>
      <TogleButton showDashboard={showDashboard}>
        <BsBoxArrowInLeft
          size={28}
          fill='black'
          onClick={() => setShowDashboard((prev) => !prev)}
        />
      </TogleButton>
      <Sidebar showDashboard={showDashboard} businessData={businessData} />
      <Main>
        <button
          className='fixed right-9 bottom-8 shadow-md rounded-full'
          onClick={() => setShowSupportModal(true)}
        >
          <ChatIcon />
        </button>
        <div className='mt-5 lg:mt-0'>
          <div className='flex items-center justify-between'>
            <H3
              color='#009f57'
              fontWeight='700'
              className='mb-1 text-xl md:text-3xl'
            >
              Your Profile
            </H3>
            <button
              className='text-[#E9A309] font-semibold underline !scale-100'
              onClick={() => navigate('/settings')}
            >
              Settings{'>'}
            </button>
          </div>
          <div className='flex gap-3 md:flex-row flex-col'>
            <Swiper
              className='!scale-100 w-full mx-auto'
              slidesPerView={1}
              modules={[Navigation]}
              spaceBetween={20}
              loop={true}
              navigation
            >
              {businessData?.businessLocationImages.length === 0 && (
                <h2 className='text-xl font-semibold'>No Images Found</h2>
              )}
              {businessData?.businessLocationImages?.map((imag, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={addWaterMarkToImage(imag)}
                    className='h-[20rem] w-full rounded-lg border border-red-500'
                    alt={`Poster ${i + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className='flex-1'>
              <ReviewH4 className='text-2xl font-bold pt-2'>
                Contact Info
              </ReviewH4>
              <h4 className='font-semibold mt-2 text-nowrap'>
                Email: {businessData?.businessEmail}
              </h4>
              <h4 className='font-semibold mt-2'>
                Phone:{' '}
                {businessData?.businessTelephone &&
                  `+234${businessData?.businessTelephone}`}
              </h4>
            </div>
          </div>

          <section className='grid grid-cols-7 gap-4 mt-6'>
            {' '}
            <div className='col-span-7 md:col-span-3 md:hidden block'>
              <ReviewH4 className='text-3xl font-bold pt-2'>
                Contact Info
              </ReviewH4>
              <h4 className='font-semibold mt-2'>
                Email: {businessData?.businessEmail}
              </h4>
              <h4 className='font-semibold mt-2'>
                Phone:{' '}
                {businessData?.businessTelephone &&
                  `+234${businessData?.businessTelephone}`}
              </h4>
            </div>
            <section className='col-span-7 md:col-span-5 flex flex-col overflow-y-hidden h-[27rem] lg:h-[26rem]'>
              <div className='flex justify-content-between mb-3 items-center'>
                <ReviewH4 className='text-2xl font-bold'>Reviews</ReviewH4>
                <div className='flex gap-2 md:gap-4 flex-col md:flex-row'>
                  <p className='text-black font-medium'>Average Rating</p>{' '}
                  <Rating
                    value={businessData?.rating}
                    readOnly
                    precision={0.5}
                  />
                </div>
              </div>
              <Review className={`flex gap-3 flex-col my-1 !overflow-y-scroll`}>
                {businessData && businessData?.reviews?.length > 0 ? (
                  businessData?.reviews?.map((review, i) => {
                    return (
                      <ReviewCard key={i}>
                        <div className='flex items-center justify-between'>
                          <ReviewUser>
                            <img
                              src={Avatar}
                              className='img-fluid '
                              alt='pfp'
                            />
                            <p
                              className=''
                              style={{ color: '#009f57', fontSize: 20 }}
                            >
                              {review?.reviewerFullname}
                            </p>
                          </ReviewUser>
                          <Rating value={review.reviewRating} readOnly />
                        </div>

                        <p className='py-2'>{review?.reviewDescription}</p>
                        <div>
                          <div className='flex gap-3 rounded-lg overflow-hidden mt-1 flex-container'>
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
                                  <Image
                                    key={key}
                                    src={image}
                                    height={100}
                                    className=' object-cover  rounded-lg'
                                  />
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
            </section>
          </section>
        </div>
        <BoxContainer>
          {showLocationModal && (
            <LocationModal onClick={toggleShowLocationModal} />
          )}
          {showSupportModal && (
            <BusinessSupportModal
              onClick={() => setShowSupportModal((prev) => !prev)}
            />
          )}
          <NewLocation open={newLocationModal} setOpen={setNewLocationModal} />
        </BoxContainer>
      </Main>
    </Container>
  );
};

export default BusinessProfile;

const BoxContainer = styled.div`
  @media (max-width: 532px) {
    display: grid;
    place-items: center;
  }
`;

const Container = styled.div`
  display: flex;
  background-color: #c4c5c72d;

  /* height: calc(100vh - 95px); */
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
  position: relative;

  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgb(255, 254, 252);
  border-top: 0;
  border-right: 2px solid transparent;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16);
  padding-block: 30px;
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
    padding-inline: 16px;
    margin-top: 6px;
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

export const ReviewH4 = styled.h4`
  color: #009f57;
`;
const Review = styled.div`
  display: flex;
  overflow-y: auto;
  padding-inline: 8px;

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

const ReviewCard = styled.article`
  background: #ffffff;
  border: 2px solid rgba(0, 159, 87, 0.5);
  border-radius: 10px;
  padding: 16px;
  flex: 1;
  position: relative;

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
