import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/Layout/AdminLayout";
import { FileUpload } from "../Business/Register";
import { Button } from "../../components/UI/Buttons";
import { useEffect, useState } from "react";
import { useGetBusinessByIdQuery, useVerifyBusinessMutation } from "../../redux/Api/adminApi";
import { Image, notification } from "antd";
import Loader from "../../components/UI/Loader";

const BusinessDetails = () => {
	const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching, isError, error } = useGetBusinessByIdQuery({ id });
  const [cacVisible, setCACVisible] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [verifyBusiness, { isLoading, isError: isVerifyError, data: verifiedData, error: verifyError }] = useVerifyBusinessMutation();
  
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

  const handleVerify = async (isAccept) => {
    await verifyBusiness({ isVerified: isAccept, id });
  }
  
  useEffect(() => {
    if (isLoading || isFetching) return;
    if (!verifiedData && !verifyError) return;
    if (isVerifyError) {
      // console.log(verifyError);
      notification.error({
        message: verifyError?.data?.message,
        duration: 3,
        placement: "bottomRight",
      });
    } else {
      // console.log(verifiedData);
      notification.success({
        message: verifiedData?.message,
        duration: 3,
        placement: "bottomRight",
      });
      setTimeout(() => {
        navigate("/admin/businesses");
      }, 500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleVerify]);
  
  return (
    <AdminLayout>
      {
          (isFetching || isLoading) ? <Loader  />
          : (
            <>
              <div className="flex justify-between mb-3">
                <h1 className="text-2xl text-[#009F57] font-bold">{data?.businessName}</h1>
                <button
                    className="text-[#E9A309] font-semibold underline"
                    onClick={() => window.history.back()}
                  >
                    Back{" >"}
                  </button>
              </div>
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="flex flex-col gap-4">
                  <h4 className="text-[#0C0C0C] font-semibold text-xl mb-3">Business Details</h4>

                  <div>
                    <h5 className="text-lg mb-1 font-semibold">Business Name</h5>
                    <p className="text-[#9D9D9D] font-medium">{data?.businessName}</p>
                  </div>

                  <div>
                    <h5 className="text-lg mb-1 font-semibold">Price Range</h5>
                    <p className="text-[#9D9D9D] font-medium">{data?.budgetClass?.label}</p>
                  </div>

                  <div>
                    <h5 className="text-lg mb-1 font-semibold">About Business</h5>
                    <p className="text-[#9D9D9D] font-medium">{data?.description || "No Bio yet..."}</p>
                  </div>

                  <div>
                    <h5 className="text-lg mb-1 font-semibold">Business Category</h5>
                    <p className="text-[#9D9D9D] font-medium">{data?.businessCategory?.replace('%26', '&')?.split("-")?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</p>
                  </div>

                  <div>
                    <h5 className="text-lg mb-1 font-semibold">Business Sub Category</h5>
                    <p className="text-[#9D9D9D] font-medium">{data?.businessSubCategory?.split("-")?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</p>
                  </div>

                  <div>
                    <h5 className="text-lg mb-1 font-semibold">Business Address</h5>
                    <p className="text-[#9D9D9D] font-medium">{data?.businessAddress}</p>
                  </div>

                  <div>
                    <h5 className="text-lg mb-1 font-semibold">Business Email</h5>
                    <p className="text-[#9D9D9D] font-medium">{data?.businessEmail}</p>
                  </div>

                  <div>
                    <h5 className="text-lg mb-1 font-semibold">Business Telephone</h5>
                    <p className="text-[#9D9D9D] font-medium">+234{data?.businessTelephone}</p>
                  </div>
                </div>
                <section className="flex flex-col gap-4">
                  <h4 className="text-[#0C0C0C] font-semibold text-xl mb-3">Business Documents</h4>

                  <div className="flex flex-col gap-4">
                    <FileUpload className="my-0 px-4 py-2">
                      CAC Registration Proof
                      <button className="text-[rgb(157,157,157)] font-medium" onClick={() => setCACVisible(true)}>View</button>
                      <div className="hidden">
                        {
                          !isError && (
                            <Image.PreviewGroup items={[...data?.businessCacProofImageURL]} preview={{
                              visible: cacVisible,
                              zIndex: 1000,
                              onVisibleChange: (value) => setCACVisible(value),
                            }}>
                              <Image
                                width={200}
                                src={data?.businessCacProofImageURL[0]}
                              />
                            </Image.PreviewGroup>
                          )
                        }
                      </div>
                    </FileUpload>

                    <FileUpload className="my-0 px-4 py-2">
                      Proof of Address
                      <button className="text-[#9d9d9d] font-medium" onClick={() => setAddressVisible(true)}>View</button>
                      <div className="hidden">
                        {
                          !isError && (
                            <Image.PreviewGroup items={[...data?.businessProofAddressImageURL]} preview={{
                              visible: addressVisible,
                              zIndex: 1000,
                              onVisibleChange: (value) => setAddressVisible(value),
                            }}>
                              <Image
                                width={200}
                                src={data?.businessProofAddressImageURL[0]}
                              />
                            </Image.PreviewGroup>
                          )
                        }
                      </div>
                    </FileUpload>

                    <FileUpload className="my-0 px-4 py-2">
                      Pictures of Location
                      <button className="text-[#9d9d9d] font-medium" onClick={() => setImageVisible(true)}>View</button>
                      <div className="hidden">
                        {
                          !isError && (
                            <Image.PreviewGroup items={[...data?.businessLocationImages]} preview={{
                              visible: imageVisible,
                              zIndex: 1000,
                              onVisibleChange: (value) => setImageVisible(value),
                            }}>
                              <Image
                                width={200}
                                src={data?.businessLocationImages[0]}
                              />
                            </Image.PreviewGroup>
                          )
                        }
                      </div>
                    </FileUpload>
                  </div>

                </section>
                <div className="flex mt-6 gap-4 justify-end md:hidden">
                  {
                    data?.businessVerified === "pending" && 
                      <Button color="#009F57" className="!border-none px-4" onClick={() => handleVerify(true)}>
                        Approve
                      </Button>
                  }
                  <Button color="#FF3D00" className="!border-none px-4" onClick={() => handleVerify(false)}>
                    Deny
                  </Button>
                </div>
              </section>
              <div className="md:flex hidden mt-10 gap-4 justify-end">
                {
                  data?.businessVerified === "pending" && 
                    <Button color="#009F57" className="!border-none px-4" onClick={() => handleVerify(true)}>
                      Approve
                    </Button>
                }
                <Button color="#FF3D00" className="!border-none px-4" onClick={() => handleVerify(false)}>
                  Deny
                </Button>
              </div>
            </>
          )
      }
    </AdminLayout>
  )
}

export default BusinessDetails