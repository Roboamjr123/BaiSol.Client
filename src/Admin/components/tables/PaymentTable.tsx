import React, { useCallback, useMemo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";

import {
  getAllPayment,
  IAllPayment,
} from "../../../lib/API/Project/PaymentAPI";
import {
  payment_columns,
  paymentStatusColorMap,
} from "../../../lib/utils/paymentTable";
import {
  Button,
  Chip,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { BiDotsVertical } from "react-icons/bi";
import { iconClasses } from "../../../lib/utils/usersTable";
import { CiSearch } from "react-icons/ci";

const PaymentTable = () => {
  const { data: payments, isLoading, refetch } = getAllPayment();
  const paymentLength = payments ? payments.length : 0;

  const [paymentInfo, setPaymentInfo] = useState<IAllPayment>();

  const [filterValue, setFilterValue] = useState("");
  const filteredItems = useMemo(() => {
    let filteredMaterials = payments ?? [];

    filteredMaterials = filteredMaterials.filter(
      (payment) =>
        payment.referenceNumber
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        payment.acknowledgedBy
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        payment.projName.toLowerCase().includes(filterValue.toLowerCase()) ||
        payment.billingEmail
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        payment.billingName.toLowerCase().includes(filterValue.toLowerCase()) ||
        payment.billingPhone
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        payment.projId.toLowerCase().includes(filterValue.toLowerCase())
    );

    return filteredMaterials;
  }, [payments, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = useCallback(
    (payment: IAllPayment, columnKey: React.Key) => {
      const cellValue = payment[columnKey as keyof IAllPayment];

      switch (columnKey) {
        case "reference":
          return (
            <div className="flex flex-row gap-2">
              <span className="">{payment.referenceNumber}</span>
              <Chip
                className="capitalize border-none gap-1"
                color={paymentStatusColorMap[payment.status]}
                size="sm"
                variant="flat"
              >
                {payment.status}
              </Chip>
            </div>
          );
        case "amount":
          return <div>₱ {payment.amount}</div>;
        case "created date":
          return <div>{payment.createdAt}</div>;
        case "description":
          return <div>{payment.description}</div>;
        case "projName":
          return <div>{payment.projName}</div>;
        case "action":
          return (
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <BiDotsVertical className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="shadow">
                <DropdownItem
                  color="primary"
                  startContent={
                    <BsThreeDots className={cn(iconClasses, "text-default")} />
                  }
                >
                  View Details
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );

        default:
          return cellValue;
      }
    },
    []
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
        </div>
        <div className="flex justify-between items-start">
          <span className="text-default-400 text-small">
            Total {paymentLength} payments
          </span>
        </div>
      </div>
    );
  }, [onSearchChange, paymentLength, filterValue]);

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
            <Table
              aria-label="Materials Table"
              isHeaderSticky
              removeWrapper
              classNames={classNamesDesign}
              topContent={topContent}
              topContentPlacement="outside"
            >
              <TableHeader columns={payment_columns}>
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
                emptyContent={"No equipment found"}
                isLoading={isLoading}
                items={filteredItems}
                loadingContent={<Spinner color="warning">Loading...</Spinner>}
              >
                {(item) => (
                  <TableRow key={item.referenceNumber}>
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

export default PaymentTable;
