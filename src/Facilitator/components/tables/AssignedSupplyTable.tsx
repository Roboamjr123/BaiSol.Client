import React, { useState, useCallback } from "react";
import { assigned_supply_columns } from "../../../lib/utils/Facilitator/AssignedSupplyTable";
import { Button, Input } from "@nextui-org/react";
import {
  getAssignedEquipmentByFacilitator,
  getAssignedMaterialsByFacilitator,
} from "../../../lib/API/Facilitator/RequestAPI";
import { useReturnAssignedEquipment } from "../../../lib/API/Facilitator/AssignedAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../../main/components/Loader";

const SupplyRows = ({
  supplyData,
  itemNo,
  isDemobilization,
  onInputChange,
  invalidQuantities,
}: any) => {
  return supplyData?.length ? (
    supplyData.map((supply: any) =>
      supply.details?.map((item: any, index: number) => {
        const currentItemNo = itemNo++;
        const totalDetails = supply.details?.length;
        const category = supply.mtlCategory || supply.eqptCategory;
        const description = item.mtlDescription || item.eqptDescript;
        const quantity = item.mtlQuantity ?? item.quantity ?? 0;
        const unit = item.mtlUnit || item.eqptUnit;
        const isInvalid = invalidQuantities[item.suppId] || false;

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
            {isDemobilization && (
              <td>
                <Input
                  isInvalid={isInvalid}
                  size="sm"
                  className="px-2"
                  type="number"
                  placeholder="Enter a number"
                  onChange={(e) =>
                    onInputChange(
                      e.target.value,
                      item.eqptCode,
                      item.quantity,
                      item.suppId
                    )
                  }
                />
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

const AssignedSupplyTable = ({ isMaterial, isDemobilization }: any) => {
  const navigate = useNavigate();
  const returnEquipment = useReturnAssignedEquipment();

  const { data: assignedMaterials, isLoading } =
    getAssignedMaterialsByFacilitator();
  const { data: assignedEquipment, isLoading: isLoadingAssignedEquipment } =
    getAssignedEquipmentByFacilitator();

  const supplyData = isMaterial ? assignedMaterials : assignedEquipment;

  const [returnSupply, setReturnSupply] = useState<any[]>([]);
  const [invalidQuantities, setInvalidQuantities] = useState<any>({});

  const handleInputChange = useCallback(
    (value: string, eqptCode: string, quantity: number, suppId: string) => {
      const returnedQuantity = value ? parseInt(value, 10) : 0;

      setInvalidQuantities((prev: any) => ({
        ...prev,
        [suppId]: returnedQuantity > quantity, // Mark invalid if exceeded
      }));

      setReturnSupply((prev) => {
        const updated = prev.map((item) =>
          item.eqptCode === eqptCode ? { ...item, returnedQuantity } : item
        );

        if (!updated.some((item) => item.eqptCode === eqptCode)) {
          updated.push({ eqptCode, returnedQuantity });
        }

        return updated;
      });
    },
    []
  );

  const handleButtonClick = async () => {
    const isConfirmed = window.confirm(
      "Press OK to return the assigned supplies."
    );

    if (isConfirmed) {
      returnEquipment.mutateAsync(returnSupply, {
        onSuccess: (data) => {
          toast.success(data);
          navigate("/");
        },
      });
    }
  };

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
                    {isDemobilization && (
                      <th scope="col" className="text-center px-4 py-3">
                        DAMAGED
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {isLoading || isLoadingAssignedEquipment ? (
                    <Loader />
                  ) : (
                    <SupplyRows
                      supplyData={supplyData}
                      itemNo={1}
                      isDemobilization={isDemobilization}
                      onInputChange={handleInputChange}
                      invalidQuantities={invalidQuantities}
                    />
                  )}
                </tbody>
              </table>
              <div className="flex w-full mt-4 items-end">
                {isDemobilization && (
                  <Button
                    isDisabled={Object.values(invalidQuantities).includes(true)}
                    className="bg-orange-400 ml-auto w-max text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
                    isLoading={returnEquipment.isPending}
                    onClick={handleButtonClick}
                  >
                    {returnEquipment.isPending ? "Returning..." : "Return"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedSupplyTable;
