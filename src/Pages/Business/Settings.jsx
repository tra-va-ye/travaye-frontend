import { notification, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGetBudgetsQuery, useGetCategoriesQuery } from "../../redux/Api/locationApi";
import { useDeleteMyProfileMutation, useUpdateBusinessProfileMutation } from "../../redux/Api/authApi";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { useGetStatesQuery, useLazyGetCityQuery, useLazyGetLgaQuery } from "../../redux/Api/geoApi";
import Dashboard, { TogleButton } from "../../components/Layout/BusinessSidebar";
import { Button } from "../../components/UI/Buttons";
import { FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { passwordRegex } from "../UserSettings";
import { logout } from "../../redux/Slices/authSlice";

const BusinessSettings = () => {
  const [seePass, setSeePass] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [updateProfile] = useUpdateBusinessProfileMutation();
  const [deleteProfile] = useDeleteMyProfileMutation();

  const { data: states } = useGetStatesQuery();
  const [getCity, { data: city }] = useLazyGetCityQuery();
  const [getLga, { data: lga }] = useLazyGetLgaQuery();
  const { data: budgets } = useGetBudgetsQuery();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessCategory: "default",
    businessAddress: "",
    businessLGA: "",
    businessState: "",
    businessCity: "",
    budgetClass: "",
    description: "",
    businessSubCategory: ""
  });

  const { data: categories } = useGetCategoriesQuery();
  const [subData, setSubData] = useState([]);
  
  const businessData = useSelector((store) => store.auth.user);
  // console.log(businessData);

  useEffect(() => {
    getLga({ state: businessData?.businessState?.toUpperCase() });
    getCity({ state: businessData?.businessState?.toUpperCase() });
  }, [businessInfo?.businessState, businessData?.businessState]);

  useEffect(() => {
    setSubData(categories?.find((cat) => cat.value === businessData?.businessCategory)?.sub);
  }, [businessInfo?.businessCategory, businessData?.businessCategory]);
  
  useEffect(() => {
    if (businessData) {
      // Fetching State and LGA Data from state data
      setSubData(categories?.find((cat) => cat.value === businessData?.businessCategory)?.sub);
      getLga({ state: businessData?.businessState?.toUpperCase() });
      getCity({ state: businessData?.businessState?.toUpperCase() });
      
      setBusinessInfo((prevInfo) => ({ ...prevInfo, ...businessData }));
      // eslint-disable-next-line no-useless-computed-key
      setBusinessInfo((prev) => ({...prev, ["budgetClass"]: businessData?.budgetClass?.label }));

      if (businessData?.businessVerified === "verified") {
        
      } else if (businessData?.businessVerified === "pending") {
        notification.warning({
          message: " Business Verification Pending",
          duration: 3,
          placement: "bottomRight",
        });
        // if (businessData?.addedCard === true) {
        //   navigate(`/${userType}`);
        // } else {
        //   navigate(`/subscribe`);
        // }
        // refetch();
      } else if (businessData?.businessVerified === "denied") {
        notification.error({
          message: " Business not Verified ",
          duration: 3,
          placement: "bottomRight",
        });
        // refetch();

        // Navigate to the verification page
        // navigate("/register");
      }
    }
  }, [businessData, navigate]);

  const handleChange = (field, value) => {
    setBusinessInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (businessInfo?.password) {
      return notification.warning({
        message: "Are you sure you want to change your password?",
        duration: 5,
        type: "warning",
        placement: "bottomRight",
        closeIcon: 
          <Button
            className="!text-sm px-1.5 py-1 !ml-5"
            onClick={async() => {
              if (!passwordRegex.test(businessInfo?.password)) {
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
    const response = await updateProfile(businessInfo);
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
  };

  const handleDeleteRequest = async () => {
    const response = await deleteProfile({ userType:"business", id: businessData?._id });
        
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
    dispatch(logout());
  }

  const deleteUserProfile = () => {
    notification.warning({
      message: "Are you sure you want to Delete Your Profile?",
      duration: 5,
      type: "warning",
      placement: "bottomRight",
      closeIcon: <Button className="!text-sm px-1.5 py-1 !ml-5" onClick={handleDeleteRequest}>Yes</Button>
    });
  }

  return (
    <Container>
      <TogleButton showDashboard={showDashboard}>
        <BsBoxArrowInLeft size={28} fill="black" onClick={() => setShowDashboard(prev => !prev)} />
      </TogleButton>
      <Dashboard showDashboard={showDashboard} businessData={businessData} />
      <Main>
        <div className="w-full flex justify-between items-center mb-4 mt-5 md:mt-0">
          <h3 className="text-2xl text-[#009F57] font-bold">Settings</h3>
          <button className="text-[#E9A309] font-semibold underline" onClick={() => window.history.back()}>Go back{">"}</button>
        </div>
        <h5 className="text-xl text-[#E9A309] font-semibold">*Edit Basic Information</h5>
        <form onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-6">
            <div>
              <label htmlFor="name">
                Business Name
              </label>
              <input
                id="name"
                value={businessInfo?.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category">
                Business Category
              </label>
              <select
                value={businessInfo.businessCategory}
                required={true}
                id="category"
                onChange={(e) => {
                  handleChange("businessCategory", e.target.value);
                  setSubData(categories?.find((cat) => cat.value === e.target.value)?.sub);
                }}
              >
                <option value="default" disabled>
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
              <label htmlFor="category">
                Business SubCategory
              </label>
              <select
                value={businessInfo?.businessSubCategory}
                required={true}
                id="subCategory"
                onChange={(e) => handleChange("businessSubCategory", e.target.value)}
              >
                <option value="default" disabled>
                  Select a Sub-Category
                </option>
                {subData?.map((subCat, i) => (
                  <option value={subCat.value} key={i}>
                    {subCat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="about">
                About Business
              </label>
              <textarea
                id="about"
                value={businessInfo?.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
                placeholder="We are a sports and rec brand dedicated to helping athletes destress after a workout session or other related activities."
              />
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <label htmlFor="address">
                Business Address
              </label>
              <input
                id="address"
                value={businessInfo?.businessAddress}
                onChange={(e) =>
                  handleChange("businessAddress", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="address">
                Business Address
              </label>
              <div className="mt-2 mb-3.5 flex flex-wrap gap-3 md:gap-5">
                <Select
                  placeholder="State"
                  onSelect={(value) => {
                    getLga({ state: value.toUpperCase() });
                    getCity({ state: value.toUpperCase() });
                    handleChange("businessState", value);
                  }}
                  showSearch
                  className="flex-1"
                  options={states}
                  value={businessInfo?.businessState}
                />
                <Select
                  placeholder="City"
                  showSearch
                  onSelect={(value) => {
                    handleChange("businessCity", value);
                  }}
                  // value={queryData.city}
                  className="flex-1"
                  options={city}
                  value={businessInfo?.businessCity}
                  />
                <Select
                  placeholder="LGA"
                  // showSearch
                  onSelect={(value) => {
                    handleChange("businessLGA", value);
                  }}
                  className="flex-1"
                  value={businessInfo?.businessLGA}
                  options={lga}
                />
              </div>
            </div>
            <div>
              <label htmlFor="businessPriceRange">
                Price Range
              </label>
              <div className="mb-4 flex">
                <Select
                  placeholder="Select Your Budget"
                  className="flex-1"
                  options={budgets?.map(b => ({ value: b.label, label: b.label }))}
                  value={businessInfo?.budgetClass}
                  onSelect={(value) => handleChange("budgetClass", value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password"  className="!mb-2">Password</label>
              <div className="relative mb-4">
                <input
                  id="password"
                  placeholder="*********"
                  type={seePass ? "text" : "password"}
                  value={businessInfo?.password}
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
              </div>
            </div>
          </div>
        </div>
      </form>
      <h5 className="text-xl text-[#E9A309] font-semibold py-3.5">*View Insights</h5>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
        <InsightBox>
          <h6>Number of Likes</h6>
          <p>{businessData?.likes?.length || 68}</p>
        </InsightBox>
        <InsightBox>
          <h6>Number of Reviews</h6>
          <p>{businessData?.reviews?.length || 76}</p>
        </InsightBox>
        <InsightBox>
          <h6>Engagement Rate</h6>
          <p>{businessData?.engagementRate}%</p>
        </InsightBox>
        <InsightBox>
          <h6>Conversion Rate</h6>
          <p>{businessData?.conversionRate}%</p>
        </InsightBox>
      </div>
      <div className="flex flex-col items-end gap-3 mt-9">
          <Button color="#009F57" className="!border-none ml-auto" onClick={handleSubmit}>
            Update Profile
          </Button>
          <Button color="#FF3D00" className="!border-none ml-auto" onClick={deleteUserProfile}>
            Delete Profile
          </Button>
      </div>
      </Main>
    </Container>
  );
};

export default BusinessSettings;

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
  select, textarea {
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

  ::-webkit-scrollbar {
    width: 12px;
    /* display: none; */
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

  @media (max-width: 576px) {
    padding: 10px 20px;
  }
`;

export const InsightBox = styled.div`
  padding: 10px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0px 4px 16px 0px #009F571F;

  h6 {
    font-weight: 600;
    line-height: unset;
    color: #0c0c0c;
  }

  p {
    font-weight: 600;
    color: #009F57;
    text-align: end;
  }
`;