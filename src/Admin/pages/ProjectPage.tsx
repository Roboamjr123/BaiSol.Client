import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllClientsProjects } from "../../lib/API/Project/ProjectApi";
import ProjectCards from "../components/project/ProjectCards";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Input,
  Pagination,
  useDisclosure,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import Loader from "../../main/components/Loader";
import { FaPlus } from "react-icons/fa";
import ExistingClient from "../components/modal/ExistingClient";
import NewClient from "../components/modal/NewClient";

const ProjectPage = () => {
  const { data: projects, isLoading, error, refetch } = getAllClientsProjects();
  const projectLenght = projects ? projects.length : 0;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // Blogs per page

  const [filterValue, setFilterValue] = useState("");

  const pages = useMemo(
    () => Math.ceil(projectLenght / pageSize),
    [projectLenght, pageSize]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

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
        const clientName = project.clientName?.toLowerCase() || "";
        const projName = project.projName?.toLowerCase() || "";
        const status = project.status?.toLowerCase() || "";

        return (
          clientName.includes(filterValue.toLowerCase()) ||
          projName.includes(filterValue.toLowerCase()) ||
          status.includes(filterValue.toLowerCase())
        );
      });
    }

    return filteredProjects;
  }, [projects, filterValue, hasSearchFilter]);

  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  const {
    isOpen: existingIsOpen,
    onOpen: existingOnOpen,
    onClose: existingOnClose,
  } = useDisclosure();

  if (isLoading) return <Loader />;

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

          <Dropdown>
            <DropdownTrigger className="flex">
              <Button
                className="bg-orange-500 w-[50%] text-background"
                endContent={<FaPlus className="text-small" />}
                size="sm"
              >
                Add Project
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="add project"
              selectionMode="single"
              variant="shadow"
            >
              <DropdownItem onClick={() => existingOnOpen()}>
                Existing
              </DropdownItem>
              <DropdownItem onClick={() => newOnOpen()}>New</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="flex flex-col gap-y-6 items-center">
        <ProjectCards
          projects={filteredItems}
          currentPage={currentPage}
          pageSize={pageSize}
        />
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

      <ExistingClient
        isOpen={existingIsOpen}
        onClose={existingOnClose}
        refetch={refetch}
      />

      <NewClient isOpen={newIsOpen} onClose={newOnClose} refetch={refetch} />
    </div>
  );
};

export default ProjectPage;
