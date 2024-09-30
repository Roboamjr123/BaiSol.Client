import React, { useCallback, useMemo, useState } from "react";
import {
  getRequestMaterialSupplies,
  getRequestsByProj,
  IAllRequest,
  useAcknowledgeRequest,
} from "../../../lib/API/Facilitator/RequestAPI";
import {
  request_columns,
  requestStatusColorMap,
} from "../../../lib/utils/Facilitator/RequestTable";
import {
  Button,
  Chip,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import {
  useDeleteRequest,
  useRequestSupply,
} from "../../../lib/API/RequisitionAPI";
import { toast } from "react-toastify";
import { MdOutlineDeleteForever } from "react-icons/md";
import { iconClasses } from "../../../lib/utils/usersTable";
import { BiDotsVertical } from "react-icons/bi";
import { CheckIcon, ChevronDownIcon, EditIcon } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { FaEdit, FaPlus } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import EditRequestQuantityModal from "../modals/EditRequestQuantityModal";

const defaultRequest: IAllRequest = {
  reqId: 0,
  submittedAt: new Date().toISOString(), // Default to current time
  reviewedAt: "", // Empty string, if no review date yet
  status: "Pending", // Default status
  quantityRequested: 0,
  requestSupply: "",
  projectName: "",
  supplyCategory: "",
  submittedBy: "",
  reviewedBy: "",
};

const RequestsSupplyTable = () => {
  const deleteRequest = useDeleteRequest();
  const acknowledgeRequest = useAcknowledgeRequest();
  const sendRequest = useRequestSupply();

  // const {
  //   data: requestEquipment,
  //   isLoading: isLoadingRE,
  //   refetch: refetchRE,
  // } = getRequestMaterialSupplies("Equipment");

  // const {
  //   data: requestMAterial,
  //   isLoading: isLoadingRM,
  //   refetch: refetchRM,
  // } = getRequestMaterialSupplies("Material");

  const { data: requestsData, isLoading, refetch } = getRequestsByProj();
  const requests = requestsData ?? [];

  const approvedRequests =
    requests?.map((requests: IAllRequest) => requests.reqId) || [];
  const disableRequest =
    requests
      ?.filter(
        (request: IAllRequest) =>
          request.status === "Declined" || request.status === "Acknowledged"
      )
      .map((request: IAllRequest) => request.reqId) || [];
  const requestsLength = requests ? requests.length : 0;

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [isSelectMany, setIsSelectMany] = useState(false);

  const [requestData, setRequestData] = useState<IAllRequest>(defaultRequest);

  const handleDeleteRequest = (id: number) => {
    if (window.confirm("Click OK to delete request.")) {
      deleteRequest.mutateAsync(
        { reqId: id },
        {
          onSuccess: (data) => {
            toast.info(data);
            refetch();
          },
        }
      );
    }
  };

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();

  const handleAcknowledgeRequest = (id: number[]) => {
    if (window.confirm("Click  OK to acknowledge request.")) {
      acknowledgeRequest.mutateAsync(
        { reqId: id },
        {
          onSuccess: (data) => {
            toast.info(data);
            refetch();
          },
        }
      );
    }
  };

  const handleOpenEdit = (request: IAllRequest) => {
    setRequestData(request);
    editOnOpen();
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between gap-3 items-end">
          {isSelectMany ? (
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Actions
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="shadow">
                <DropdownItem
                  color="success"
                  startContent={
                    <CheckIcon className={cn(iconClasses, "text-success")} />
                  }
                  onClick={() => {
                    handleAcknowledgeRequest(
                      selectedKeys === "all"
                        ? approvedRequests
                        : Array.from(selectedKeys).map((key) => Number(key))
                    );
                  }}
                >
                  Acknowledge
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : null}

          {!isSelectMany ? (
            <Button
              className="bg-orange-500 text-background"
              endContent={<FaPlus />}
              size="sm"
            >
              Add Request
            </Button>
          ) : null}

          <Switch
            className="items-center pt-2"
            color="warning"
            size="lg"
            isSelected={isSelectMany} // Bind switch to isEditMode state
            onValueChange={setIsSelectMany} // Use the selected value directly
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <FaEdit className={className} />
              ) : (
                <IoIosSave className={className} />
              )
            }
          >
            {isSelectMany ? "Select Many" : "Single"}
          </Switch>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-default-400 text-small">
            Total {requestsLength} request
          </span>
          <span className="text-default-400 text-small">
            {selectedKeys === "all"
              ? `All items selected `
              : `Total Selected: ${selectedKeys.size} of ${requests?.length} selected`}{" "}
          </span>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    handleAcknowledgeRequest,
    requestsLength,
    isSelectMany,
    setIsSelectMany,
    requestsLength,
  ]);

  const renderCell = useCallback(
    (request: IAllRequest, columnKey: React.Key) => {
      const cellValue = request[columnKey as keyof IAllRequest];

      switch (columnKey) {
        case "requestSupply":
          return request.requestSupply;
        case "supplyCategory":
          return request.supplyCategory;
        case "quantityRequested":
          return request.quantityRequested;
        case "projectName":
          return request.projectName;
        case "submittedBy":
          return request.submittedBy;
        case "submittedAt":
          return request.submittedAt;
        case "reviewedBy":
          return request.reviewedBy;
        case "reviewedAt":
          return request.reviewedAt;
        case "status":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={requestStatusColorMap[request.status]}
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          if (
            isSelectMany ||
            request.status === "Declined" ||
            request.status === "Acknowledged"
          ) {
            // Disable dropdown or return null if requested quantity exceeds available quantity
            return null; // You can return null to hide the dropdown or use a message to indicate insufficient stock
          }
          return (
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <BiDotsVertical className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Actions" variant="shadow">
                {request.status === "OnReview" ? (
                  <DropdownItem
                    key="edit"
                    color="primary"
                    startContent={
                      <EditIcon className={`${iconClasses} text-primary`} />
                    }
                    onClick={() => handleOpenEdit(request)}
                  >
                    Edit
                  </DropdownItem>
                ) : (
                  <DropdownItem className="hidden"></DropdownItem>
                )}
                {request.status === "Approved" ? (
                  <DropdownItem
                    key="acknowledge"
                    color="success"
                    startContent={
                      <CheckIcon className={`${iconClasses} text-success`} />
                    }
                    onClick={() => {
                      handleAcknowledgeRequest([request.reqId]);
                    }}
                  >
                    Acknowledge
                  </DropdownItem>
                ) : (
                  <DropdownItem className="hidden"></DropdownItem>
                )}

                {request.status === "OnReview" ? (
                  <DropdownItem
                    key="delete"
                    color="danger"
                    className="text-danger"
                    startContent={
                      <MdOutlineDeleteForever
                        className={`${iconClasses} text-danger`}
                      />
                    }
                    onClick={() => {
                      handleDeleteRequest(request.reqId);
                    }}
                  >
                    Delete
                  </DropdownItem>
                ) : (
                  <DropdownItem className="hidden"></DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          );

        default:
          return cellValue;
      }
    },
    []
  );

  const classNamesDesign = useMemo(
    () => ({
      base: "max-h-[500px] overflow-y-scroll scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100",
      table: "min-h-[120px]",
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      //   th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className=" min-w-full">
            {" "}
            <Table
              aria-label="Requests Table"
              isHeaderSticky
              removeWrapper
              disabledKeys={disableRequest?.toString()}
              classNames={classNamesDesign}
              selectedKeys={selectedKeys}
              selectionMode={isSelectMany ? "multiple" : "single"}
              topContent={topContent}
              topContentPlacement="outside"
              onSelectionChange={setSelectedKeys}
              checkboxesProps={{
                classNames: {
                  wrapper:
                    "after:bg-orange-400 after:text-background text-background",
                },
              }}
            >
              <TableHeader columns={request_columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent={"No request yet"}
                isLoading={isLoading}
                items={requests || []}
                loadingContent={
                  <Spinner color="warning">Loading Requests...</Spinner>
                }
              >
                {(item) => (
                  <TableRow key={item.reqId}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <EditRequestQuantityModal
              request={requestData}
              isOpen={editIsOpen}
              onClose={editOnClose}
              refetch={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsSupplyTable;
