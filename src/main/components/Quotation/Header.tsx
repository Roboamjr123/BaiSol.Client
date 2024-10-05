import { useParams } from "react-router-dom";
import Sunvoltage from "../../../assets/logo/sunvoltage.jpg";
import { getProjectInfo } from "../../../lib/API/Project/ProjectApi";

// Define the customer data as an object
const customerData = {
  name: "Mr. Arthur Bagalacsa",
  email: "arthurbagalacsa@gmail.com",
};

// Define the project description
const projectDescription =
  "To provide a 3 kW HYBRID system for a residential home with 1 pc x 48V 100Ah LiFePO4 Battery";

// Define the quote details as an object
const quoteDetails = {
  date: "August 8, 2023",
  validUntil: "August 15, 2023",
  quoteNumber: "40112",
  customerId: "10111",
};

const Header = () => {
  // Fetch `id` from URL params
  const { projId } = useParams<{ projId: string }>();

  const { data: projInfo } = getProjectInfo(projId);

  return (
    <div>
      {/* Title section */}
      <div className="flex flex-col items-end mx-6">
        <h1 className="text-3xl font-bold text-blue-500">Solar Quotation</h1>
      </div>

      {/* Image and Information Box */}
      <div className="flex justify-between items-start ml-3 mr-4 py-3 gap-6">
        <img src={Sunvoltage} alt="Sunvoltage" className="min-w-16 h-48" />
        <div className="bg-gray-100 py-3 text-sm">
          <table>
            <tbody>
              <tr>
                <td className="px-4 py-2 font-semibold text-gray-700">Date</td>
                {/* <td className="border px-4 py-2">{quoteDetails.date}</td> */}
                <td className="border px-4 py-2">
                  {projInfo?.projectDateCreation}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-gray-700">
                  Valid Until
                </td>
                {/* <td className="border px-4 py-2">{quoteDetails.validUntil}</td> */}
                <td className="border px-4 py-2">
                  {projInfo?.projectDateValidity}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-gray-700">
                  Quote #
                </td>
                {/* <td className="border px-4 py-2">{quoteDetails.quoteNumber}</td> */}
                <td className="border px-4 py-2">{projInfo?.projectId}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-gray-700">
                  Customer ID
                </td>
                {/* <td className="border px-4 py-2">{quoteDetails.customerId}</td> */}
                <td className="border px-4 py-2">{projInfo?.customerId}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Information */}
      <div className="flex flex-row max-w-full justify-between ml-3 mr-4 gap-20">
        {/* Customer Information */}
        <div className="w-1/3 shadow-md">
          <div className="bg-blue-500 text-black p-2">
            <p className="font-bold">Customer:</p>
          </div>
          <div className="p-3">
            <p className="font-bold text-black text-base">
              {projInfo?.customerName}
            </p>
            {/* <p className="font-bold text-black text-base">
              {customerData.name}
            </p> */}
            {/* <p className="font-bold text-black text-sm">Address</p> */}
            <p className="text-black text-sm">
              {projInfo?.customerAddress}
            </p>
            <p className="font-semibold text-black text-sm">
              email: {projInfo?.customerEmail}
            </p>
            {/* <p className="font-bold text-black text-sm">
              email: {customerData.email}
            </p> */}
          </div>
        </div>

        {/* Quote/Project Description */}
        <div className="w-2/3 border bg-white shadow-md">
          <div className="bg-blue-500 text-black p-3">
            <p className="font-bold">Quote/Project Description</p>
          </div>
          <div className="p-4">
            {/* <p className="text-sm">{projectDescription}</p> */}
            <p className="text-sm">{projInfo?.projectDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
