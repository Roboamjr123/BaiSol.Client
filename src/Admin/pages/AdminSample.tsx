import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    User,
    Chip,
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    Input,
    Selection,
    SortDescriptor,
    Pagination,
  } from "@nextui-org/react";
  import { getAllAdminUsers } from "../../lib/API/UsersApi";
  import { BiDotsVertical } from "react-icons/bi";
  import { CiSearch } from "react-icons/ci";
  import { FaChevronDown } from "react-icons/fa6";
  import { FaPlus } from "react-icons/fa6";
  import { useMemo, useState } from "react";
  import Loader from "../../main/components/Loader";
  
  const columns = [
    { name: "NAME", uid: "userName", sortable: true },
    { name: "CREATOR", uid: "adminEmail" },
    { name: "STATUS", uid: "isActive", sortable: true },
    { name: "TIMESTAMPS", uid: "updatedAt" },
    { name: "ACTIONS", uid: "actions" },
  ];
  
  const AdminTable = () => {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [statusFilter, setStatusFilter] = useState<boolean[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<{
      column: string;
      direction: "ascending" | "descending" | undefined;
    }>({
      column: "updatedAt",
      direction: "ascending",
    });
    const [page, setPage] = useState(1);
  
    const { data: adminUsers, isLoading, error } = getAllAdminUsers();
    const totalLength = adminUsers ? adminUsers.length : 0;
  
    const handleSortChange = (column: string) => {
      setSortDescriptor((prevDescriptor) => ({
        column,
        direction:
          prevDescriptor.column === column &&
          prevDescriptor.direction === "ascending"
            ? "descending"
            : "ascending",
      }));
    };
  
    const filteredItems = useMemo(() => {
      let filteredUsers = adminUsers ?? [];
  
      if (filterValue) {
        filteredUsers = filteredUsers.filter((user) =>
          user.userName.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
  
      if (statusFilter.length > 0) {
        filteredUsers = filteredUsers.filter((user) =>
          statusFilter.includes(user.isActive)
        );
      }
  
      return filteredUsers;
    }, [adminUsers, filterValue, statusFilter]);
  
    const sortedItems = useMemo(() => {
      const { column, direction } = sortDescriptor;
      return [...filteredItems].sort((a, b) => {
        const first = a[column as keyof typeof a] ?? ""; // Default to empty string if null
        const second = b[column as keyof typeof b] ?? ""; // Default to empty string if null
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return direction === "descending" ? -cmp : cmp;
      });
    }, [filteredItems, sortDescriptor]);
  
    const paginatedItems = useMemo(() => {
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return sortedItems.slice(startIndex, endIndex);
    }, [sortedItems, page, rowsPerPage]);
  
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    };
  
    const handleSearchChange = (value: string) => {
      setFilterValue(value);
      setPage(1);
    };
  
    const handleStatusFilterChange = (selected: boolean[]) => {
      setStatusFilter(selected);
      setPage(1);
    };
  
    const handlePageChange = (newPage: number) => {
      setPage(newPage);
    };
  
    const pages = Math.ceil(totalLength / rowsPerPage);
  
    if (isLoading) {
      return <Loader />;
    }
  
    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl tracking-wide text-orange-500 bg-orange-100 p-4 rounded-md">
            Oops! Something went wrong:{" "}
            <span className="font-bold">{error.message}</span>
          </p>
        </div>
      );
    }
  
    const topContent = (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="max-w-[44%]"
            placeholder="Search by Name..."
            size="sm"
            startContent={<CiSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={handleSearchChange}
          />
          <div className="flex gap-3">
            <Button
              className="bg-orange-400 text-background"
              endContent={<FaPlus />}
              size="sm"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalLength} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={handleChangeRowsPerPage}
              value={rowsPerPage}
            >
              {[5, 10, 15].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  
    const bottomContent = (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-orange-400 text-background",
          }}
          color="default"
          isDisabled={isLoading}
          page={page}
          total={pages}
          variant="light"
          onChange={handlePageChange}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${totalLength} selected`}
        </span>
      </div>
    );
    return (
      <div>
        <Table
          isCompact
          removeWrapper
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContentPlacement="outside"
          bottomContent={bottomContent}
          selectionMode="multiple"
          topContentPlacement="outside"
          topContent={topContent}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          // sortDescriptor={sortDescriptor}
          // onSortChange={setSortDescriptor}
          checkboxesProps={{
            classNames: {
              wrapper:
                "after:bg-orange-400 after:text-background text-background",
            },
          }}
          classNames={{
            wrapper: "max-h-[382px] max-w-3xl",
            th: "bg-transparent text-default-500 border-b border-divider",
            td: `
        group-data-[first=true]:first:before:rounded-none
        group-data-[first=true]:last:before:rounded-none
        group-data-[middle=true]:before:rounded-none
        group-data-[last=true]:first:before:rounded-none
        group-data-[last=true]:las t:before:rounded-none
      `,
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                allowsSorting={column.sortable}
                align={column.uid === "isActive" ? "center" : "start"}
                onClick={() => handleSortChange(column.uid)}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent="No admin users found!" items={paginatedItems}>
            {(admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-widest">
                      {admin.userName}
                    </span>
                    <span className="text-xs text-gray-400 tracking-tight">
                      {admin.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{admin.adminEmail}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <Chip
                      className="capitalize border-none gap-1 text-default-600"
                      variant="dot"
                      color={admin.isActive ? "success" : "danger"}
                      size="sm"
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </Chip>
                    {admin.isSuspend && (
                      <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        variant="dot"
                        color="warning"
                        size="sm"
                      >
                        Suspended
                      </Chip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col ">
                    <span className="font-semibold tracking-widest">
                      Created:{" "}
                      <span className="text-xs text-gray-400 tracking-tight">
                        {admin.createdAt}
                      </span>
                    </span>
                    <span className="font-semibold tracking-widest">
                      Updated:{" "}
                      <span className="text-xs text-gray-400 tracking-tight">
                        {admin.updatedAt}
                      </span>
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative flex justify-end items-center gap-2">
                    <Dropdown className="bg-background border-1 border-default-200">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <BiDotsVertical className="text-default-400" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem>View</DropdownItem>
                        <DropdownItem>Edit</DropdownItem>
                        <DropdownItem>Delete</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default AdminTable;
  