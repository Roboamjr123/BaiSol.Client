import React, { useState } from "react";

import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { labor_columns } from "../../../lib/utils/QuotationTable";
import { formatNumber } from "../../../lib/utils/utils";
import {
  LaborCost,
  useDeleteLaborCost,
} from "../../../lib/API/Quote/LaborQuotationAPI";
import AddLaborCost from "../modal/project/AddLaborCost";
import EditLaborCost from "../modal/project/EditLaborCost";
import { MdFormatListBulletedAdd } from "react-icons/md";
import EditFacilitatorAssignation from "../modal/project/EditFacilitatorAssignation";
import EditInstallerAssignation from "../modal/project/EditInstallerAssignation";

interface ILaborCost {
  projId: string;
  laborCost: any;
  refetch: () => void;
  refetchPAM: () => void;
  isLoading: boolean;
  isEditMode: boolean;
}

const defaultLabor: LaborCost = {
  laborId: 0,
  description: "",
  quantity: 0,
  unit: "",
  unitCost: 0,
  unitNum: 0,
  totalCost: 0,
};

const LaborCostQuotation: React.FC<ILaborCost> = ({
  projId,
  laborCost,
  refetch,
  refetchPAM,
  isLoading,
  isEditMode,
}) => {
  const [installerQuantity, setInstallerQuantity] = useState<number>(0);
  const [selectedLabor, setSelectedLAbor] = useState<LaborCost>(defaultLabor);

  const [isPredefinedAndLastCategory, setIsPredefinedAndLastCategory] =
    useState<boolean>(false);

  const deleteLaborCost = useDeleteLaborCost();

  const totalLaborCostRow = [
    { label: "TOTAL", value: laborCost?.totalLaborCost.totalCost },
    {
      label: "Profit %",
      value: String(laborCost?.totalLaborCost.profitPercentage) + "%",
    },
    { label: "PROFIT", value: laborCost?.totalLaborCost.profit },
    {
      label: "OVERALL PROJECT MGT COST",
      value: laborCost?.totalLaborCost.overallLaborProjectTotal,
    },
  ];

  const predefinedCategories = [
    "Manpower",
    "Project Manager - Electrical Engr.",
    "Mobilization/Demob",
    "Tools & Equipment",
  ];
  const lastCategory = "Other Incidental Costs";

  // Sort the items in one loop and find missing categories
  const sortedCosts = laborCost?.laborCost?.reduce(
    (acc: any, labor: any) => {
      const { description } = labor;

      // Check for the last category first
      if (description === lastCategory) {
        acc.last.push(labor);
      }
      // Then check for predefined categories
      else if (predefinedCategories.includes(description)) {
        acc.predefined.push(labor);
        acc.existingCategories.add(description);
      }
      // Otherwise, categorize as new
      else {
        acc.new.push(labor);
      }

      return acc;
    },
    {
      predefined: [] as LaborCost[],
      new: [] as LaborCost[],
      last: [] as LaborCost[],
      existingCategories: new Set<string>(),
    }
  ) || {
    predefined: [],
    new: [],
    last: [],
    existingCategories: new Set<string>(),
  };

  // Find missing predefined categories
  const missingCategories = [...predefinedCategories, lastCategory].filter(
    (category) => !sortedCosts.existingCategories.has(category)
  );

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

  const {
    isOpen: editAssignFacIsOpen,
    onOpen: editAssignFacOnOpen,
    onClose: editAssignFacOnClose,
  } = useDisclosure();

  const {
    isOpen: editAssignInstallerIsOpen,
    onOpen: editAssignInstallerOnOpen,
    onClose: editAssignInstallerOnClose,
  } = useDisclosure();

  // Function to handle delete item
  const handleDeleteItem = (laborId: number) => {
    if (window.confirm("Delete this item?")) {
      deleteLaborCost.mutate(
        { laborId },
        {
          onSuccess: () => {
            refetch();
            refetchPAM();
          },
        }
      );
    }
  };

  const handleEditItem = (labor: LaborCost) => {
    setSelectedLAbor(labor);

    setIsPredefinedAndLastCategory(
      predefinedCategories.includes(labor.description) ||
        labor.description === lastCategory
    );

    editOnOpen();
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className="flex flex-row gap-10">
            <div className="w-full">
              <div className="flex w-full mb-4 justify-between items-end">
                <span className="tracking-wider font-semibold">Labor Cost</span>
                {isEditMode && (
                  <Button
                    isLoading={isLoading}
                    className="bg-orange-500 text-background"
                    endContent={<FaPlus />}
                    size="sm"
                    onClick={() => addOnOpen()}
                  >
                    Add Labor Cost
                  </Button>
                )}
              </div>
              <table className="w-full rounded-lg text-left text-gray-700">
                <thead className="text-sm text-gray-700 bg-gray-50">
                  <tr className="border-b border-gray-400">
                    {labor_columns
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
                      {laborCost?.laborCost?.length ? (
                        sortedCosts.predefined
                          .concat(sortedCosts.new, sortedCosts.last)
                          .map((labor: any, index: any) => {
                            return (
                              <tr
                                key={labor.laborId}
                                className="border-b text-sm hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap"
                              >
                                <td className="border-b text-center hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                  {index + 1}
                                </td>
                                <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                  {labor.description}
                                </td>
                                <td className="border-b text-center hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                  {labor.quantity}
                                </td>
                                <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                  {labor.unit}
                                </td>
                                <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                  ₱ {formatNumber(labor.unitCost)}
                                </td>
                                <td className="border-b text-center hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                  {labor.unitNum}
                                </td>
                                <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                  ₱ {formatNumber(labor.totalCost)}
                                </td>
                                {isEditMode && (
                                  <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                    <div className="flex flex-row text-center justify-between">
                                      <Button
                                        variant="light"
                                        onClick={() => handleEditItem(labor)}
                                      >
                                        <FaEdit
                                          size={20}
                                          className="text-primary-500"
                                        />
                                      </Button>

                                      {!(
                                        predefinedCategories.includes(
                                          labor.description
                                        ) || labor.description === lastCategory
                                      ) && (
                                        <Button
                                          variant="light"
                                          onClick={() =>
                                            handleDeleteItem(labor.laborId)
                                          }
                                        >
                                          <FaTrashAlt
                                            size={20}
                                            className="text-danger-500"
                                          />
                                        </Button>
                                      )}

                                      {labor.quantity > 0 &&
                                      labor.description == "Manpower" ? (
                                        <Button
                                          variant="light"
                                          onClick={() => {
                                            editAssignInstallerOnOpen();
                                            setInstallerQuantity(
                                              labor.quantity
                                            );
                                          }}
                                        >
                                          <MdFormatListBulletedAdd
                                            size={20}
                                            className="text-success-500"
                                          />
                                        </Button>
                                      ) : null}

                                      {labor.description ==
                                      "Project Manager - Electrical Engr." ? (
                                        <Button
                                          variant="light"
                                          onClick={() => editAssignFacOnOpen()}
                                        >
                                          <MdFormatListBulletedAdd
                                            size={20}
                                            className="text-success-500"
                                          />
                                        </Button>
                                      ) : null}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td
                            colSpan={labor_columns.length + 1}
                            className="text-center py-4 text-gray-500"
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                  {laborCost?.laborCost?.length
                    ? totalLaborCostRow.map((labor, index) => (
                        <tr className="bg-gray-200" key={index}>
                          <td
                            colSpan={6}
                            className="font-semibold text-sm text-end"
                          >
                            {labor.label}
                          </td>
                          <td
                            colSpan={1}
                            className="font-bold tracking-wide text-xs pl-3 text-start"
                          >
                            {typeof labor.value === "number"
                              ? `₱ ${formatNumber(labor.value)}`
                              : labor.value}
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
              <AddLaborCost
                isOpen={addIsOpen}
                onClose={addOnClose}
                projId={projId!}
                refetch={refetch}
                refetchPAM={refetchPAM}
              />

              <EditLaborCost
                isOpen={editIsOpen}
                onClose={editOnClose}
                refetch={refetch}
                refetchPAM={refetchPAM}
                labor={selectedLabor!}
                isPredefined={isPredefinedAndLastCategory}
                projId={projId}
              />
              <EditFacilitatorAssignation
                isOpen={editAssignFacIsOpen}
                onClose={editAssignFacOnClose}
                projId={projId}
              />

              <EditInstallerAssignation
                isOpen={editAssignInstallerIsOpen}
                onClose={editAssignInstallerOnClose}
                projId={projId}
                quantity={installerQuantity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborCostQuotation;
