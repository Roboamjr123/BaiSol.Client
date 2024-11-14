import React, { useState, useCallback } from "react";
import { assigned_supply_columns } from "../../../lib/utils/Facilitator/AssignedSupplyTable";
import { Button, Input, Spinner } from "@nextui-org/react";
import {
  getAssignedEquipmentByFacilitator,
  getAssignedMaterialsByFacilitator,
  IAssignedEquipment,
  IAssignedMaterials,
} from "../../../lib/API/Facilitator/RequestAPI";
import {
  IReturnSupplyDTO,
  useReturnAssignedEquipment,
} from "../../../lib/API/Facilitator/AssignedAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../../main/components/Loader";

interface ISupply {
  isMaterial?: boolean;
  isDemobilization?: boolean;
}

const SupplyRows = ({
  supplyData,
  itemNo,
  isDemobilization,
  onInputChange,
  invalidQuantities, // Object that holds invalid state for each row
  setInvalidQuantities, // Function to update invalid state
}: any) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    eqptCode: string,
    quantity: number
  ) => {
    const value = e.target.value;
    const returnedQuantity = value ? parseInt(value, 10) : 0;

    if (returnedQuantity > 0) {
      onInputChange(eqptCode, returnedQuantity, quantity);
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    quantity: number,
    suppId: string
  ) => {
    const value = e.target.value;
    const isInvalid = quantity < parseInt(value);
    // Update invalid status for this specific row
    setInvalidQuantities((prev: any) => ({ ...prev, [suppId]: isInvalid }));
  };

  return supplyData?.length ? (
    supplyData?.map((supply: any) =>
      supply.details?.map((item: any, index: number) => {
        const currentItemNo = itemNo++;
        const totalDetails = supply.details?.length;
        const category = supply.mtlCategory || supply.eqptCategory;
        const description = item.mtlDescription || item.eqptDescript;
        const quantity = item.mtlQuantity ?? item.quantity ?? "N/A";
        const unit = item.mtlUnit || item.eqptUnit;
        const isInvalid = invalidQuantities[item.suppId] || false; // Get invalid state from the object

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
                  type="text"
                  placeholder="Enter a number"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    handleInputChange(e, item.eqptCode, item.quantity);
                    handleInput(e, item.quantity, item.suppId); // Call to set invalid status
                  }}
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

const AssignedSupplyTable: React.FC<ISupply> = ({
  isMaterial,
  isDemobilization,
}) => {
  const returnEquipment = useReturnAssignedEquipment();
  const navigate = useNavigate();
  const { data: assignedMaterials, isLoading } =
    getAssignedMaterialsByFacilitator();
  const { data: assignedEquipment, isLoading: isLoadingAssignedEquipment } =
    getAssignedEquipmentByFacilitator();

  const supplyData = isMaterial ? assignedMaterials : assignedEquipment;
  let itemNo = 1;

  const [returnSupply, setReturnSupply] = useState<IReturnSupplyDTO[]>([]);
  const [invalidQuantities, setInvalidQuantities] = useState<{
    [key: string]: boolean;
  }>({}); // Track invalid state

  const handleInputChange = useCallback(
    (eqptCode: string, returnedQuantity: number, quantity: number) => {
      const validReturnedQuantity = isNaN(returnedQuantity)
        ? 0
        : returnedQuantity;

      if (quantity === 0 || quantity === undefined) {
        setInvalidQuantities((prev) => ({ ...prev, [eqptCode]: false }));
        return;
      }

      setReturnSupply((prev) => {
        const updated = prev.map((item) =>
          item.eqptCode === eqptCode
            ? { ...item, returnedQuantity: validReturnedQuantity }
            : item
        );

        if (!updated.some((item) => item.eqptCode === eqptCode)) {
          updated.push({ eqptCode, returnedQuantity: validReturnedQuantity });
        }

        const hasInvalidQuantity = updated.some(
          (item) => item.returnedQuantity > quantity
        );
        setInvalidQuantities((prev) => ({
          ...prev,
          [eqptCode]: hasInvalidQuantity,
        }));

        return updated;
      });
    },
    [] // No dependencies for the callback
  );

  const handleButtonClick = async () => {
    const isConfirmed = window.confirm(
      "Press OK to return the assigned supplies."
    );

    if (isConfirmed) {
      returnEquipment.mutateAsync(returnSupply, {
        onSuccess: (data) => {
          toast.success(data);
          window.location.reload();
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
                      itemNo={itemNo}
                      isDemobilization={isDemobilization}
                      onInputChange={handleInputChange}
                      invalidQuantities={invalidQuantities} // Pass invalid state
                      setInvalidQuantities={setInvalidQuantities} // Pass the setter function
                    />
                  )}
                </tbody>
              </table>
              <div className="flex w-full mt-4 items-end">
                <span className="flex tracking-wider font-semibold w-full">
                  {isDemobilization && (
                    <Button
                      isDisabled={Object.values(invalidQuantities).includes(
                        true
                      )} // Disable button if any invalid quantity
                      className="bg-orange-400 ml-auto w-max text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
                      isLoading={returnEquipment.isPending}
                      onClick={handleButtonClick}
                    >
                      {returnEquipment.isPending ? "Returning..." : "Return"}
                    </Button>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedSupplyTable;
