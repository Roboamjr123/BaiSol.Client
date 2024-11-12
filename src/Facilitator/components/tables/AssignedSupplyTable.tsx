import React from "react";
import { assigned_supply_columns } from "../../../lib/utils/Facilitator/AssignedSupplyTable";
import { Spinner } from "@nextui-org/react";
import {
  getAssignedEquipmentByFacilitator,
  getAssignedMaterialsByFacilitator,
} from "../../../lib/API/Facilitator/RequestAPI";

interface ISupply {
  isMaterial?: boolean;
  isDemobilization?: boolean;
}

const SupplyRows = ({ supplyData, itemNo }: any) => {
  let itemCount = itemNo;

  return supplyData?.length ? (
    supplyData.map((supply: any) =>
      supply.details?.map((item: any, index: number) => {
        const currentItemNo = itemCount++;
        const totalDetails = supply.details?.length;
        const category = supply.mtlCategory || supply.eqptCategory;
        const description = item.mtlDescription || item.eqptDescript;
        const quantity = item.mtlQuantity ?? item.quantity ?? "N/A";
        const unit = item.mtlUnit || item.eqptUnit;

        return (
          <tr
            key={item.suppId}
            className="border-b text-sm hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap"
          >
            <td className="text-center px-4 py-3">{currentItemNo}</td>
            <td className="text-center px-4 py-3">{description}</td>
            <td className="text-center px-4 py-3">{quantity}</td>
            <td className="text-center px-4 py-3">{unit}</td>
            {index === 0 && (
              <td
                rowSpan={totalDetails}
                className="text-center border-b border-gray-400 bg-gray-200 px-4 py-1 font-medium text-gray-900 whitespace-nowrap h-full"
              >
                <span className="text-lg font-bold">{category}</span>
              </td>
            )}
          </tr>
        );
      })
    )
  ) : (
    <tr>
      <td className="text-center py-4 text-gray-500">No supply available</td>
    </tr>
  );
};

const AssignedSupplyTable: React.FC<ISupply> = ({
  isMaterial,
  isDemobilization,
}) => {
  const { data: assignedMaterials, isLoading } =
    getAssignedMaterialsByFacilitator();
  const { data: assignedEquipment } = getAssignedEquipmentByFacilitator();
  const supplyData = isMaterial ? assignedMaterials : assignedEquipment;
  let itemNo = 1;

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className="flex flex-row gap-10">
            <div className="w-full">
              <div className="flex w-full mb-4 justify-between items-end">
                <span className="tracking-wider font-semibold">
                  {isMaterial ? "Material Supply" : "Equipment Supply"}
                </span>
              </div>
              <table className="w-full rounded-lg text-left text-gray-700">
                <thead className="text-sm text-gray-700 bg-gray-50">
                  <tr className="border-b border-gray-400">
                    {assigned_supply_columns.map((item) => (
                      <th scope="col" className="text-center px-4 py-3">
                        {item.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center">
                        <div className="flex justify-center items-center h-64">
                          <Spinner color="warning" />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <SupplyRows supplyData={supplyData} itemNo={itemNo} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedSupplyTable;
