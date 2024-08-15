import React, { useCallback, useMemo, useState } from "react";
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
} from "@nextui-org/react";
import { BiDotsVertical } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { capitalize } from "../../pages/utils";
import {
  INITIAL_VISIBLE_COLUMNS,
  UserTableProps,
  columns,
  iconClasses,
  statusColorMap,
  statusOptions,
} from "../../../lib/utils/usersTable";
import { MdOutlineDeleteForever } from "react-icons/md";
import { getAllFacilitatorUsers } from "../../../lib/API/UsersApi";
import UserActionModal from "../modal/UserActionModal";
import RegisterPersonnelUserModal from "../modal/RegisterPersonnelUserModal";

const FacilitatorUsersTable = () => {
  const {
    data: facilitatorUsers,
    isLoading,
    error,
    refetch,
  } = getAllFacilitatorUsers();
  const facilitatorLength = facilitatorUsers ? facilitatorUsers.length : 0;

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const pages = Math.ceil(facilitatorLength / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = facilitatorUsers ?? [];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.userName.toLowerCase().includes(filterValue.toLowerCase())
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
  }, [facilitatorUsers, filterValue, statusFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: UserTableProps, b: UserTableProps) => {
      const first = a[sortDescriptor.column as keyof UserTableProps] as string;
      const second = b[sortDescriptor.column as keyof UserTableProps] as string;

      if (first === undefined)
        return sortDescriptor.direction === "descending" ? 1 : -1;
      if (second === undefined)
        return sortDescriptor.direction === "descending" ? -1 : 1;

      const cmp = first.localeCompare(second);

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  // Get all inactive facilitator users
  const inactiveFacilitatorIds = useMemo(() => {
    return (
      facilitatorUsers
        ?.filter((user) => user.status === "InActive")
        .map((user) => user.id) || []
    );
  }, [facilitatorUsers]);

  const {
    isOpen: isOpenAction,
    onOpen: onOpenAction,
    onClose: onCloseAction,
  } = useDisclosure();

  const {
    isOpen: isOpenNewFacilitator,
    onOpen: onOpenNewFacilitator,
    onClose: onCloseNewFacilitator,
  } = useDisclosure();

  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [action, setAction] = useState<string>("");

  const handleDropdownItemClick = (
    userId: string,
    userEmail: string,
    action: string
  ) => {
    setUserId(userId);
    setUserEmail(userEmail);
    setAction(action);
    onOpenAction();
  };

  const handleAddNewFacilitatorClick = () => {
    onOpenNewFacilitator();
  };

  const renderCell = useCallback((user: UserTableProps, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof UserTableProps];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <span className="font-semibold tracking-widest">
              {user.userName}
            </span>
            <span className="text-xs text-gray-400 tracking-tight">
              {user.email}
            </span>
          </div>
        );
      case "creator":
        return user.adminEmail;
      case "timestamps":
        return (
          <div className="flex flex-col ">
            <span className="font-semibold tracking-widest">
              Created:{" "}
              <span className="text-xs text-gray-400 tracking-tight">
                {user.createdAt}
              </span>
            </span>
            <span className="font-semibold tracking-widest">
              Updated:{" "}
              <span className="text-xs text-gray-400 tracking-tight">
                {user.updatedAt}
              </span>
            </span>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[user.status]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            {user.status !== "InActive" ? (
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <BiDotsVertical className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu variant="shadow">
                  {user.status === "Active" ? (
                    <DropdownItem
                      onClick={() =>
                        handleDropdownItemClick(user.id, user.email, "Suspend")
                      }
                      key={user.id}
                      className="text-warning"
                      color="warning"
                    >
                      Suspend
                    </DropdownItem>
                  ) : user.status === "Suspended" ? (
                    <DropdownItem
                      onClick={() =>
                        handleDropdownItemClick(user.id, user.email, "Activate")
                      }
                      key={user.id}
                      className="text-primary"
                      color="primary"
                    >
                      Activate
                    </DropdownItem>
                  ) : (
                    <DropdownItem></DropdownItem>
                  )}
                  {user.status !== "InActive" ? (
                    <DropdownItem
                      onClick={() =>
                        handleDropdownItemClick(user.id, user.email, "Delete")
                      }
                      key={user.id}
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
                    <DropdownItem></DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            ) : (
              ""
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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
                {columns.map((column) => (
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
              onClick={() => handleAddNewFacilitatorClick()}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {facilitatorLength} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
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
    facilitatorLength,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
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
      // td: [
      //   // changing the rows border radius
      //   // first
      //   "group-data-[first=true]:first:before:rounded-none",
      //   "group-data-[first=true]:last:before:rounded-none",
      //   // middle
      //   "group-data-[middle=true]:before:rounded-none",
      //   // last
      //   "group-data-[last=true]:first:before:rounded-none",
      //   "group-data-[last=true]:last:before:rounded-none",
      // ],
    }),
    []
  );

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100">
          <div className=" min-w-full">
            <Table
              isCompact
              removeWrapper
              aria-label="Example table with custom cells, pagination and sorting"
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
              disabledKeys={inactiveFacilitatorIds}
              className="min-w-max"
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
                emptyContent={"No users found"}
                items={items}
                loadingContent={"Loading users..."}
                isLoading={isLoading}
                aria-errormessage={error?.message}
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

      <RegisterPersonnelUserModal
        isOpen={isOpenNewFacilitator}
        onClose={onCloseNewFacilitator}
        refetch={refetch}
        role="Facilitator"
      />

      <UserActionModal
        isOpen={isOpenAction}
        onClose={onCloseAction}
        userId={userId}
        email={userEmail}
        action={action}
        refetch={refetch}
      />
    </div>
  );
};
export default FacilitatorUsersTable;
