import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  Chip,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Radio,
  RadioGroup,
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
import { toast } from "react-toastify";
import { MdOutlineDeleteForever } from "react-icons/md";
import { BiDotsVertical } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { CheckIcon, ChevronDownIcon, CrossIcon } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import {
  getRequestsByProj,
  IAllRequest,
  useApproveRequest,
  useDeclineRequest,
  useDeleteRequest,
} from "../../../../lib/API/RequisitionAPI";
import { useParams } from "react-router-dom";
import {
  requestStatusColorMap,
  requisition_columns,
} from "../../../../lib/utils/requisitonTable";
import { iconClasses } from "../../../../lib/utils/usersTable";
import { FaEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";

const RequestSupply = () => {
  const { projId } = useParams<{ projId: string }>();

  const deleteRequest = useDeleteRequest();
  const approveRequest = useApproveRequest();
  const declineRequest = useDeclineRequest();
  const { data: requests, isLoading, refetch } = getRequestsByProj(projId!);
  const requestIds =
    requests?.map((request: IAllRequest) => request.reqId) || [];
  const reviewedRequests =
    requests
      ?.filter((request: IAllRequest) => request.status !== "OnReview") // Filter out requests with status "OnReview"
      .map((request: IAllRequest) => request.reqId) || [];
  const requestsLength = requests ? requests.length : 0;

  const [isSelectMany, setIsSelectMany] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredRequests = requests ?? [];

    if (hasSearchFilter) {
      filteredRequests = filteredRequests.filter(
        (user) =>
          user.status.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.requestSupply
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          user.supplyCategory
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          user.submittedBy.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.reviewedBy.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredRequests;
  }, [requests, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const handleDeleteRequest = (id: number) => {
    if (window.confirm("Are you sure you want delete this request?")) {
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

  const handleRequestAction = (
    action: (params: { reqId: number[] }) => Promise<any>, // Expect reqId as an array
    id: number[],
    confirmationMessage: string
  ) => {
    window.confirm(confirmationMessage) &&
      action({ reqId: id }).then((data) => {
        toast.info(data);
        refetch();
      });
  };

  const renderCell = useCallback(
    (request: IAllRequest, columnKey: React.Key) => {
      const cellValue = request[columnKey as keyof IAllRequest];

      switch (columnKey) {
        case "description":
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-widest">
                {request.requestSupply}
              </span>
              <span className="text-xs text-gray-400 tracking-tight">
                {request.supplyCategory}
              </span>
            </div>
          );
        case "project":
          return (
            <span className="font-semibold text-xs tracking-widest">
              {request.projectName}
            </span>
          );

        case "quantity":
          return (
            <span
              className={`text-xs text-center font-bold tracking-tight ${
                request.quantityRequested === 0 ? "text-danger" : ""
              }`}
            >
              {request.quantityRequested}
            </span>
          );

        case "qoh":
          return (
            <span
              className={`text-xs text-center font-bold tracking-tight ${
                request.qoh === 0 ||
                (request.qoh < request.quantityRequested &&
                  request.status === "OnReview")
                  ? "text-danger"
                  : ""
              }`}
            >
              {request.qoh}
            </span>
          );

        case "timestamps":
          return (
            <div className="flex flex-col ">
              <span className="font-semibold tracking-widest">
                Submitted At:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {request.submittedAt}
                </span>
              </span>
              <span className="font-semibold tracking-widest">
                Reviwed At:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {request.reviewedAt}
                </span>
              </span>
            </div>
          );
        case "user":
          return (
            <div className="flex flex-col ">
              <span className="font-semibold tracking-widest">
                Submitted By:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {request.submittedBy}
                </span>
              </span>
              <span className="font-semibold tracking-widest">
                Reviwed By:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {request.reviewedBy}
                </span>
              </span>
            </div>
          );
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
            request.status !== "OnReview" || // The status is "OnReview"
            request.qoh <= 0 || // The available quantity on hand is less than or equal to 0
            request.qoh < request.quantityRequested // The available quantity is less than the requested quantity
          ) {
            // Disable dropdown or return null if requested quantity exceeds available quantity
            return null; // You can return null to hide the dropdown or use a message to indicate insufficient stock
          }

          // If the conditions above aren't met, render the dropdown
          return (
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <BiDotsVertical className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="shadow">
                <DropdownItem
                  color="success"
                  startContent={
                    <CheckIcon className={cn(iconClasses, "text-success")} />
                  }
                  onClick={() => {
                    handleRequestAction(
                      approveRequest.mutateAsync,
                      [request.reqId],
                      "Are you sure you want to approve this request?"
                    );
                  }}
                >
                  Approve
                </DropdownItem>
                <DropdownItem
                  color="warning"
                  startContent={
                    <RxCross2 className={cn(iconClasses, "text-warning")} />
                  }
                  onClick={() => {
                    handleRequestAction(
                      declineRequest.mutateAsync,
                      [request.reqId],
                      "Are you sure you want to decline this request?"
                    );
                  }}
                >
                  Decline
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    handleDeleteRequest(request.reqId);
                  }}
                  color="danger"
                  className="text-danger"
                  startContent={
                    <MdOutlineDeleteForever
                      className={cn(iconClasses, "text-danger")}
                    />
                  }
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    [isSelectMany]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search..."
            size="sm"
            startContent={<CiSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onChange={(e) => setFilterValue(e.target.value)}
          />
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
                    handleRequestAction(
                      approveRequest.mutateAsync,
                      selectedKeys === "all"
                        ? requestIds
                        : Array.from(selectedKeys).map((key) => Number(key)),
                      "Are you sure you want to approve all this requests?"
                    );
                  }}
                >
                  Approve
                </DropdownItem>
                <DropdownItem
                  color="warning"
                  startContent={
                    <RxCross2 className={cn(iconClasses, "text-warning")} />
                  }
                  onClick={() => {
                    handleRequestAction(
                      declineRequest.mutateAsync,
                      selectedKeys === "all"
                        ? requestIds
                        : Array.from(selectedKeys).map((key) => Number(key)),
                      "Are you sure you want to decline all this requests?"
                    );
                  }}
                >
                  Decline
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
              : `Total Selected: ${selectedKeys.size} of ${filteredItems.length} selected`}{" "}
          </span>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    onSearchChange,
    requestsLength,
    filterValue,
    isSelectMany,
    setIsSelectMany,
    requestsLength,
  ]);

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
          <div className="min-w-full gap-2">
            <Table
              aria-label="Requests Table"
              isHeaderSticky
              removeWrapper
              disabledKeys={reviewedRequests?.toString()}
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
              <TableHeader columns={requisition_columns}>
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
                emptyContent={"No request found"}
                isLoading={isLoading}
                items={filteredItems}
                loadingContent={
                  <Spinner color="warning">Loading Request...</Spinner>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestSupply;
