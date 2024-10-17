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
  getAvailableInstallers,
  IAvailableInstallers,
} from "../../../lib/API/PersonnelAPI";
import React, { useCallback, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";

const AvailableInstrallerTable = () => {
  const allInstallers = getAvailableInstallers();

  const [filterValue, setFilterValue] = useState("");

  const filteredItems = useMemo(() => {
    let filteredInstaller = allInstallers.data ?? [];

    filteredInstaller = filteredInstaller.filter((inst) =>
      inst.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    return filteredInstaller;
  }, [allInstallers.data, filterValue]);

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
    (inst: IAvailableInstallers, columnKey: React.Key) => {
      const cellValue = inst[columnKey as keyof IAvailableInstallers];

      switch (columnKey) {
        case "installer":
          return (
            <div className="flex flex-col">
              <span className="font-semibold tracking-widest">{inst.name}</span>
              <span className="text-xs text-gray-400 tracking-tight">
                {inst.position}
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
              isCompact
              aria-label="Available Installers"
              classNames={{
                // base: "overflow-scroll",
                th: ["bg-transparent", "border-divider"],
              }}
              checkboxesProps={{
                classNames: {
                  wrapper:
                    "after:bg-orange-400 after:text-background text-background",
                },
              }}
              topContent={topContent}
              selectionMode="multiple"
            
            >
              <TableHeader>
                <TableColumn key="installer">Available Installers</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={allInstallers.isLoading}
                loadingContent={
                  <Spinner color="warning">Loading...</Spinner>
                }
                items={filteredItems}
              >
                {(item) => (
                  <TableRow key={item.installerId}>
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

export default AvailableInstrallerTable;
