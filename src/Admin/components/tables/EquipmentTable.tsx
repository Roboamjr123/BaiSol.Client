import React, { useCallback, useMemo, useState } from "react";
import {
  getAllEquipment,
  IAllEquipment,
  useDeleteEquipment,
} from "../../../lib/API/EquipmentAPI";
import {
  Button,
  cn,
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
import { FaEdit, FaPlus } from "react-icons/fa";
import { supply_columns } from "../../../lib/utils/supplyTable";
import { formatNumber } from "../../../lib/utils/utils";
import { iconClasses } from "../../../lib/utils/usersTable";
import {
  MdOutlineDeleteForever,
  MdOutlineHistory,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { toast } from "react-toastify";
import AddSupply from "../modal/supply/AddSupply";
import EditSupply from "../modal/supply/EditSupply";
import AddQuantitySupply from "../modal/supply/AddQuantitySupply";
// import ItemLogs from "../logs/ItemLogs";

const defaultEquipment: IAllEquipment = {
  eqptId: 0,
  eqptCode: "",
  eqptDescript: "",
  eqptCtgry: "",
  eqptPrice: 0.0,
  eqptqoh: 0,
  eqptUnit: "",
  eqptStatus: "New", // example default status
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

const EquipmentTable = () => {
  const deleteEquipment = useDeleteEquipment();
  const { data: equipment, isLoading, refetch } = getAllEquipment();
  const equipmentLength = equipment ? equipment.length : 0;

  const [equipmentData, setEquipmentData] =
    useState<IAllEquipment>(defaultEquipment);

  const [logEquipmentId, setLogEquipmentId] = useState<string>("");
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredMaterials = equipment ?? [];

    if (hasSearchFilter) {
      filteredMaterials = filteredMaterials.filter(
        (user) =>
          user.eqptCode.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.eqptDescript.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.eqptCtgry.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredMaterials;
  }, [equipment, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

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

  const {
    isOpen: logIsOpen,
    onOpen: logOnOpen,
    onClose: logOnClose,
  } = useDisclosure();

  const {
    isOpen: addQOHIsOpen,
    onOpen: addQOHOnOpen,
    onClose: addQOHOnClose,
  } = useDisclosure();

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();

  const handleDeleteMaterial = (id: number) => {
    if (window.confirm("Click Ok to delete this equipment.")) {
      deleteEquipment.mutateAsync(
        { eqptId: id },
        {
          onSuccess: (data) => {
            toast.info(data);
            refetch();
          },
        }
      );
    }
  };

  const handleEditMaterial = (equipment: IAllEquipment) => {
    setEquipmentData(equipment);

    editOnOpen();
  };

  const handleAddQOHEquipment = (equipment: IAllEquipment) => {
    setEquipmentData(equipment);

    addQOHOnOpen();
  };

  const handleLogOpen = (id: string) => {
    setLogEquipmentId(id);

    logOnOpen();
  };

  const renderCell = useCallback(
    (equipment: IAllEquipment, columnKey: React.Key) => {
      const cellValue = equipment[columnKey as keyof IAllEquipment];

      switch (columnKey) {
        case "description":
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-widest">
                {equipment.eqptDescript}
              </span>
              <span className="text-xs text-gray-500 tracking-tight">
                {equipment.eqptCtgry}
              </span>
              {/* <span className="text-xs text-gray-400 tracking-tight">
                {equipment.eqptCode}
              </span> */}
            </div>
          );
        case "price":
          return (
            <span className="font-semibold tracking-widest">
              ₱ {formatNumber(equipment.eqptPrice)}
            </span>
          );
        case "quantity":
          return equipment.eqptqoh;
        case "unit":
          return equipment.eqptUnit;
        case "timestamps":
          return (
            <div className="flex flex-col ">
              <span className="font-semibold tracking-widest">
                Created:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {equipment.createdAt}
                </span>
              </span>
              <span className="font-semibold tracking-widest">
                Updated:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {equipment.updatedAt}
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
                <DropdownItem
                  onClick={() => {
                    handleEditMaterial(equipment);
                  }}
                  color="primary"
                  startContent={
                    <FaEdit className={cn(iconClasses, "text-primary")} />
                  }
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  color="success"
                  onClick={() => {
                    handleAddQOHEquipment(equipment);
                  }}
                  startContent={
                    <MdOutlineProductionQuantityLimits
                      className={cn(iconClasses, "text-success")}
                    />
                  }
                >
                  Add Quantity
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleDeleteMaterial(equipment.eqptId)}
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
                <DropdownItem
                  startContent={
                    <MdOutlineHistory
                      className={cn(iconClasses, "text-default")}
                    />
                  }
                  onClick={() => {
                    handleLogOpen(String(equipment.eqptId));
                  }}
                >
                  History
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

          <Button
            className="bg-orange-500 text-background"
            endContent={<FaPlus />}
            size="sm"
            onClick={() => addOnOpen()}
          >
            Add Equipment
          </Button>

          {/* <Dropdown className="bg-background border-1 border-default-200">
            <DropdownTrigger>
              <Button
                className="bg-orange-500 text-background"
                endContent={<FaPlus />}
                size="sm"
              >
                Add Equipment
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="shadow">
              <DropdownItem onClick={() => addOnOpen()}>New</DropdownItem>
              <DropdownItem onClick={() => addExistOnOpen()}>
                Exist
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
        </div>
        <div className="flex justify-between items-start">
          <span className="text-default-400 text-small">
            Total {equipmentLength} equipment
          </span>
        </div>
      </div>
    );
  }, [onSearchChange, equipmentLength, filterValue]);

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
              selectedKeys={selectedKeys}
              selectionMode="single"
              topContent={topContent}
              topContentPlacement="outside"
              onSelectionChange={setSelectedKeys}
            >
              <TableHeader columns={supply_columns}>
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
                loadingContent={
                  <Spinner color="warning">Loading Material...</Spinner>
                }
              >
                {(item) => (
                  <TableRow key={item.eqptId}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <EditSupply
            prevSupply={equipmentData!}
            isMaterial={false}
            isOpen={editIsOpen}
            onClose={editOnClose}
            refetch={refetch}
          />

          <AddSupply
            isMaterial={false}
            isOpen={addIsOpen}
            onClose={addOnClose}
            refetch={refetch}
          />
          <AddSupply
            isExistCategory={true}
            isMaterial={false}
            isOpen={addExistIsOpen}
            onClose={addExistOnClose}
            refetch={refetch}
          />
          <AddQuantitySupply
            prevSupply={equipmentData!}
            isMaterial={false}
            isOpen={addQOHIsOpen}
            onClose={addQOHOnClose}
            refetch={refetch}
          />

          {/* <ItemLogs
            id={logEquipmentId}
            isOpen={logIsOpen}
            onClose={logOnClose}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default EquipmentTable;
