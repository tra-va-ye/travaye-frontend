import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./Pages/Home/Home";
import Header from "./components/Layout/Header/Header";
import SideNav from "./components/Layout/SIdeNav";
import Loader from "./components/UI/Loader";

import RequireAuth from "./Layout/RequireAuth";
import CreateEvent from "./Pages/CreateEvent";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import RequireAdmin from "./Pages/Admin/RequireAdmin";
import { setUserType } from "./redux/Slices/authSlice";

const AdminPage = lazy(() => {
  return import("./Pages/Admin");
});

const BusinessDetails = lazy(() => {
  return import("./Pages/Admin/BusinessDetails");
});

const AddedLocations = lazy(() => {
  return import("./Pages/AddedLocations");
});

const BusinessLocations = lazy(() => {
  return import("./Pages/Business/Locations");
});

const Locations = lazy(() => {
  return import("./Pages/Locations");
});

const Register = lazy(() => {
  return import("./Pages/Business/Register");
});
const Contact = lazy(() => {
  return import("./Pages/Contact");
});

const LocationDetails = lazy(() => {
  return import("./Pages/LocationDetails");
});
const Login = lazy(() => {
  return import("./Pages/Login");
});
const ForgotPassword = lazy(() => {
  return import("./Pages/Login/ForgotPassword");
});
const ResetPassword = lazy(() => {
  return import("./Pages/Login/ResetPassword");
});
const PlanTrip = lazy(() => {
  return import("./Pages/Plan-a-trip");
});
const Maps = lazy(() => {
  return import("./Pages/Maps");
});
const SignUp = lazy(() => {
  return import("./Pages/SignUp");
});
const Verification = lazy(() => {
  return import("./Pages/SignUp/Verification");
});
const UserProfile = lazy(() => {
  return import("./Pages/UserProfile");
});
const BusinessProfile = lazy(() => {
  return import("./Pages/BusinessProfile");
});
const BusinessSettings = lazy(() => {
  return import("./Pages/Business/Settings");
});
const UserSettings = lazy(() => {
  return import("./Pages/UserSettings");
});
// const Subscribe = lazy(() => {
//   return import("./Pages/Subscribe/Subscribe");
// });

function App() {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth.userType);
  const [showSideNav, setShowSideNav] = useState(false);

  const toggleSideNav = () => {
    setShowSideNav((prevState) => !prevState);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("userType");
    if (saved && !userType) dispatch(setUserType({userType: saved }));
  }, [dispatch, userType]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:5121899,hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }
  }, [])

  return (
    <>
      <Header onToggleSideNav={toggleSideNav} showSideNav={showSideNav} />
      {showSideNav && <SideNav onToggleSideNav={toggleSideNav} />}
      <section className="iconBg">
        <Suspense fallback={<Loader />}>
          <Routes>
            {userType === "admin" && 
              <Route element={<RequireAdmin />}>
                <Route path="/admin/businesses" element={<AdminPage />} />
                <Route path="/user" element={<Navigate to='/admin/businesses' />} />
                <Route path="/admin/businesses/:id" element={<BusinessDetails />} />
              </Route>
            }
            <Route path="/" element={<Home />} />
            {<Route path="/login" element={<Login />} />}
            {<Route path="/signup" element={<SignUp />} />}
            {<Route path="/forgot-password" element={<ForgotPassword />} />}
            {<Route path="/reset-password" element={<ResetPassword />} />}
            <Route element={<RequireAuth />}>
              <Route path="/register" element={<Register />} />

              {/* Redirect to the appropriate route if user tries to access the wrong route */}
              <Route path="/user" element={userType === "user" ? <UserProfile /> : <Navigate to="/business" />} />
              <Route path="/business" element={userType === "business" ? <BusinessProfile /> : <Navigate to="/user" />} />
              <Route path="/settings" element={userType === "business" ? <BusinessSettings /> : <UserSettings />} />

              {/* {userType && userType === "business" && (
                <Route path="/subscribe" element={<Subscribe />} />
              )} */}
              <Route path="/plan-a-trip" element={<PlanTrip />} />
              <Route path="/verify-email" element={<Verification />} />
              <Route path="/location/:id" element={<LocationDetails />} />
              <Route path="/location/map" element={<Maps />} />
              <Route path="/added-locations" element={<AddedLocations />} />
            </Route>
            <Route path="/business-locations" element={<BusinessLocations />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/verify-email" element={<Verification />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/contact-us" element={<Contact />} />
          </Routes>
        </Suspense>
      </section>
    </>
  );
}

export default App;
