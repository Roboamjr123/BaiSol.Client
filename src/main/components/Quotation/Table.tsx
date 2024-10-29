import { Navigate, useParams } from "react-router-dom";
import {
  getProjectExpense,
  getProjectSupply,
  IProjectSupply,
  ProjectQuotationTotalExpense,
} from "../../../lib/API/Project/ProjectApi";
import React from "react";

const AccessibleTable: React.FC<{
  projExpense?: ProjectQuotationTotalExpense;
  materialSupplies?: IProjectSupply[];
}> = ({ projExpense, materialSupplies }) => {

  return (
    <div>
      <div className="flex justify-between py-2 items-start ml-3 mr-4">
        <table className="table-fixed w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="px-4 py-2 border border-gray-300 w-3/4">
                Description
              </th>
              <th className="px-4 py-2 border border-gray-300 text-right">
                Line Total
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Map over the tableData array to generate rows dynamically */}
            {/* {tableData.map((row, index) => (
              <tr key={index} className={`odd:bg-white even:bg-gray-100`}>
                <td className="border border-gray-300 px-4 py-2">
                  {row.description}
                </td>
                <td className="border border-gray-300 text-right px-4 py-2">
                  {row.lineAmount ? `P ${row.lineAmount}` : ""}
                </td>
              </tr>
            ))} */}

            {materialSupplies?.map((row: IProjectSupply, index: number) => (
              <tr key={index} className={`odd:bg-white even:bg-gray-100`}>
                <td className="border border-gray-300 px-4 py-2">
                  {row.description}
                </td>
                <td className="border border-gray-300 text-right px-4 py-2">
                  {row.lineTotal ? `₱ ${row.lineTotal}` : ""}
                </td>
              </tr>
            ))}

            <tr className={"odd:bg-white even:bg-gray-100"}>
              <td className="border border-gray-300 px-4 py-2">&nbsp;</td>
              <td className="border border-gray-300 text-right px-4 py-2"></td>
            </tr>
            <tr className={`odd:bg-white even:bg-gray-100`}>
              <td className="border border-gray-300 px-4 py-2">
                {projExpense?.totalMaterialCost.description}
              </td>
              <td className="border border-gray-300 text-right px-4 py-2">
                {`₱ ${projExpense?.totalMaterialCost.lineTotal}`}
              </td>
            </tr>
            <tr className={`odd:bg-white even:bg-gray-100`}>
              <td className="border border-gray-300 px-4 py-2">
                {projExpense?.totalLaborCost.description}
              </td>
              <td className="border border-gray-300 text-right px-4 py-2">
                {`₱ ${projExpense?.totalLaborCost.lineTotal}`}
              </td>
            </tr>

            {/* Render two empty rows at the top */}
            {[...Array(2)].map((_, i) => (
              <tr
                key={`empty-top-${i}`}
                className={i % 2 === 0 ? "bg-white" : ""}
              >
                <td className="border border-gray-300 px-4 py-2">&nbsp;</td>
                <td className="border border-gray-300 text-right px-4 py-2"></td>
              </tr>
            ))}

            {/* Warranties Section */}
            {[
              { text: "Warranties:", className: "bg-white font-semibold" },
              {
                text: "2 year workmanship warranty",
                className: "font-semibold",
              },
              {
                text: "5 years inverter warranty",
                className: "bg-white font-semibold",
              },
              {
                text: "12 years product warranty for solar panels, 25 years lifespan",
                className: "font-semibold",
              },
            ].map((item, index) => (
              <tr key={index} className={item.className}>
                <td className="border border-gray-300 px-4 py-2">
                  {item.text}
                </td>
                <td className="border border-gray-300 text-right px-4 py-2"></td>
              </tr>
            ))}

            {/* Render two empty rows at the bottom */}
            {[...Array(2)].map((_, i) => (
              <tr
                key={`empty-bottom-${i}`}
                className={i % 2 === 0 ? "bg-white" : ""}
              >
                <td className="border border-gray-300 px-4 py-2">&nbsp;</td>
                <td className="border border-gray-300 text-right px-4 py-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessibleTable;
