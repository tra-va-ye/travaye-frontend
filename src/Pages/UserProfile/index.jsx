import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../components/UI/Buttons";
import LocationBox from "../../components/UI/Location/LocationBox";
import { useGetLocationsQuery } from "../../redux/Api/locationApi";
import { notification } from "antd";
// import NewLocation from "../../components/UI/Modal/NewLocation";
import ChatIcon from "../../assets/Icons/ChatIcon";
import { Main } from "../BusinessProfile";
import ScanIcon from "../../assets/Icons/ScanIcon";
import SupportModal from "../../components/UI/Modal/UserSupportModal";
import { TogleButton } from "../../components/Layout/BusinessSidebar";
import { BsBoxArrowInLeft } from "react-icons/bs";
import UserSidebar from "../../components/Layout/UserSidebar";
import { Html5Qrcode } from "html5-qrcode";

const UserProfile = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const userData = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const location = useLocation();
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

  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    setUserInfo(userData);
  }, [userData]);

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
  }, [data, error?.error, isError, isSuccess, locations]);

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

  const logUserVisit = async (url) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
      }
    });
    const data = await res.json();
    if (res.status === 201) {
      notification.success({
        message: data.message,
        duration: 5,
        placement: "bottom",
      });
    } else {
      notification.error({
        message: data.message,
        duration: 5,
        placement: "bottom",
      });
    }
  };

  let html5QrCode;

  const startScanningProccess = () => {
    if (html5QrCode !== undefined) {
      const state = html5QrCode.getState();
      if (state === 2) {
        return html5QrCode.stop();
      }
    }

    html5QrCode = new Html5Qrcode("reader");
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        let cameraId = devices[0].id;
        if (window.innerWidth < 800) cameraId = devices[1].id;

        html5QrCode.start(
          cameraId,
          {
            fps: 14,   // Optional, frame per seconds for qr code scanning
            qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
          },
          (decodedText) => {
            logUserVisit(decodedText);
            html5QrCode.stop();
          })
      }
    })
    .catch(err => console.error(err));
  }

  return (
    <Container>
      <TogleButton showDashboard={showDashboard}>
        <BsBoxArrowInLeft size={28} fill="black" onClick={() => setShowDashboard(prev => !prev)} />
      </TogleButton>
      <UserSidebar showDashboard={showDashboard} userInfo={userInfo} />
      <Main>
        <button className="fixed right-7 bottom-6 shadow-md rounded-full z-50 !scale-90" onClick={() => setShowSupportModal(true)}>
          <ChatIcon />
        </button>
        <button
          className="fixed right-7 bottom-28 shadow-md rounded-full z-50 !scale-90 bg-[#FDEECE] p-2.5"
          onClick={() => startScanningProccess()}
          onBlur={() => (html5QrCode!== undefined) && html5QrCode.stop()}
        >
          <ScanIcon />
        </button>
        <div id="reader" width="560px" />
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
        </div>
        <BoxContainer>
          {showSupportModal && (
            <SupportModal username={userInfo?.username} onClick={() => setShowSupportModal((prev) => !prev)} />
          )}
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