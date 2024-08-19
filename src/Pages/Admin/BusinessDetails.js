import { useParams } from "react-router-dom";
import AdminLayout from "../../components/Layout/AdminLayout";
import { FileUpload } from "../Business/Register";
import { Button } from "../../components/UI/Buttons";

const BusinessDetails = () => {
	const { id } = useParams();
  
  return (
    <AdminLayout>
      <h1 className="text-2xl text-[#009F57] font-bold mb-3">{id}</h1>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-[10%]">
        <div className="flex flex-col gap-4">
          <h4 className="text-[#0C0C0C] font-semibold text-xl mb-3">Business Details</h4>

          <div>
            <h5 className="text-lg mb-1 font-semibold">Business Name</h5>
            <p className="text-[#9D9D9D] font-medium">{id}</p>
          </div>

          <div>
            <h5 className="text-lg mb-1 font-semibold">Price Range</h5>
            <p className="text-[#9D9D9D] font-medium">#5,000  to #10,000</p>
          </div>

          <div>
            <h5 className="text-lg mb-1 font-semibold">About Business</h5>
            <p className="text-[#9D9D9D] font-medium">We are a sports and rec brand dedicated to helping athletes destress after a workout session or other related activities.</p>
          </div>

          <div>
            <h5 className="text-lg mb-1 font-semibold">Business Category</h5>
            <p className="text-[#9D9D9D] font-medium">Sports and Recreation</p>
          </div>

          <div>
            <h5 className="text-lg mb-1 font-semibold">Business Address</h5>
            <p className="text-[#9D9D9D] font-medium">12, Isale eko street, Marina-Apapa, Lagos, Nigeria</p>
          </div>
        </div>
        <section className="flex flex-col gap-4">
          <h4 className="text-[#0C0C0C] font-semibold text-xl mb-3">Business Documents</h4>

          <div className="flex flex-col gap-3">
            <FileUpload className="my-0 px-4 py-2">
              CAC Registration Proof
              <button className="text-[#9d9d9d] font-medium">View</button>
            </FileUpload>

            <FileUpload className="my-0 px-4 py-2">
              Revenue Receipts with Address
              <button className="text-[#9d9d9d] font-medium">View</button>
            </FileUpload>
            
            <FileUpload className="my-0 px-4 py-2">
              Pictures of Location
              <button className="text-[#9d9d9d] font-medium">View</button>
            </FileUpload>
            
            <FileUpload className="my-0 px-4 py-2">
              Pictures of Location
              <button className="text-[#9d9d9d] font-medium">View</button>
            </FileUpload>
          </div>

        </section>
      </section>
      <div className="flex mt-16 gap-5 justify-end">
        <Button color="#009F57" className="!border-none px-4">
          Approve
        </Button>
        <Button color="#FF3D00" className="!border-none px-4">
          Deny
        </Button>
      </div>
    </AdminLayout>
  )
}

export default BusinessDetails