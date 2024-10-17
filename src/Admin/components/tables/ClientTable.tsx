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
  Spinner,
} from "@nextui-org/react";
import { BiDotsVertical } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { capitalize } from "../../../lib/utils/utils";
import { getAllClientUsers } from "../../../lib/API/Client/ClientApi";
import {
  client_columns,
  clientStatusColorMap,
  clientStatusOptions,
  ClientTableProps,
  INITIAL_CLIENT_VISIBLE_COLUMNS,
} from "../../../lib/utils/usersTable";
import { useApproveClientAccount } from "../../../lib/API/UsersApi";
import { toast } from "react-toastify";
import Loader from "../../../main/components/Loader";

const ClientTable = () => {
  const { data: clients, isLoading, error, refetch } = getAllClientUsers();
  const clientLength = clients ? clients.length : 0;
  const activateClient = useApproveClientAccount();

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_CLIENT_VISIBLE_COLUMNS)
  );

  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const pages = useMemo(
    () => Math.ceil(clientLength / rowsPerPage),
    [clientLength, rowsPerPage]
  );

  const hasSearchFilter = Boolean(filterValue);
  // Update visibleColumns when role changes
  useEffect(() => {
    setRowsPerPage(5);
    setPage(1); // Reset page to 1
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return client_columns;

    return client_columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, client_columns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = clients ?? [];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.userName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== clientStatusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [clients, filterValue, statusFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort(
      (a: ClientTableProps, b: ClientTableProps) => {
        const first = a[
          sortDescriptor.column as keyof ClientTableProps
        ] as string;
        const second = b[
          sortDescriptor.column as keyof ClientTableProps
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

  // const {
  //   isOpen: actionIsOpen,
  //   onOpen: actionOnOpen,
  //   onClose: actionOnClose,
  // } = useDisclosure();

  // const [clientId, setclientId] = useState<string>("");
  // const [clientName, setclientName] = useState<string>("");
  // const [action, setAction] = useState<string>("");

  // const {
  //   isOpen: addIsOpen,
  //   onOpen: addOnOpen,
  //   onClose: addOnClose,
  // } = useDisclosure();

  const handleDropdownActionItemClick = (clientId: string) => {
    // setclientId(clientId);
    // setclientName(clientName);
    // setAction(action);
    // actionOnOpen();
    if (
      window.confirm(
        "Are you sure you want to activate the client account? Press OK to confirm."
      )
    ) {
      activateClient.mutateAsync(clientId, {
        onSuccess: (mess) => {
          toast.success(mess);
          refetch();
        },
        onError: (error: any) => {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error(error.response.data.message);
          }
        },
      });
    }
  };

  const renderCell = useCallback(
    (client: ClientTableProps, columnKey: React.Key) => {
      const cellValue = client[columnKey as keyof ClientTableProps];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <span className="font-semibold tracking-widest">
                {client.userName}
              </span>
              <span className="text-xs text-gray-400 tracking-tight">
                {client.email}
              </span>
            </div>
          );

        case "project":
          return null; // TODO Add the client project here

        case "details":
          return (
            <div className="flex flex-col">
              <span className="font-semibold tracking-widest">
                {client.ClientContactNum}
              </span>
              <span className="text-xs text-gray-400 tracking-tight">
                {client.clientAddress}
              </span>
              <span className="text-xs text-gray-400 tracking-tight">
                {client.clientMonthlyElectricBill}
              </span>
            </div>
          );

        case "creator":
          return client.adminEmail;

        case "timestamps":
          return (
            <div className="flex flex-col ">
              <span className="font-semibold tracking-widest">
                Created:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {client.createdAt}
                </span>
              </span>
              <span className="font-semibold tracking-widest">
                Updated:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {client.updatedAt}
                </span>
              </span>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={clientStatusColorMap[client.status]}
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
                  <DropdownItem>View</DropdownItem>
                  {client.status === "Pending" ? (
                    <DropdownItem
                      onClick={() =>
                        handleDropdownActionItemClick(
                          client.id
                          // client.userName,
                          // "Activate"
                        )
                      }
                      key={client.id}
                      className="text-primary"
                      color="primary"
                    >
                      Activate
                    </DropdownItem>
                  ) : (
                    <DropdownItem className="hidden"></DropdownItem>
                  )}
                  {/* {client.status !== "InActive" ? (
                    <DropdownItem
                      onClick={() =>
                        handleDropdownActionItemClick(
                          client.id,
                          client.userName,
                          "Delete"
                        )
                      }
                      key={client.id}
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
                  )} */}
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
              <DropdownTrigger className="sm:flex">
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
                {clientStatusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className=" sm:flex">
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
                {client_columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* <Button
              className="bg-orange-500 text-background"
              endContent={<FaPlus />}
              size="sm"
              onClick={() => addOnOpen()}
            >
              Add New
            </Button> */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {clientLength} users
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
    clientLength,
    hasSearchFilter,
    rowsPerPage,
  ]);

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

  // const disabledClient = installers
  //   ?.filter(
  //     (installer) =>
  //       installer.status === "InActive" || installer.status === "OnWork"
  //   )
  //   .map((row) => row.installerId)
  //   .toString();

  if (activateClient.isPending) return <Loader label="Activating" />;

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className=" min-w-full">
            <Table
              aria-label="Installer Table"
              // disabledKeys={disabledClient}
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
                loadingContent={<Spinner color="warning">Loading...</Spinner>}
                isLoading={isLoading}
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
      {/* <InstallerActionModal
        action={action}
        installerId={installerId}
        installerName={installerName}
        isOpen={actionIsOpen}
        onClose={actionOnClose}
        refetch={refetch}
      />

      <AddInstaller isOpen={addIsOpen} onClose={addOnClose} refetch={refetch} /> */}
    </div>
  );
};

export default ClientTable;
