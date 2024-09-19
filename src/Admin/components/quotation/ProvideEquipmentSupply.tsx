import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { assigned_equipment_columns } from "../../../lib/utils/QuotationTable";
import {
  IAssignedEquipment,
  IAssignedEquipmentDetails,
  useDeleteAssignedEquipment,
} from "../../../lib/API/Quote/EquipmentAssignationAPI";
import { formatNumber } from "../../../lib/utils/utils";
import { toast } from "react-toastify";
import AddEquipmentSupply from "../modal/project/AddEquipmentSupply";
import EditQuantityEquipment from "../modal/project/EditQuantityEquipment";

interface IEquipment {
  projId: string;
  assignedEquipment: IAssignedEquipment[];
  refetch: () => void;
  isLoading: boolean;
  isEditMode: boolean;
}

const ProvideEquipmentSupply: React.FC<IEquipment> = ({
  projId,
  assignedEquipment,
  isEditMode,
  isLoading,
  refetch,
}) => {
  const deleteEquipment = useDeleteAssignedEquipment();

  const [eqptQuantity, setEqptQuantity] = useState<number>(0);
  const [eqptId, setEqptId] = useState<number>(0);
  const [suppId, setSuppId] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  let itemNo = 1;

  const {
    isOpen: addIsOpen,
    onOpen: addOnOpen,
    onClose: addOnClose,
  } = useDisclosure();

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();

  const handleDeleteEquipment = (eqptId: number, suppId: number) => {
    if (window.confirm("Press OK to delete this item.")) {
      deleteEquipment.mutateAsync(
        { eqptId: eqptId, suppId: suppId },
        {
          onSuccess: (data) => {
            toast.success(data);
            refetch();
          },
          onError: (error) => {
            toast.error(error.message);
            console.error("Error deleting item:", error);
          },
        }
      );
    }
  };

  const handleEditQuantityClick = (
    eqptQuantity: number,
    eqptId: number,
    suppId: number,
    description: string
  ) => {
    setEqptQuantity(eqptQuantity);
    setEqptId(eqptId);
    setSuppId(suppId);
    setDescription(description);
    editOnOpen();
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className="flex flex-row gap-10">
            <div className="w-full">
              <div className="flex w-full mb-4 justify-between items-end">
                <span className="tracking-wider font-semibold">
                  Equipment Supply
                </span>
                {isEditMode && (
                  <Button
                    isLoading={isLoading}
                    className="bg-orange-500 text-background"
                    endContent={<FaPlus />}
                    size="sm"
                    onClick={() => addOnOpen()}
                  >
                    Add Equipment Supply
                  </Button>
                )}
              </div>
              <table className="w-full rounded-lg text-left text-gray-700">
                <thead className="text-sm text-gray-700 bg-gray-50">
                  <tr className="border-b border-gray-400">
                    {assigned_equipment_columns
                      .filter(
                        (item) => !(!isEditMode && item.name === "Action")
                      ) // Remove "Action" in edit mode
                      .map((item) => (
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
                    <>
                      {assignedEquipment?.length ? (
                        assignedEquipment.map((category: IAssignedEquipment) =>
                          category.details.map(
                            (
                              equipment: IAssignedEquipmentDetails,
                              index: number
                            ) => {
                              const currentItemNo = itemNo; // Store the current itemNo
                              itemNo++; // Increment itemNo

                              return (
                                <tr
                                  className="border-b text-sm hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap"
                                  key={equipment.suppId}
                                >
                                  {index === 0 && (
                                    <td
                                      className="text-center border-gray-400 px-4 py-1 font-medium text-gray-900 whitespace-nowrap h-full"
                                      rowSpan={category.details.length}
                                    >
                                      <div className="flex flex-col justify-between h-full">
                                        <span className="text-lg font-bold">
                                          {category.eqptCategory}
                                        </span>
                                      </div>
                                    </td>
                                  )}

                                  <td className="border-b text-center hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                    {currentItemNo}
                                  </td>
                                  <td className="border-b text-start hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                    {equipment.eqptDescript}
                                  </td>
                                  <td className="border-b text-center hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                    {equipment.eqptqoh}
                                  </td>
                                  <td className="border-b text-start hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                    {equipment.eqptUnit}
                                  </td>
                                  {/* <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                    ₱ {formatNumber(equipment.eqptPrice)}
                                  </td> */}

                                  {isEditMode && (
                                    <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                      <div className="flex flex-row justify-center">
                                        <Button
                                          variant="light"
                                          onClick={() =>
                                            handleEditQuantityClick(
                                              equipment.eqptqoh,
                                              equipment.eqptId,
                                              equipment.suppId,
                                              equipment.eqptDescript
                                            )
                                          }
                                        >
                                          <FaEdit
                                            size={20}
                                            className="text-primary-500"
                                          />
                                        </Button>

                                        <Button
                                          variant="light"
                                          onClick={() =>
                                            handleDeleteEquipment(
                                              equipment.eqptId,
                                              equipment.suppId
                                            )
                                          }
                                        >
                                          <FaTrashAlt
                                            size={20}
                                            className="text-danger-500"
                                          />
                                        </Button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            }
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={assigned_equipment_columns.length + 1}
                            className="text-center py-4 text-gray-500"
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
              <AddEquipmentSupply
                isOpen={addIsOpen}
                onClose={addOnClose}
                projId={projId}
                refetch={refetch}
              />
              <EditQuantityEquipment
                suppId={suppId}
                eqptId={eqptId}
                eqptDescription={description}
                refetch={refetch}
                prevQty={eqptQuantity}
                isOpen={editIsOpen}
                onClose={editOnClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvideEquipmentSupply;
