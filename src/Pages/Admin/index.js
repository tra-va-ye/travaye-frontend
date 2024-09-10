import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import maryland from "../../assets/maryland-mall.png";
import { Button } from "../../components/UI/Buttons";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  useGetAllBusinessesQuery,
  useGetUnverifiedBusinessesQuery,
} from "../../redux/Api/adminApi";
import Loader from "../../components/UI/Loader";
import { useDispatch } from "react-redux/es";
import { logout } from "../../redux/Slices/authSlice";
import { notification } from "antd";

const BusinessBox = ({ businessName, image, handleClick }) => {
  return (
    <article
      className="px-6 py-2.5 flex justify-between items-center bg-white rounded-md"
      style={{ boxShadow: "2px 5px 16px 0px #009F571F" }}
    >
      <div className="flex gap-3.5 items-center">
        <div className="w-10 h-9">
          <img
            src={image || maryland}
            alt=""
            className="rounded-full object-fill h-full w-full"
          />
        </div>
        <p className="text-[#0C0C0C] font-semibold">
          {businessName || "Papi’s Meatro"}
        </p>
      </div>
      <button onClick={handleClick} className="text-[#009F57] font-semibold">
        Review
      </button>
    </article>
  );
};

const AdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: unverifiedBusinesses,
    isError,
    isFetching,
    error,
  } = useGetUnverifiedBusinessesQuery();

  const {
    data: allBusinesses,
    isError: allError,
    isFetching: allFetching,
    // error
  } = useGetAllBusinessesQuery();

  useEffect(() => {
    if (isFetching) return;
    if (isError) {
      notification.error({
        message: error?.data?.message,
        duration: 3,
        placement: "bottomRight",
      });
    }
  }, [isError, error, isFetching]);

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("authToken");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl text-[#009F57] font-bold mb-4">
        Review Businesses and Adverts
      </h1>
      <h5 className="text-xl font-semibold text-[#e9a309]">Pending Businesses</h5>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-7 mt-2.5">
        {isFetching ? (
          <Loader />
        ) : unverifiedBusinesses?.length ? (
          unverifiedBusinesses?.map(
            ({ businessName, businessLocationImages, _id, profilePhoto }) => (
              <BusinessBox
                key={_id}
                businessName={businessName}
                image={profilePhoto || businessLocationImages[0]}
                handleClick={() => navigate(`/admin/businesses/${_id}`)}
              />
            )
          )
        ) : (
          <p>No Businesses Found</p>
        )}
      </section>

      <h5 className="text-xl font-semibold text-[#e9a309] mt-14">
        All Businesses
      </h5>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-7 mt-2.5 mb-5">
        {allFetching ? (
          <Loader />
        ) : allBusinesses?.length ? (
          allBusinesses?.map(
            ({ businessName, businessLocationImages, _id, profilePhoto }) => (
              <BusinessBox
                key={_id}
                businessName={businessName}
                image={profilePhoto || businessLocationImages[0]}
                handleClick={() => navigate(`/admin/businesses/${_id}`)}
              />
            )
          )
        ) : (
          <p>No Businesses Found</p>
        )}
      </section>
      <div className="flex w-full">
        <Button
          color="#FF3D00"
          className="!border-none ml-auto px-3"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
