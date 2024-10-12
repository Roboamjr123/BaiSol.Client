import React, { useState } from "react";
import {
  getProjectAndMaterialsCostQuote,
  getProjectCostQuote,
  useDeleteProjectMaterialSupply,
} from "../../../lib/API/Quote/ProjectQuotationAPI";
import { useParams } from "react-router-dom";
import { getMaterialQOH } from "../../../lib/API/MaterialAPI";
import { project_quotation_and_materials_columns } from "../../../lib/utils/QuotationTable";
import EditQuantityMaterialModal from "../modal/project/EditQuantityMaterialModal";
import AddMaterialSupply from "../modal/project/AddMaterialSupply";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { formatNumber } from "../../../lib/utils/utils";
import { Edit } from "lucide-react";
import EditProfitRate from "../modal/project/EditProfitRate";

interface IProjectAndMAterial {
  projId: string;
  projectCost: any;
  refetch: () => void;
  refetchLabor: () => void;
  isLoading: boolean;
  isEditMode: boolean;
}

const ProjectAndMaterialsCostQuotation: React.FC<IProjectAndMAterial> = ({
  projId,
  projectCost,
  refetch,
  refetchLabor,
  isLoading,
  isEditMode,
}) => {
  // Fetch `id` from URL params
  // const { projId } = useParams<{ projId: string }>();
  const [mtlQuantity, setMtlQuantity] = useState<number>(0);
  const [mtlId, setMtlId] = useState<number>(0);
  const [suppId, setSuppId] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  let itemNo = 1;

  const { mutate: deleteMaterial } = useDeleteProjectMaterialSupply();
  const { refetch: qohRefetch } = getMaterialQOH(mtlId);
  // const {
  //   data: projectCost,
  //   refetch,
  //   isLoading,
  // } = getProjectAndMaterialsCostQuote(projId!);

  const totalCostItems = [
    {
      label: "TOTAL",
      value: projectCost?.totalProjectCostList?.totalCost ?? 0,
    },
    {
      label: "Profit %",
      value: String(projectCost?.totalProjectCostList?.profitPercentage) + "%",
    },
    { label: "PROFIT", value: projectCost?.totalProjectCostList?.profit ?? 0 },
    {
      label: "OVERALL MATERIAL TOTAL",
      value: projectCost?.totalProjectCostList?.overallMaterialTotal ?? 0,
    },
    {
      label: "OVERALL PROJECT MGT COST",
      value: projectCost?.totalProjectCostList?.overallProjMgtCost ?? 0,
    },
    {
      label: "TOTAL PROJECT COST",
      value: projectCost?.totalProjectCostList?.totalProjectCost ?? 0,
    },
  ];

  const handleEditQuantityClick = (
    mtlQuantity: number,
    mtlId: number,
    suppId: number,
    description: string
  ) => {
    setMtlQuantity(mtlQuantity);
    setMtlId(mtlId);
    setSuppId(suppId);
    setDescription(description);
    mtlOnOpen();
  };

  // Function to handle delete item
  const handleDeleteItem = (mtlId: number, suppId: number) => {
    if (window.confirm("Delete this item?")) {
      deleteMaterial(
        { suppId, mtlId },
        {
          onSuccess: () => {
            refetch();
            qohRefetch();
          },
        }
      );
    }
  };

  const {
    isOpen: mtlIsOpen,
    onOpen: mtlOnOpen,
    onClose: mtlOnClose,
  } = useDisclosure();

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

  const handleOpenEdit = () => {
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
                  Material Cost
                </span>
                {isEditMode && (
                  <div className="flex gap-4">
                    <Button
                      isLoading={isLoading}
                      className="bg-orange-500 text-background"
                      endContent={<Edit />}
                      size="sm"
                      onClick={() => editOnOpen()}
                    >
                      Edit Profit Rate
                    </Button>
                    <Button
                      isLoading={isLoading}
                      className="bg-orange-500 text-background"
                      endContent={<FaPlus />}
                      size="sm"
                      onClick={() => addOnOpen()}
                    >
                      Add Material Supply
                    </Button>
                  </div>
                )}
              </div>
              <table className="w-full rounded-lg text-left text-gray-700">
                <thead className="text-sm text-gray-700 bg-gray-50">
                  <tr className="border-b border-gray-400">
                    {project_quotation_and_materials_columns
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
                      {projectCost?.materialAndCategoryCostList?.length ? (
                        projectCost.materialAndCategoryCostList.map(
                          (ctgry: any) =>
                            ctgry.materialCostDtos.map(
                              (material: any, index: any) => {
                                const currentItemNo = itemNo; // Store the current itemNo
                                itemNo++; // Increment itemNo

                                return (
                                  <tr
                                    className="border-b text-sm hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap"
                                    key={material.suppId}
                                  >
                                    <td className="border-b text-center hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                      {currentItemNo}
                                    </td>
                                    <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                      {material.description}
                                    </td>
                                    <td className="border-b text-center hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                      {material.quantity}
                                    </td>
                                    <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                      {material.unit}
                                    </td>
                                    <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                      ₱ {formatNumber(material.unitCost)}
                                    </td>
                                    <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                      ₱ {formatNumber(material.totalUnitCost)}
                                    </td>
                                    <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                      ₱ {formatNumber(material.buildUpCost)}
                                    </td>

                                    {index === 0 && (
                                      <td
                                        className="text-center border-b border-gray-400 bg-gray-200 px-4 py-1 font-medium text-gray-900 whitespace-nowrap h-full"
                                        rowSpan={ctgry.totalCategory}
                                      >
                                        <div className="flex flex-col justify-between h-full">
                                          <span className="text-lg font-bold">
                                            {ctgry.category}
                                          </span>
                                          <br />
                                          <span className="font-semibold tracking-widest">
                                            ₱ {formatNumber(ctgry.totalExpense)}
                                          </span>
                                        </div>
                                      </td>
                                    )}

                                    {isEditMode && (
                                      <td className="border-b hover:bg-gray-100 px-4 py-1 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex flex-row justify-center">
                                          <Button
                                            variant="light"
                                            onClick={() =>
                                              handleEditQuantityClick(
                                                material.quantity,
                                                material.mtlId,
                                                material.suppId,
                                                material.description
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
                                              handleDeleteItem(
                                                material.mtlId,
                                                material.suppId
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
                            colSpan={
                              project_quotation_and_materials_columns.length + 1
                            }
                            className="text-center py-4 text-gray-500"
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                      {projectCost?.materialAndCategoryCostList?.length
                        ? totalCostItems.map((item, index) => (
                            <tr className="bg-gray-200" key={index}>
                              <td
                                colSpan={5}
                                className="font-semibold text-sm text-end"
                              >
                                {item.label}:
                              </td>
                              <td
                                colSpan={1}
                                className="font-bold tracking-wide text-xs pl-3 text-start"
                              >
                                {/* Conditionally format the value */}
                                {typeof item.value === "number"
                                  ? `₱ ${formatNumber(item.value)}`
                                  : item.value}
                              </td>
                            </tr>
                          ))
                        : null}
                    </>
                  )}
                </tbody>
              </table>
              <EditQuantityMaterialModal
                suppId={suppId!}
                mtlId={mtlId!}
                mtlDescription={description!}
                refetch={refetch}
                prevQty={mtlQuantity!}
                isOpen={mtlIsOpen}
                onClose={mtlOnClose}
              />
              <AddMaterialSupply
                isOpen={addIsOpen}
                onClose={addOnClose}
                projId={projId!}
                refetch={refetch}
              />
              <EditProfitRate
                isOpen={editIsOpen}
                onClose={editOnClose}
                projId={projId!}
                refetch={refetch}
                refetchLabor={refetchLabor}
                prevProfitRate={
                  projectCost?.totalProjectCostList?.profitPercentage
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAndMaterialsCostQuotation;
