import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  SortDescriptor,
  cn,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { BiDotsVertical } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { capitalize } from "../../../lib/utils/utils";
import { getAllInstaller } from "../../../lib/API/UsersApi";
import {
  iconClasses,
  INITIAL_INSTALLER_VISIBLE_COLUMNS,
  installer_columns,
  InstallerTableProps,
  statusColorMap,
  statusOptions,
} from "../../../lib/utils/usersTable";
import { MdOutlineDeleteForever } from "react-icons/md";
import InstallerActionModal from "../modal/InstallerActionModal";
import AddInstaller from "../modal/AddInstaller";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const InstallerTable = () => {
  const { data: installers, isLoading, error, refetch } = getAllInstaller();
  const installerLength = installers ? installers.length : 0;

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_INSTALLER_VISIBLE_COLUMNS)
  );

  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const pages = useMemo(
    () => Math.ceil(installerLength / rowsPerPage),
    [installerLength, rowsPerPage]
  );

  const hasSearchFilter = Boolean(filterValue);
  // Update visibleColumns when role changes
  useEffect(() => {
    setRowsPerPage(5);
    setPage(1); // Reset page to 1
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return installer_columns;

    return installer_columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, installer_columns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = installers ?? [];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.assignedProj.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [installers, filterValue, statusFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort(
      (a: InstallerTableProps, b: InstallerTableProps) => {
        const first = a[
          sortDescriptor.column as keyof InstallerTableProps
        ] as string;
        const second = b[
          sortDescriptor.column as keyof InstallerTableProps
        ] as string;

        if (first === undefined)
          return sortDescriptor.direction === "descending" ? 1 : -1;
        if (second === undefined)
          return sortDescriptor.direction === "descending" ? -1 : 1;

        const cmp = first.localeCompare(second);

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    );
  }, [sortDescriptor, filteredItems]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const {
    isOpen: actionIsOpen,
    onOpen: actionOnOpen,
    onClose: actionOnClose,
  } = useDisclosure();

  const {
    isOpen: addIsOpen,
    onOpen: addOnOpen,
    onClose: addOnClose,
  } = useDisclosure();

  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [installerId, setInstallerId] = useState<number>(0);
  const [installerName, setInstallerName] = useState<string>("");
  const [action, setAction] = useState<string>("");

  const handleDropdownActionItemClick = (
    installerId: number,
    installerName: string,
    action: string
  ) => {
    setInstallerId(installerId);
    setInstallerName(installerName);
    setAction(action);
    actionOnOpen();
  };

  const renderCell = useCallback(
    (installer: InstallerTableProps, columnKey: React.Key) => {
      const cellValue = installer[columnKey as keyof InstallerTableProps];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <span className="font-semibold tracking-widest">
                {installer.name}
              </span>
              <span className="text-xs text-gray-400 tracking-tight">
                {installer.position}
              </span>
            </div>
          );

        case "project":
          return installer.assignedProj;

        case "creator":
          return installer.adminEmail;

        case "timestamps":
          return (
            <div className="flex flex-col ">
              <span className="font-semibold tracking-widest">
                Created:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {installer.createdAt}
                </span>
              </span>
              <span className="font-semibold tracking-widest">
                Updated:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {installer.updatedAt}
                </span>
              </span>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[installer.status]}
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
          );

        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <BiDotsVertical className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu variant="shadow">
                  {installer.status === "Active" ? (
                    <DropdownItem
                      onClick={() =>
                        handleDropdownActionItemClick(
                          installer.installerId,
                          installer.name,
                          "Suspend"
                        )
                      }
                      key={installer.installerId}
                      className="text-warning"
                      color="warning"
                    >
                      Suspend
                    </DropdownItem>
                  ) : installer.status === "Suspended" ? (
                    <DropdownItem
                      onClick={() =>
                        handleDropdownActionItemClick(
                          installer.installerId,
                          installer.name,
                          "Activate"
                        )
                      }
                      key={installer.installerId}
                      className="text-primary"
                      color="primary"
                    >
                      Activate
                    </DropdownItem>
                  ) : (
                    <DropdownItem className="hidden"></DropdownItem>
                  )}
                  {installer.status !== "OnWork" &&
                  installer.status !== "InActive" ? (
                    <DropdownItem
                      onClick={() =>
                        handleDropdownActionItemClick(
                          installer.installerId,
                          installer.name,
                          "Delete"
                        )
                      }
                      key={installer.installerId}
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
                  ) : (
                    <DropdownItem className="hidden"></DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>

              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <FaInfoCircle className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="shadow"
                  items={installer.assignedProjects}
                >
                  {(item) => (
                    <DropdownItem key={item.projId}>
                      <Link to={`/project/${item.projId}`}>{item.projId}</Link>
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return cellValue;
      }
    },
    []
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

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
            placeholder="Search by name..."
            size="sm"
            startContent={<CiSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<FaChevronDown className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<FaChevronDown className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {installer_columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-orange-500 text-background"
              endContent={<FaPlus />}
              size="sm"
              onClick={() => addOnOpen()}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {installerLength} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    installerLength,
    hasSearchFilter,
    rowsPerPage,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          loop
          showControls
          classNames={{
            cursor: "bg-orange-400 text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
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

  const disabledInstallers = items
    ?.filter(
      (installer) =>
        installer.status === "InActive" || installer.status === "OnWork"
    )
    .map((row) => row.installerId)
    .toString();

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className=" min-w-full">
            <Table
              aria-label="Installer Table"
              disabledKeys={disabledInstallers}
              isCompact
              removeWrapper
              bottomContent={bottomContent}
              bottomContentPlacement="outside"
              checkboxesProps={{
                classNames: {
                  wrapper:
                    "after:bg-orange-400 after:text-background text-background",
                },
              }}
              classNames={classNames}
              selectedKeys={selectedKeys}
              selectionMode="single"
              sortDescriptor={sortDescriptor}
              topContent={topContent}
              topContentPlacement="outside"
              onSelectionChange={setSelectedKeys}
              onSortChange={setSortDescriptor}
            >
              <TableHeader columns={headerColumns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                    allowsSorting={column.sortable}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent={"No personnel found"}
                items={items}
                loadingContent={
                  <Spinner color="warning">Loading Installer...</Spinner>
                }
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
      <InstallerActionModal
        action={action}
        installerId={installerId}
        installerName={installerName}
        isOpen={actionIsOpen}
        onClose={actionOnClose}
        refetch={refetch}
      />

      <AddInstaller isOpen={addIsOpen} onClose={addOnClose} refetch={refetch} />
    </div>
  );
};

export default InstallerTable;
