import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner,
} from "@nextui-org/react";
import {
  getAvailableFacilitators,
  IAvailableFacilitators,
} from "../../../lib/API/PersonnelAPI";
import React, { useCallback, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";

const AvailableFacilitatorTable = () => {
  const allFacilitators = getAvailableFacilitators();

  const [filterValue, setFilterValue] = useState("");

  const filteredItems = useMemo(() => {
    let filteredFacilitator = allFacilitators.data ?? [];

    filteredFacilitator = filteredFacilitator.filter(
      (fac) =>
        fac.userName.toLowerCase().includes(filterValue.toLowerCase()) ||
        fac.email.toLowerCase().includes(filterValue.toLowerCase())
    );

    return filteredFacilitator;
  }, [allFacilitators.data, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<CiSearch className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        />
      </div>
    );
  }, [filterValue, onSearchChange]);

  const renderCell = useCallback(
    (fac: IAvailableFacilitators, columnKey: React.Key) => {
      const cellValue = fac[columnKey as keyof IAvailableFacilitators];

      switch (columnKey) {
        case "facilitator":
          return (
            <div className="flex flex-col">
              <span className="font-semibold tracking-widest">
                {fac.userName}
              </span>
              <span className="text-xs text-gray-400 tracking-tight">
                {fac.email}
              </span>
            </div>
          );

        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className=" min-w-full">
            <Table
              isHeaderSticky
              aria-label="Available Facilitators"
              classNames={{ base: "overflow-scroll", th: "bg-transparent" }}
              topContent={topContent}
              selectionMode="single"
            >
              <TableHeader>
                <TableColumn key="facilitator">
                  Available Facilitators
                </TableColumn>
              </TableHeader>
              <TableBody
                isLoading={allFacilitators.isLoading}
                loadingContent={
                  <Spinner color="warning">Loading facilitators...</Spinner>
                }
                items={filteredItems}
              >
                {(item) => (
                  <TableRow key={item.id}>
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

export default AvailableFacilitatorTable;
