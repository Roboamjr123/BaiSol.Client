import React, { useCallback, useMemo, useState } from "react";
import {
  getProjectCostQuote,
  MaterialCost,
  useDeleteProjectMaterialSupply,
} from "../../../lib/API/Quote/QuotationAPI";
import {
  Button,
  getKeyValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { project_quotation_columns } from "../../../lib/utils/QuotationTable";
import { useParams } from "react-router-dom";
import { FaEdit, FaPlus, FaSave, FaTrashAlt } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import EditQuantityMaterialModal from "../modal/project/EditQuantityMaterialModal";
import { toast } from "react-toastify";
import { getMaterialQOH } from "../../../lib/API/MaterialAPI";
import AddMaterialSupply from "../modal/project/AddMaterialSupply";

const ProjectCostQuotation = () => {
  // Fetch `id` from URL params
  const { projId } = useParams<{ projId: string }>();
  const [mtlQuantity, setMtlQuantity] = useState<number>(0);
  const [mtlId, setMtlId] = useState<number>(0);
  const [suppId, setSuppId] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const { mutate: deleteMaterial } = useDeleteProjectMaterialSupply();

  const { refetch: qohRefetch } = getMaterialQOH(mtlId);

  const {
    data: projectCost,
    refetch,
    isLoading,
    error,
  } = getProjectCostQuote(projId!);

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

  const formatNumber = (number: number) => {
    // Create an instance of Intl.NumberFormat for the desired format
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: true,
    });

    return formatter.format(number);
  };

  const renderCell = useCallback(
    (mtlCost: MaterialCost, columnKey: React.Key) => {
      const cellValue = mtlCost[columnKey as keyof MaterialCost];

      switch (columnKey) {
        case "description":
          return (
            <div className="text-xs font-medium">{mtlCost.description}</div>
          );
        case "quantity":
          return <div className="text-xs font-medium">{mtlCost.quantity}</div>;
        case "unit":
          return <div className="text-xs font-medium">{mtlCost.unit}</div>;
        case "unitCost":
          return (
            <div className="text-xs font-medium">
              ₱ {formatNumber(mtlCost.unitCost)}
            </div>
          );
        case "totalUnitCost":
          return (
            <div className="text-xs font-medium">
              ₱ {formatNumber(mtlCost.totalUnitCost)}
            </div>
          );
        case "buildUpCost":
          return (
            <div className="text-xs font-medium">
              ₱ {formatNumber(mtlCost.buildUpCost)}
            </div>
          );
        case "action":
          return (
            <div className="flex flex-row justify-center">
              <Button
                variant="light"
                onClick={() =>
                  handleEditQuantityClick(
                    mtlCost.quantity,
                    mtlCost.mtlId,
                    mtlCost.suppId,
                    mtlCost.description
                  )
                }
              >
                <FaEdit size={20} className="text-primary-500" />
              </Button>

              <Button
                variant="light"
                onClick={() => handleDeleteItem(mtlCost.mtlId, mtlCost.suppId)}
              >
                <FaTrashAlt size={20} className="text-danger-500" />
              </Button>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [] // Dependency on editingCell state
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex w-full justify-between items-end">
        <span className="tracking-wider font-semibold">Material Cost</span>
        <Button
          className="bg-orange-500 text-background"
          endContent={<FaPlus />}
          size="sm"
          onClick={() => addOnOpen()}
        >
          Add Material Supply
        </Button>
      </div>
    );
  }, []);

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className="flex flex-row gap-10">
            <div className="w-full">
              <Table
                aria-label="Project Quotation Table"
                isCompact
                removeWrapper
                selectionMode="single"
                isHeaderSticky
                topContent={topContent}
                topContentPlacement="outside"
              >
                <TableHeader columns={project_quotation_columns}>
                  {(column) => (
                    <TableColumn align="center" key={column.uid}>
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  loadingContent={<Spinner color="warning" />}
                  isLoading={isLoading}
                  emptyContent={"No project quotation found"}
                  items={projectCost?.materialCostList || []}
                >
                  {(item) => (
                    <TableRow key={item.suppId}>
                      {(columnKey) => (
                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCostQuotation;
