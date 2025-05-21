import { Box, Typography } from '@mui/material';
import { Input, Select, notification } from 'antd';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/UI/Buttons';
import Loader from '../../components/UI/Loader';
import { CloudUpload } from '../../components/UI/svgs/svgs';
import {
  useCompleteBusinessRegistrationMutation,
  useGetMeQuery,
} from '../../redux/Api/authApi';
import {
  useGetBudgetsQuery,
  useGetCategoriesQuery,
} from '../../redux/Api/locationApi';
import { toTitleCase } from '../../utils';
import {
  useLazyGetCityQuery,
  useLazyGetLgaQuery,
  useGetStatesQuery,
} from '../../redux/Api/geoApi';

const Flex = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1px',
  flexWrap: 'wrap',
});

const { TextArea } = Input;

const Register = () => {
  const { data: categories, isLoading: getCategoriesLoading } =
    useGetCategoriesQuery();
  const { data: budgets } = useGetBudgetsQuery();
  const [subData, setSubData] = useState([]);
  const [loading, setIsLoading] = useState(false);

  // Address endpoints
  const { data: states } = useGetStatesQuery();
  const [getCity, { data: cities }] = useLazyGetCityQuery();
  const [getLga, { data: lgas }] = useLazyGetLgaQuery();

  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessCategory: '',
    businessSubCategory: '',
    businessEmail: '',
    businessAddress: '',
    businessTelephone: '',
    businessAbout: '',
    businessLGA: 'Lagos Mainland',
    businessState: 'Lagos',
    businessCity: 'Lagos',
    businessLocationImages: [],
    businessBudget: '',
  });

  const navigate = useNavigate();
  const userType = useSelector((state) => state.auth.userType);
  const {
    data: businessData,
    isSuccess,
    isLoading,
    refetch,
  } = useGetMeQuery({ userType });

  const [
    completeBusiness,
    {
      isLoading: completeBusinessLoading,
      isSuccess: completeBusinessSuccess,
      error,
      isError,
    },
  ] = useCompleteBusinessRegistrationMutation();

  useEffect(() => {
    if (isSuccess && businessData?.user) {
      setBusinessInfo((prevInfo) => ({
        ...prevInfo,
        ...businessData.user,
        businessBudget: businessData?.user?.budgetClass?.label || '',
        businessAbout: businessData?.user?.description || '',
      }));
      if (businessData.user.businessCategory) {
        setSubData(
          categories?.find(
            (cat) => cat.value === businessData.user.businessCategory
          )?.sub || []
        );
      }
      if (businessData?.user?.businessVerified === 'verified') {
        navigate(`/${userType}`);
      } else {
        notification.warning({
          message: `Business Verification ${toTitleCase(
            businessData?.user?.businessVerified || 'Not Initiated'
          )}`,
          duration: 3,
          placement: 'bottomRight',
        });
      }
    }
  }, [isSuccess, businessData?.user, navigate, refetch, userType, categories]);

  const handleChange = (field, value) => {
    setBusinessInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleLocationImagesFileDrop = (acceptedFiles, field) => {
    setBusinessInfo((prevInfo) => ({
      ...prevInfo,
      [field]: [...businessInfo.businessLocationImages, ...acceptedFiles],
    }));
  };

  useEffect(() => {
    if (isError) {
      if (error.data.error[0].message) {
        notification.error({
          message: error.data.error[0].message,
          duration: 3,
          placement: 'bottomRight',
        });
      } else {
        notification.error({
          message: error.data.error,
          duration: 3,
          placement: 'topRight',
        });
      }
    }
    if (completeBusinessSuccess) {
      notification.success({
        message: 'Business Verification Pending',
        duration: 3,
        placement: 'bottomRight',
      });
      navigate('/business');
    }
  }, [isError, error, completeBusinessSuccess, userType, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    if (businessData?.user?.businessVerified) {
      notification.warning({
        message: 'Business Verification Pending',
        duration: 3,
        placement: 'bottomRight',
      });
      navigate('/business');
      return;
    }

    Object.entries(businessInfo).forEach(([key, value]) => {
      formData.append(key, value);
    });
    businessInfo.businessLocationImages.forEach((file) => {
      formData.append('businessLocationImages', file);
    });
    await completeBusiness(formData);
    setIsLoading(false);
  };

  return (
    <Container>
      {(isLoading ||
        loading ||
        getCategoriesLoading ||
        completeBusinessLoading) && <Loader />}
      <h4>Complete Registration</h4>
      <h6>
        Please Complete Your Registration to gain full access to your Travaye
        Business Page
      </h6>
      <h6>
        Users can't see your business until you Complete Your Registration
      </h6>
      <form onSubmit={handleSubmit}>
        <div className='row mt-3'>
          <div className='col-md-6'>
            <div>
              <label htmlFor='name'>
                Business Name <span>*</span>
              </label>
              <input
                id='name'
                value={businessInfo?.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='category'>
                Business Category <span>*</span>
              </label>
              <select
                value={businessInfo.businessCategory}
                required={true}
                id='category'
                onChange={(e) => {
                  handleChange('businessCategory', e.target.value);
                  setSubData([]);
                  setSubData(
                    categories.find((cat) => cat.value === e.target.value)
                      ?.sub || []
                  );
                }}
              >
                <option value='default' disabled>
                  Select a category
                </option>
                {categories?.map((category, i) => (
                  <option value={category.value} key={i}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor='subCategory'>
                Business Sub Category <span>*</span>
              </label>
              <select
                required={true}
                id='subCategory'
                value={businessInfo.businessSubCategory}
                onChange={(e) =>
                  handleChange('businessSubCategory', e.target.value)
                }
              >
                <option value='' disabled>
                  Select a Sub-category
                </option>
                {subData?.map((category, i) => (
                  <option value={category.value} key={i}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor='email'>
                Business Email <span>*</span>
              </label>
              <input
                id='email'
                type='email'
                value={businessInfo?.businessEmail}
                onChange={(e) => handleChange('businessEmail', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='email'>
                About Business<span>*</span>
              </label>
              <TextArea
                placeholder='Write about your business'
                rows='4'
                name='businessAbout'
                value={businessInfo.businessAbout}
                required
                onChange={(e) => handleChange('businessAbout', e.target.value)}
              />
            </div>
          </div>
          <div className='col-md-6'>
            <div>
              <label htmlFor='address'>
                Business Address <span>*</span>
              </label>
              <input
                id='address'
                value={businessInfo?.businessAddress}
                onChange={(e) =>
                  handleChange('businessAddress', e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor='address'>
                Business State/City/LGA<span>*</span>
              </label>
              <div className='mt-2 mb-[1rem] flex flex-wrap md:flex-row gap-3 md:gap-5'>
                <Select
                  placeholder='State'
                  onSelect={(value) => {
                    getLga({ state: value.toUpperCase() });
                    getCity({ state: value.toUpperCase() });
                    handleChange('businessState', value);
                  }}
                  showSearch
                  className='flex-1'
                  options={states}
                  value={businessInfo?.businessState}
                />
                <Select
                  placeholder='City'
                  showSearch
                  onSelect={(value) => {
                    handleChange('businessCity', value);
                  }}
                  value={businessInfo?.businessCity}
                  className='flex-1'
                  options={cities}
                />
                {/* <Select
                  placeholder='City'
                  defaultValue={businessInfo?.businessCity}
                  className='flex-1'
                /> */}
                {/* <Select
                  placeholder='LGA'
                  className='flex-1'
                  defaultValue={businessInfo?.businessLGA}
                /> */}
                <Select
                  placeholder='LGA'
                  showSearch
                  onSelect={(value) => {
                    handleChange('businessLGA', value);
                  }}
                  className='flex-1'
                  options={lgas}
                />
              </div>
            </div>
            <div>
              <label htmlFor='phone'>
                Business Telephone <span>*</span>
              </label>
              <input
                id='phone'
                type='tel'
                min={11}
                value={businessInfo?.businessTelephone}
                onChange={(e) =>
                  handleChange('businessTelephone', e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor='businessBudget'>
                Price Range <span>*</span>
              </label>
              <Select
                placeholder='Select Your Price Range'
                className='w-full'
                options={budgets?.map((budget) => ({
                  label: budget?.label,
                  value: budget?.label,
                }))}
                onSelect={(value) => handleChange('businessBudget', value)}
                value={businessInfo?.businessBudget}
              />
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-6'>
            <h4>Upload Documents</h4>
            <h6>
              Please ensure to upload clear, concise and correct documents.
            </h6>
            {/* <Dropzone
              acceptedFiles='.jpg,.jpeg,.png'
              multiple={false}
              onDrop={(acceptedFiles) =>
                handleFileDrop(acceptedFiles, 'cacRegistrationProof')
              }
            >
              {({ getRootProps, getInputProps }) => (
                <section {...getRootProps()}>
                  <input {...getInputProps()} />
                  <FileUpload>
                    {businessInfo.cacRegistrationProof.length === 0 ? (
                      `CAC Registration Proof`
                    ) : (
                      <div className='flex gap-3 flex-wrap'>
                        {businessInfo.cacRegistrationProof.map(
                          (file, index) => (
                            <Flex key={index}>
                              <Typography sx={{ marginRight: '1px' }}>
                                {file.name}
                              </Typography>
                            </Flex>
                          )
                        )}
                      </div>
                    )}{' '}
                    <i>{CloudUpload}</i>
                  </FileUpload>
                </section>
              )}
            </Dropzone>
            <Dropzone
              acceptedFiles='.jpg,.jpeg,.png'
              multiple={false}
              onDrop={(acceptedFiles) =>
                handleFileDrop(acceptedFiles, 'proofOfAddress')
              }
            >
              {({ getRootProps, getInputProps }) => (
                <section {...getRootProps()}>
                  <input {...getInputProps()} />
                  <FileUpload>
                    {businessInfo.proofOfAddress.length === 0 ? (
                      ` Proof Of Address (e.g Utility Bill)`
                    ) : (
                      <div className='flex gap-3 flex-wrap'>
                        {businessInfo.proofOfAddress.map((file, index) => (
                          <Flex key={index}>
                            <Typography sx={{ marginRight: '1px' }}>
                              {file.name}
                            </Typography>
                          </Flex>
                        ))}
                      </div>
                    )}
                    <i>{CloudUpload}</i>
                  </FileUpload>
                </section>
              )}
            </Dropzone> */}
            <Dropzone
              acceptedFiles='.jpg,.jpeg,.png'
              multiple={true}
              onDrop={(acceptedFiles) =>
                handleLocationImagesFileDrop(
                  acceptedFiles,
                  'businessLocationImages'
                )
              }
            >
              {({ getRootProps, getInputProps }) => (
                <section {...getRootProps()}>
                  <input {...getInputProps()} />
                  <FileUpload>
                    {businessInfo.businessLocationImages.length === 0 ? (
                      `Pictures of Location`
                    ) : (
                      <div className='flex gap-3 flex-wrap'>
                        {businessInfo.businessLocationImages.map(
                          (file, index) => (
                            <Flex key={index}>
                              <Typography sx={{ marginRight: '1px' }}>
                                {file.name}
                              </Typography>
                            </Flex>
                          )
                        )}
                      </div>
                    )}
                    <i>{CloudUpload}</i>
                  </FileUpload>
                </section>
              )}
            </Dropzone>
          </div>

          {/* <div className="col-md-6">
            <h4>Add Card Information</h4>
            <div>
              <label htmlFor="name">Card Name</label>
              <input
                id="name"
                value={businessInfo?.cardName}
                onChange={(e) => handleChange("cardName", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="name">Card Number</label>
              <input
                id="name"
                value={businessInfo?.cardNumber}
                onChange={(e) => handleChange("cardNumber", e.target.value)}
              />
            </div>
            <div className="flex gap-[1rem] items-center">
              <div>
                <label htmlFor="name">Expiry Date</label>
                <input
                  id="name"
                  value={businessInfo?.expiryDate}
                  onChange={(e) => handleChange("expiryDate", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="name">CVV</label>
                <input
                  id="name"
                  value={businessInfo?.cvv}
                  onChange={(e) => handleChange("cvv", e.target.value)}
                />
              </div>
            </div>
          </div> */}
          <div>
            <Button color='green' type='submit'>
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default Register;

const Container = styled.div`
  padding: 2% 5%;

  span {
    color: #ff3d00;
    font-weight: 600;
    font-size: 18px;
  }
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

  h4 {
    font-weight: 600;
    font-size: 24px;
    color: #009f57;
  }
  button {
    margin-left: auto;
    border-radius: 5px;
  }
`;

export const FileUpload = styled.div`
  display: block;
  width: 100%;
  background: #ffffff;
  text-align: center;
  color: #e9a309;
  border: 2px solid rgba(0, 159, 87, 0.25);
  border-radius: 5px;
  margin-top: 16px;
  margin-bottom: 16px;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: auto;
`;
