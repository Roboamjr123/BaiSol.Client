import React, { useCallback, useMemo, useState } from "react";
import { getAllMaterials, IAllMaterials } from "../../../lib/API/MaterialAPI";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { BiDotsVertical } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { material_columns } from "../../../lib/utils/supplyTable";
import AddMaterial from "../modal/material/AddMaterial";
import { table } from "console";

const MaterialTable = () => {
  const { data: materials, isLoading, refetch } = getAllMaterials();
  const materiaLength = materials ? materials.length : 0;

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredMaterials = materials ?? [];

    if (hasSearchFilter) {
      filteredMaterials = filteredMaterials.filter(
        (user) =>
          user.mtlCode.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.mtlDescript.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.mtlCtgry.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredMaterials;
  }, [materials, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = useCallback(
    (material: IAllMaterials, columnKey: React.Key) => {
      const cellValue = material[columnKey as keyof IAllMaterials];

      switch (columnKey) {
        case "description":
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-widest">
                {material.mtlCode}
              </span>
              <span className="text-xs text-gray-400 tracking-tight">
                {material.mtlDescript}
              </span>
              <span className="text-xs text-gray-400 tracking-tight">
                {material.mtlCtgry}
              </span>
            </div>
          );
        case "quantity":
          return material.mtlqoh;
        case "unit":
          return material.mtlUnit;
        case "timestamps":
          return (
            <div className="flex flex-col ">
              <span className="font-semibold tracking-widest">
                Created:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {material.createdAt}
                </span>
              </span>
              <span className="font-semibold tracking-widest">
                Updated:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {material.updatedAt}
                </span>
              </span>
            </div>
          );
        case "actions":
          return (
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <BiDotsVertical className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="shadow">
                <DropdownItem>Edit</DropdownItem>
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

          <Dropdown className="bg-background border-1 border-default-200">
            <DropdownTrigger>
              <Button
                className="bg-orange-500 text-background"
                endContent={<FaPlus />}
                size="sm"
              >
                Add Material
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="shadow">
              <DropdownItem onClick={() => addOnOpen()}>New</DropdownItem>
              <DropdownItem onClick={() => addExistOnOpen()}>Exist</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-default-400 text-small">
            Total {materiaLength} material
          </span>
        </div>
      </div>
    );
  }, [onSearchChange, materiaLength, filterValue]);

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

  const {
    isOpen: addIsOpen,
    onOpen: addOnOpen,
    onClose: addOnClose,
  } = useDisclosure();
  const {
    isOpen: addExistIsOpen,
    onOpen: addExistOnOpen,
    onClose: addExistOnClose,
  } = useDisclosure();

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
              selectedKeys={selectedKeys}
              selectionMode="single"
              topContent={topContent}
              topContentPlacement="outside"
              onSelectionChange={setSelectedKeys}
            >
              <TableHeader columns={material_columns}>
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
                emptyContent={"No personnel found"}
                items={filteredItems}
                loadingContent={
                  <Spinner color="warning">Loading Installer...</Spinner>
                }
              >
                {(item) => (
                  <TableRow key={item.mtlId}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <AddMaterial
            isOpen={addIsOpen}
            onClose={addOnClose}
            refetch={refetch}
          />
          <AddMaterial
            isExistCategory={true}
            isOpen={addExistIsOpen}
            onClose={addExistOnClose}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialTable;
