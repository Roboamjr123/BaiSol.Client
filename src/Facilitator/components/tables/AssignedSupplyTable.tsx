import React, { useState, useCallback } from "react";
import { assigned_supply_columns } from "../../../lib/utils/Facilitator/AssignedSupplyTable";
import { Button, Input, Spinner } from "@nextui-org/react";
import {
  getAssignedEquipmentByFacilitator,
  getAssignedMaterialsByFacilitator,
} from "../../../lib/API/Facilitator/RequestAPI";
import {
  IReturnSupplyDTO,
  useReturnAssignedEquipment,
} from "../../../lib/API/Facilitator/AssignedAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ISupply {
  isMaterial?: boolean;
  isDemobilization?: boolean;
}

const SupplyRows = ({
  supplyData,
  itemNo,
  isDemobilization,
  onInputChange,
}: any) => {
  let itemCount = itemNo;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    eqptCode: string,
    quantity: number
  ) => {
    const value = e.target.value;

    // Validate and parse the input to ensure it's a number
    const returnedQuantity = value ? parseInt(value, 10) : 0;

    // Call the callback passed down to parent to update returnSupply state
    if (returnedQuantity > 0) {
      onInputChange(eqptCode, returnedQuantity, quantity);
    }
  };

  return supplyData?.length ? (
    supplyData.map((supply: any) =>
      supply.details?.map((item: any, index: number) => {
        const currentItemNo = itemCount++;
        const totalDetails = supply.details?.length;
        const category = supply.mtlCategory || supply.eqptCategory;
        const description = item.mtlDescription || item.eqptDescript;
        const quantity = item.mtlQuantity ?? item.quantity ?? "N/A";
        const unit = item.mtlUnit || item.eqptUnit;
        const [isInvalid, setIsInvalid] = useState<boolean>(false);
        const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          if (quantity < value) {
            setIsInvalid(true);
          } else setIsInvalid(false);
        };

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
                  type="text" // Set to text to enable custom validation
                  placeholder="Enter a number"
                  onKeyPress={(e) => {
                    // Prevent non-numeric characters, minus signs, and dots
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    handleInputChange(e, item.eqptCode, item.quantity); // Call your existing function
                    handleInput(e); // Call the additional function
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
  const { data: assignedEquipment } = getAssignedEquipmentByFacilitator();
  const supplyData = isMaterial ? assignedMaterials : assignedEquipment;
  let itemNo = 1;

  // State to store return supply data
  const [returnSupply, setReturnSupply] = useState<IReturnSupplyDTO[]>([]);
  const [isInvalidQuantity, setInvalidQuantity] = useState<boolean>(false);

  // Callback to update the returnSupply state using useCallback
  const handleInputChange = useCallback(
    (eqptCode: string, returnedQuantity: number, quantity: number) => {
      // Ensure returnedQuantity is a valid number, defaulting to 0 if it's empty or NaN
      const validReturnedQuantity = isNaN(returnedQuantity)
        ? 0
        : returnedQuantity;

      // Handle case when quantity is 0 or undefined, reset invalid state
      if (quantity === 0 || quantity === undefined) {
        setInvalidQuantity(false);
        return;
      }

      // Update the returnSupply state
      setReturnSupply((prev) => {
        const updated = prev.map((item) =>
          item.eqptCode === eqptCode
            ? { ...item, returnedQuantity: validReturnedQuantity }
            : item
        );

        // If no existing entry is found, push a new one
        if (!updated.some((item) => item.eqptCode === eqptCode)) {
          updated.push({ eqptCode, returnedQuantity: validReturnedQuantity });
        }

        // Check if the returnedQuantity is greater than the available quantity
        const hasInvalidQuantity = updated.some(
          (item) => item.returnedQuantity > quantity
        );

        if (updated.length === 0) {
          setInvalidQuantity(false);
        }

        // If returnedQuantity exceeds the available quantity, set invalid state to true
        setInvalidQuantity(hasInvalidQuantity);
        console.log(updated);
        return updated;
      });
    },
    [] // No dependencies for the callback
  );

  // Function to handle the button click and log the returnSupply state
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center">
                        <div className="flex justify-center items-center h-64">
                          <Spinner color="warning" />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <SupplyRows
                      supplyData={supplyData}
                      itemNo={itemNo}
                      isDemobilization={isDemobilization}
                      onInputChange={handleInputChange} // Pass callback to child
                    />
                  )}
                </tbody>
              </table>
              <div className="flex w-full mt-4 items-end">
                <span className="flex tracking-wider font-semibold w-full">
                  {isDemobilization && (
                    <Button
                      isDisabled={isInvalidQuantity}
                      className="bg-orange-400 ml-auto w-max text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
                      isLoading={returnEquipment.isPending}
                      onClick={handleButtonClick} // Add onClick handler here
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
