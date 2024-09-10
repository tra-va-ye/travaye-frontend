import styled from "styled-components";
import Avatar from "../../assets/user-avatar.png";
import { IoIosCamera } from "react-icons/io";
import { useState } from "react";
import { useGetMeQuery, useUpdateProfilePhotoMutation } from "../../redux/Api/authApi";
import { TogleButton } from "./BusinessSidebar";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { Spin } from "antd";

const AdminLayout = ({ children }) => {
    const [showDashboard, setShowDashboard] = useState(false);
    const [updateProfile, { isLoading }] = useUpdateProfilePhotoMutation();

    return (
        <Container>
            <TogleButton showDashboard={showDashboard}>
                <BsBoxArrowInLeft size={28} fill="black" onClick={() => setShowDashboard(prev => !prev)} />
            </TogleButton>
            <SideBar showDashboard={showDashboard}>
                <div className="relative">
                    {isLoading && <Spin className="absolute bottom-[50%] left-[50%]" />}
                    <img
                        className="rounded-full w-[150px] h-[150px]"
                        src={Avatar}
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
                <div className="flex flex-col gap-2">
                    <h2 className="text-[#0c0c0c] text-2xl font-bold">Travaye Admin</h2>
                    <h4 className="text-[#E9A309] text-xl font-semibold">@travayesupport</h4>
                    <h6 className="text-[#9d9d9d] text-xl font-semibold">Admin and Support</h6>
                </div>
            </SideBar>
            <Main>
                {children}
            </Main>
        </Container>
    )
}

const Container = styled.div`
  display: flex;
  background-color: #c4c5c72d;
  a {
    text-decoration: none;
  }
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

export const SideBar = styled.aside`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 24%;
    position: relative;
    min-height: calc(100vh - 100px);

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

	@media (max-width: 1150px) {
		max-width: ${(props) => (props.showDashboard ? "auto" : "0")};
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

export default AdminLayout