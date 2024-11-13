import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getClientProjectHistory } from "../../lib/API/Client/ClientProjectAPI";
import Loader from "../../main/components/Loader";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Input,
  Pagination,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import ClientProjectHistoryLists from "../../main/components/ClientInfo/ClientProjectHistoryLists";

const ClientHistoryPage = () => {
  const { data: projects, isLoading, refetch } = getClientProjectHistory();

  const projectLenght = projects ? projects.length : 0;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Blogs per page

  const [filterValue, setFilterValue] = useState("");

  const pages = useMemo(
    () => Math.ceil(projectLenght / pageSize),
    [projectLenght, pageSize]
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setCurrentPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredProjects = projects ?? [];

    if (hasSearchFilter) {
      filteredProjects = filteredProjects.filter((project) => {
        const clientFName = project.clientFName?.toLowerCase() || "";
        const clientLName = project.clientLName?.toLowerCase() || "";
        const projName = project.projName?.toLowerCase() || "";
        const status = project.status?.toLowerCase() || "";

        return (
          clientFName.includes(filterValue.toLowerCase()) ||
          clientLName.includes(filterValue.toLowerCase()) ||
          projName.includes(filterValue.toLowerCase()) ||
          status.includes(filterValue.toLowerCase())
        );
      });
    }

    return filteredProjects;
  }, [projects, filterValue, hasSearchFilter]);

  if (isLoading) {
    return <Loader />;
  }

  if (projects == null) {
    return <span className="text-gray-500">No Project Yet...</span>;
  }

  return (
    <div className="px-5">
      <div className="flex flex-row gap-4 md:gap-20 justify-between mb-10 px-4 md:px-0">
        <h1 className="flex items-center mb-4 text-lg md:text-xl">
          Project
          <span className="text-xs text-gray-400 ml-2">
            Total {filteredItems.length}
          </span>
        </h1>
        <div className="flex flex-row items-center gap-4 md:gap-5 w-full md:w-96">
          <Input
            isClearable
            classNames={{
              base: "w-full",
              inputWrapper: "border-1",
            }}
            placeholder="Search by project name..."
            size="sm"
            startContent={<CiSearch className="text-default-300" />}
            variant="bordered"
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-6 items-center">
        <ClientProjectHistoryLists project={filteredItems} />

        <div className="flex justify-center w-full">
          <Pagination
            loop
            initialPage={1}
            showControls
            classNames={{
              cursor: "bg-orange-400 text-background",
            }}
            color="default"
            isDisabled={hasSearchFilter}
            page={currentPage}
            total={pages}
            variant="light"
            onChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientHistoryPage;
