import Sunvoltage from "../../../assets/logo/sunvoltage.jpg";

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
                <td className="border px-4 py-2">{quoteDetails.date}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-gray-700">
                  Valid Until
                </td>
                <td className="border px-4 py-2">{quoteDetails.validUntil}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-gray-700">
                  Quote #
                </td>
                <td className="border px-4 py-2">{quoteDetails.quoteNumber}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-gray-700">
                  Customer ID
                </td>
                <td className="border px-4 py-2">{quoteDetails.customerId}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Information */}
      <div className="flex justify-between items-start ml-3 mr-4 gap-4">
        {/* Customer Information */}
        <div className="w-64 shadow-md">
          <div className="bg-blue-500 text-black p-2">
            <p className="font-bold">Customer:</p>
          </div>
          <div className="p-3">
            <p className="font-bold text-black">{customerData.name}</p>
            <p className="text-black">{customerData.email}</p>
          </div>
        </div>

        {/* Quote/Project Description */}
        <div className="w-full max-w-lg border bg-white shadow-md">
          <div className="bg-blue-500 text-black p-3">
            <p className="font-bold">Quote/Project Description</p>
          </div>
          <div className="p-4">
            <p>{projectDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
