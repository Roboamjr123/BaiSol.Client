// Data for the table stored as an array of objects
const tableData = [
  {
    description:
      "Solar PV Panels - 6 pcs x 500 W Solar Mono panel = 3,000 W or 3.0kW capacity",
    lineAmount: "279,000.00",
  },
  {
    description:
      "PV Mountings Set for 3.0 kW panels (Railings, End Clamp, Middle Clamp & L-Foot, etc.)",
    lineAmount: "0.00", // Assuming this is a placeholder
  },
  {
    description:
      "Solar Power Inverter: 1 unit x 3.6 kW DEYE HYBRID On/Off-grid Inverter",
    lineAmount: "0.00", // Assuming this is a placeholder
  },
  {
    description: "Solar Battery: 1 unit x 48V 100Ah LiFePo4 Battery",
    lineAmount: "0.00", // Assuming this is a placeholder
  },
  {
    description: "Total Material Cost including Testing and Commissioning",
    lineAmount: "279,000.00",
  },
  {
    description: "Total Labor and Installation Cost",
    lineAmount: "42,480.00",
  },
  {
    description: "Warranties:",
    lineAmount: "",
  },
];

const AccessibleTable = () => {
  return (
    <div>
      <div className="flex justify-between items-start ml-3 mr-4">
        <table className="table-fixed w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="px-4 py-2 border border-gray-300">Description</th>
              <th className="px-4 py-2 border border-gray-300 text-right">
                Line Total
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Map over the tableData array to generate rows dynamically */}
            {tableData.map((row, index) => (
              <tr key={index} className={`odd:bg-white even:bg-gray-100`}>
                <td className="border border-gray-300 px-4 py-2">
                  {row.description}
                </td>
                <td className="border border-gray-300 text-right px-4 py-2">
                  {row.lineAmount ? `P ${row.lineAmount}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessibleTable;
