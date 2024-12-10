import React, { useCallback, useMemo, useState } from "react";
import { IClientProjectInfoDTO } from "../../../lib/API/Facilitator/AssignedAPI";
import { CircularProgress, Input, Pagination } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";

const ProjectHistories: React.FC<{
  infos: IClientProjectInfoDTO[];
}> = ({ infos }) => {
  const projectLenght = infos.length;

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
    let filteredProjects = infos ?? [];

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
  }, [infos, filterValue, hasSearchFilter]);

  if (infos.length <= 0)
    return <span className="text-gray-500">No Project History Yet...</span>;

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
            placeholder="Search..."
            size="sm"
            startContent={<CiSearch className="text-default-300" />}
            variant="bordered"
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-2 items-center">
        <div className="flex flex-col w-full">
          {filteredItems.map((project, index) => (
            <div className="flex flex-col items-center px-4 py-5 sm:px-6 sm:py-8">
              <div className="p-6 border border-gray-300 shadow-lg rounded-lg w-full max-w-3xl">
                {/* Profile and Project Details */}
                <div className="flex flex-col md:flex-row items-start md:space-x-8">
                  {/* Left Section: Client Info */}
                  <div className="flex flex-col items-center md:items-start mb-4 md:mb-1">
                    <div className="text-gray-700 text-center md:text-left">
                      <div className="flex items-center space-x-4 mt-6">
                        <h2 className="text-lg font-bold">
                          {`${project.clientFName} ${project.clientLName}`}
                        </h2>
                      </div>
                      <h5 className="text-md font-semibold">{`${project.clientFName}@gmail.com`}</h5>
                      <div className="text-sm font-semibold">
                        <h5 className="text-md font-semibold">{`${project.clientContactNum}`}</h5>
                      </div>
                    </div>
                  </div>

                  {/* Center Section: Divider and Project Details */}
                  <div className="border-l-2 border-gray-300 hidden md:block h-40 mx-4"></div>
                  <div className="flex flex-col text-medium items-center md:items-start space-y-3 text-center md:text-left">
                    <h1 className="text-gray-700 font-extrabold">
                      {project.projDescript}
                    </h1>
                    <h1 className="text-gray-500 font-bold">
                      Address:{" "}
                      <span className="font-semibold text-md text-gray-700">
                        {project.clientAddress}
                      </span>
                    </h1>
                    <h1 className="text-md font-bold text-gray-500">
                      System Type:{" "}
                      <span className="font-semibold text-md text-gray-700">
                        {project.systemType}
                      </span>
                    </h1>
                    <h1 className="text-md font-bold text-gray-500">
                      kW Capacity:{" "}
                      <span className="font-semibold text-md text-gray-700">
                        {project.kWCapacity} kW
                      </span>
                    </h1>
                  </div>
                </div>

                {/* New Section: Project Dates */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">
                    Project Dates
                  </h2>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Planned:
                      </span>
                      <span className="text-gray-700">
                        {project.plannedStarted} - {project.plannedEnded}{" "}
                        <span className="text-gray-500">
                          ({project.plannedWorkingDays} days)
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Actual:</span>
                      <span className="text-gray-700">
                        {project.actualStarted} - {project.actualEnded}{" "}
                        <span className="text-gray-500">
                          ({project.actualdWorkingDays} days)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Progress Indicators */}
                <div className="flex flex-col sm:flex-row justify-around items-center mt-8 space-y-4 sm:space-y-0">
                  {/* Project Progress */}
                  <div className="flex flex-col items-center">
                    <div className="mt-4 custom-circular-progress">
                      <CircularProgress
                        label="Project Progress"
                        value={project.projectProgress}
                        color="success"
                        showValueLabel={true}
                        strokeWidth={4}
                        classNames={{
                          svg: "w-24 h-24 drop-shadow-md",
                          indicator: "stroke-orange-500",
                          track: "stroke-orange-100",
                          value: "text-md font-semibold text-orange-500",
                        }}
                        size="lg"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col text-xs items-center w-1/3 p-2 bg-gray-50 rounded-md shadow">
                    <h2 className="text-sm font-semibold mb-3 text-gray-700">
                      Personnel
                    </h2>
                    {project?.installers?.map((info, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center w-full px-2 py-1 bg-white rounded shadow-sm mb-1"
                      >
                        <span className="text-gray-700 text-xs font-medium">
                          {info.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {info.position}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Installer Information */}
              </div>
            </div>
          ))}
        </div>

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

      {/* <NewClient isOpen={newIsOpen} onClose={newOnClose} refetch={refetch} /> */}
    </div>
  );
};

export default ProjectHistories;
