import { useState } from "react";
import { useNavigate } from "react-router-dom";
import maryland from "../../assets/maryland-mall.png";
import lagos from "../../assets/lagos.png";
import ibadan from "../../assets/ibadan.png";
import abuja from "../../assets/abuja.png";
import { Button } from "../../components/UI/Buttons";
import AdminLayout from "../../components/Layout/AdminLayout";

const businessArray = [
    {
        name: "Papi’s Meatro",
        logo: maryland
    },
    {
        name: "Jelp Factory",
        logo: lagos
    },
    {
        name: "Genesis Cinemas",
        logo: abuja
    },
    {
        name: "Biker’s House",
        logo: ibadan
    },
    {
        name: "Jurasic Arcade",
        logo: maryland
    },
    {
        name: "The Underground Bakery",
        logo: lagos
    }
]

const BusinessBox = ({ businessName, image, handleClick }) => {
    return (
        <article className="px-6 py-2.5 flex justify-between items-center bg-white rounded-md" style={{ boxShadow: "2px 5px 16px 0px #009F571F" }}>
            <div className="flex gap-3.5 items-center">
                <div className="w-10 h-9">
                    <img src={image || maryland} alt="" className="rounded-full object-fill h-full w-full" />
                </div>
                <p className="text-[#0C0C0C] font-semibold">{businessName || "Papi’s Meatro"}</p>
            </div>
            <button onClick={handleClick} className="text-[#009F57] font-semibold">Review</button>
        </article>
    )
};

const AdminPage = () => {
    // const [showDashboard, setShowDashboard] = useState(false);
    const [userData, setuserData] = useState({});
    // const [updateProfile, { isLoading }] = useUpdateProfilePhotoMutation();
    // const userType = useSelector((state) => state.auth.userType);
    const navigate = useNavigate();

    // const {
        // data: adminData
        // isSuccess:,
        // isLoading,
        // refetch,
    // } = useGetMeQuery({ userType });

    // useEffect(() => {
        // console.log(adminData.user);
        // setuserData(adminData.user);
    // }, [userData, navigate, userType]);

    return (
        <AdminLayout>
            <h1 className="text-2xl text-[#009F57] font-bold mb-4">Review Businesses and Adverts</h1>
            <h5 className="text-xl font-semibold text-[#e9a309]">New Business</h5>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-7 mt-2.5">
                {
                    businessArray.map(({name, logo}) => (
                        <BusinessBox businessName={name} image={logo} handleClick={() => navigate(`/admin/businesses/${name}`)} />
                    ))
                }
            </section>

            <h5 className="text-xl font-semibold text-[#e9a309] mt-14">New Adverts</h5>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-7 mt-2.5 mb-5">
                {
                    businessArray.slice(2).map(({name, logo}) => (
                        <BusinessBox businessName={name} image={logo} handleClick={() => navigate(`/admin/businesses/${name}`)} />
                    ))
                }
            </section>
            <div className="flex w-full">
                <Button color="#FF3D00" className="!border-none ml-auto">
                    Cancel Subscription
                </Button>
            </div>
        </AdminLayout>
    )
}

export default AdminPage