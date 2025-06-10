import { Box, LinearProgress, Rating, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AltButton, Button } from '../../components/UI/Buttons';
import Loader from '../../components/UI/Loader';
import { ArrowCloud } from '../../components/UI/svgs/svgs';
import {
  useAddLocationToLikedLocationsMutation,
  useDeleteLocationReviewMutation,
  useGetLocationByIdQuery,
  useReviewLocationMutation,
  useUnlikeLocationMutation,
} from '../../redux/Api/locationApi';
import classes from './LocationDetails.module.css';

import { Image, Input, notification } from 'antd';
import Dropzone from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper';
import { FaTrashAlt } from 'react-icons/fa';
import Avatar from '../../assets/user-avatar.png';
import { useSelector } from 'react-redux';
import { addWaterMarkToImage } from '../../utils';

const { TextArea } = Input;

export function calculateAverageRating(reviewArray) {
  if (reviewArray?.length === 0) return 0; // Handle empty reviewArray
  const sum = reviewArray?.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  return sum / reviewArray?.length;
}

const LocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialValues = {
    reviewDescription: '',
    pictures: [],
    reviewRating: 0,
    reviewerID: sessionStorage.getItem('user_id'),
    locationID: id,
  };

  const [values, setValues] = useState(initialValues);
  const [location, setLocation] = useState({});
  const [imageVisible, setImageVisible] = useState(false);

  const [
    reviewLocation,
    {
      isLoading: reviewLoading,
      isError: reviewIsError,
      isSuccess,
      error: reviewError,
    },
  ] = useReviewLocationMutation();

  const [deleteLocationReview, { isLoading: deleteLoading }] =
    useDeleteLocationReviewMutation();

  const [addLocationToLikedLocations, { isLoading: likeLocationLoading }] =
    useAddLocationToLikedLocationsMutation();
  const [unlike, { isLoading: unliking }] = useUnlikeLocationMutation();
  const userType = sessionStorage.getItem('userType');

  const userData = useSelector((state) => state.auth.user);
  const { data, isError, error, isLoading } = useGetLocationByIdQuery({ id });

  useEffect(() => {
    if (data) {
      setLocation(data);
    }
    if (isError || reviewIsError) {
      notification.error({
        message: error?.error || reviewError?.error,
        duration: 3,
        placement: 'bottomRight',
      });
    }
    if (isSuccess) {
      notification.success({
        message: 'Review submitted successfully',
        duration: 3,
        placement: 'bottomRight',
      });
      setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    error?.error,
    isError,
    reviewError?.error,
    reviewIsError,
    isSuccess,
    setValues,
  ]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    values.pictures.forEach((file) => {
      formData.append('pictures', file);
    });
    if (values.reviewDescription && values.reviewRating)
      await reviewLocation(formData);
    else {
      notification.error({
        message: 'Please complete your review',
        duration: 3,
        placement: 'bottomRight',
      });
    }
  };

  const handleAddClick = () => {
    addLocationToLikedLocations({ locationName: location?.business?._id })
      .unwrap()
      .then((res) => {
        notification.success({
          message: 'Liked',
          duration: 3,
        });
        // refetch();
      })
      .catch((err) => {
        notification.error({
          message: err?.data?.message,
          duration: 3,
        });
      });
  };

  const handleUnlike = () => {
    unlike({ locationName: location?.business?._id })
      .unwrap()
      .then((r) => {
        notification.success({
          message: 'Unliked',
          duration: 3,
        });
        // refetch();
      })
      .catch((err) => {
        notification.error({
          message: err?.data?.message,
          duration: 3,
        });
      });
  };

  const handleDeleteReview = async (reviewID) => {
    deleteLocationReview({ reviewID })
      .then((res) => {
        notification.success({
          message: res?.data?.message,
          duration: 2,
        });
      })
      .catch((err) => {
        notification.error({
          message: err?.data?.message,
          duration: 2,
        });
      });
  };

  return (
    <div className={classes.location}>
      {isLoading || reviewLoading ? (
        <Loader />
      ) : (
        <>
          <div className='hidden'>
            {!isError && location?.business && (
              <Image.PreviewGroup
                items={[
                  ...location?.business?.businessLocationImages?.map((loc) =>
                    addWaterMarkToImage(loc)
                  ),
                ]}
                preview={{
                  visible: imageVisible,
                  zIndex: 1000,
                  onVisibleChange: (value) => setImageVisible(value),
                }}
              >
                <Image width={400} />
              </Image.PreviewGroup>
            )}
          </div>
          <div className='flex lg:flex-row flex-col justify-center gap-4'>
            <div className='w-full lg:w-7/12 flex flex-col gap-1'>
              <button
                className='border-2 border-[#009f57] text-[#009f57] py-1 px-3 rounded-md mx-auto'
                onClick={() => setImageVisible(true)}
              >
                View Gallery
              </button>
              <Swiper
                className='!scale-100'
                slidesPerView={1}
                modules={[Navigation]}
                spaceBetween={20}
                loop={true}
                navigation
              >
                {location?.business?.businessLocationImages?.map((imag, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={addWaterMarkToImage(imag)}
                      className='h-[25rem] rounded-lg border border-red-500 w-5/6'
                      alt={`Poster ${i + 1}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <p className='text-center text-[#9D9D9D] font-semibold text-lg italic'>
                Please scroll/swipe to see additional images
              </p>
            </div>
            <div className='w-full lg:w-5/12'>
              <h4>{location?.business?.businessName}</h4>
              <h6>{location?.business?.businessAddress}</h6>
              <p className='my-7 text-black text-justify'>
                {location?.business?.description || 'No description yet'}
              </p>
              <h5 className='text-xl text-[#009f57] font-semibold mb-2'>
                Price Range:{'  '}
                <span className='text-black font-normal'>
                  {location?.business?.budgetClass?.label || 'Nothing yet'}
                </span>
              </h5>
              <h5 className='text-xl text-[#009f57] font-semibold mb-2'>
                Email:{'  '}
                <span className='text-black font-normal'>
                  {location?.business?.businessEmail}
                </span>
              </h5>
              <h5 className='text-xl text-[#009f57] font-semibold mb-2'>
                Phone:{'  '}
                <span className='text-black font-normal'>
                  +234{location?.business?.businessTelephone}
                </span>
              </h5>
              <h5 className='text-xl text-[#009f57] font-semibold mb-5'>
                Category:{'  '}
                <span className='text-black font-normal'>
                  {location?.business?.businessCategory
                    .replace('%26', '&')
                    ?.split('-')
                    ?.map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(' ')}
                </span>
              </h5>

              <div className='d-flex mb-3'>
                {userType === 'user' && (
                  <>
                    {userData?.likedLocations?.find(
                      (l) => l?.business?._id === location?.business?._id
                    ) ? (
                      <Button
                        color={unliking ? '#f14f4f' : 'red'}
                        location={true}
                        onClick={handleUnlike}
                        className='!border-none'
                        disabled={unliking}
                        border='none'
                      >
                        {unliking ? 'Loading...' : 'Unlike'}
                      </Button>
                    ) : (
                      <Button
                        color={
                          likeLocationLoading ? 'rgba(0,159,87,0.5)' : 'green'
                        }
                        location={true}
                        className='!border-none'
                        onClick={handleAddClick}
                        disabled={likeLocationLoading}
                      >
                        {likeLocationLoading ? 'Loading...' : 'Like location'}
                      </Button>
                    )}
                  </>
                )}
                <Button
                  onClick={() =>
                    navigate(
                      `/location/map?address=${location?.business?.businessAddress}&name=${location?.business?.businessName}`
                    )
                  }
                  location={true}
                >
                  View on Google Maps
                </Button>
              </div>
            </div>
          </div>
          <div
            className={`${classes.reviewContainer} grid grid-cols-12 gap-4 py-4`}
          >
            {userType === 'user' && (
              <form
                className='col-span-12 lg:col-span-6'
                onSubmit={handleFormSubmit}
              >
                <div className='flex flex-col gap-3 bg-white py-2 px-4 rounded-xl border-brandGreen border-[1px]'>
                  <Dropzone
                    acceptedFiles='.jpg,.jpeg,.png'
                    multiple={true}
                    onDrop={(acceptedFiles) => {
                      // seValue("pictures", [...values.pictures, ...acceptedFiles]);
                      setValues((prev) => ({
                        ...prev,
                        pictures: [...values.pictures, ...acceptedFiles],
                      }));
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Container>
                        <section {...getRootProps()}>
                          <input {...getInputProps()} />
                          {values.pictures.length === 0 ? (
                            <div className='!flex-row !mb-0 !gap-4 !mt-0'>
                              <i className='scale-90'>{ArrowCloud}</i>
                              <p>Drag and Drop Pictures here to Upload</p>
                            </div>
                          ) : (
                            values.pictures.map((file, index) => (
                              <FlexBetween key={index}>
                                <Typography sx={{ marginRight: '5px' }}>
                                  {file.name}
                                </Typography>
                              </FlexBetween>
                            ))
                          )}
                        </section>
                      </Container>
                    )}
                  </Dropzone>
                  <div className='flex justify-between items-center'>
                    <Typography className='text-black font-black'>
                      Experience Rating
                    </Typography>
                    <Rating
                      size='large'
                      precision={0.5}
                      value={values.locationRating}
                      onChange={(event, newValue) => {
                        setValues((prev) => ({
                          ...prev,
                          reviewRating: newValue,
                        }));
                      }}
                    />
                  </div>
                  <TextArea
                    rows='6'
                    required
                    name='reviewDescription'
                    className='mt-2'
                    placeholder='Share your experience here....'
                    onChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                  ></TextArea>
                  <AltButton location={true} className='mb-4'>
                    Post Review
                  </AltButton>
                </div>
              </form>
            )}
            <section
              className={`${
                userType !== 'user'
                  ? 'col-span-12'
                  : 'col-span-12 lg:col-span-6'
              } overflow-y-hidden h-[27.5rem] lg:h-[26.5rem] flex flex-col py-1`}
            >
              <div className='flex justify-content-between mb-2 items-center'>
                <ReviewH4 className='text-2xl font-bold'>Reviews</ReviewH4>
                <div className='flex gap-2 lg:gap-4 flex-col lg:flex-row'>
                  <p className='text-black font-medium'>Average Rating</p>
                  {location?.business?.rating && (
                    <Rating
                      defaultValue={location?.business?.rating}
                      readOnly
                      precision={0.5}
                    />
                  )}
                </div>
              </div>
              <Review className={`flex gap-3 flex-col overflow-y-scroll my-1`}>
                {location && location?.business?.reviews?.length > 0 ? (
                  location?.business?.reviews?.slice(0, 8).map((review, i) => {
                    if (!review.reviewerID) return <></>;
                    return (
                      <ReviewCard key={i}>
                        <div className='flex items-center justify-between md:flex-row flex-col gap-2'>
                          <ReviewUser>
                            <img
                              src={review?.reviewerID?.profilePhoto || Avatar}
                              className='img-fluid rounded-full'
                              alt='pfp'
                            />
                            <p
                              className=''
                              style={{ color: '#009f57', fontSize: 20 }}
                            >
                              {review?.reviewerID?.fullName}
                            </p>
                          </ReviewUser>
                          <div className='flex gap-5 items-center'>
                            <Rating value={review.reviewRating} readOnly />
                            {userData?._id === review?.reviewerID?._id && (
                              <FaTrashAlt
                                size={28}
                                className='cursor-pointer'
                                onClick={() => handleDeleteReview(review?._id)}
                              />
                            )}
                          </div>
                        </div>
                        <p className='py-2'>{`${review?.reviewDescription}`}</p>
                        <div>
                          <div className='flex gap-3 rounded-lg overflow-hidden mt-1 flex-container'>
                            <Image.PreviewGroup
                              preview={{
                                onChange: (current, prev) => {},
                              }}
                            >
                              {review?.reviewImagePaths?.map((image, key) => {
                                return (
                                  <Image
                                    key={key}
                                    src={image}
                                    height={100}
                                    className=' object-cover rounded-lg'
                                  />
                                );
                              })}
                            </Image.PreviewGroup>
                          </div>
                        </div>
                        {deleteLoading &&
                          userData.user._id === review?.reviewerID._id && (
                            <LinearProgress color='primary' className='mt-2' />
                          )}
                      </ReviewCard>
                    );
                  })
                ) : (
                  <p>No reviews yet</p>
                )}
              </Review>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationDetails;
const FlexBetween = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Container = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  background: #fff;
  box-shadow: 4px 4px 32px 2px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  /* height: 20vh; */
  padding: 15px;
  margin-top: 3%;
  p {
    text-align: center;
  }

  section {
    width: 100%;
    border: 3px solid #d9d9d9;
    border-radius: 8px;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 3%;
    }
  }
`;

const ReviewH4 = styled.h4`
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
