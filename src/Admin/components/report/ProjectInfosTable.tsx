import React, { useCallback, useMemo, useState } from "react";
import { getAllProjectReport, IProjectDTO } from "../../../lib/API/Report";
import {
  Button,
  Chip,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { projectStatusColorMap } from "../../../lib/utils/project";
import { FaInfoCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { project_report_columns } from "../../../lib/utils/projectReportTable";
import { RiArrowRightWideFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const ProjectInfosTable = () => {
  const { data: projects, isLoading } = getAllProjectReport();
  const projectLength = projects ? projects.length : 0;

  const [filterValue, setFilterValue] = useState("");
  const filteredItems = useMemo(() => {
    let filteredMaterials = projects ?? [];

    filteredMaterials = filteredMaterials.filter(
      (project) =>
        (project.customer?.toLowerCase() || "").includes(
          filterValue.toLowerCase()
        ) ||
        (project.facilitator?.toLowerCase() || "").includes(
          filterValue.toLowerCase()
        ) ||
        (project.systemType?.toLowerCase() || "").includes(
          filterValue.toLowerCase()
        ) ||
        (project.status?.toLowerCase() || "").includes(
          filterValue.toLowerCase()
        ) ||
        (project.projId?.toLowerCase() || "").includes(
          filterValue.toLowerCase()
        )
    );

    return filteredMaterials;
  }, [projects, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = useCallback(
    (project: IProjectDTO, columnKey: React.Key) => {
      const cellValue = project[columnKey as keyof IProjectDTO];

      switch (columnKey) {
        case "customer":
          return <div>{project.customer}</div>;
        case "systemType":
          return (
            <div>
              {project.systemType} {project.kWCapacity}
            </div>
          );
        case "facilitator":
          return <div>{project.facilitator}</div>;
        case "plannedDate":
          return (
            <div>
              {project.plannedStarted} - {project.plannedEnded}
            </div>
          );
        case "actualDate":
          return (
            <div>
              {project.actualStarted} - {project.actualEnded}
            </div>
          );
        case "cost":
          return <div>{project.cost}</div>;
        case "status":
          return (
            <Chip
              className="capitalize border-none"
              color={projectStatusColorMap[project.status]}
              size="sm"
              variant="flat"
            >
              {project.status}
            </Chip>
          );
        case "action":
          return (
            <Link to={`/reports/project/updates/${project.projId}`}>
              <FaInfoCircle className="text-default-400" />
            </Link>
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
        </div>
        <div className="flex justify-between items-start">
          <span className="text-default-400 text-small">
            Total {projectLength} project
          </span>
        </div>
      </div>
    );
  }, [onSearchChange, projectLength, filterValue]);

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
        <h1 className="flex items-center mb-4">
          Report
          <span className="mx-2 text-gray-400">
            <RiArrowRightWideFill />
          </span>
          Project
        </h1>
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className=" min-w-full">
            <Table
              aria-label="Materials Table"
              isHeaderSticky
              removeWrapper
              classNames={classNamesDesign}
              topContent={topContent}
              topContentPlacement="outside"
            >
              <TableHeader columns={project_report_columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "action" ? "center" : "start"}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent={"No equipment found"}
                isLoading={isLoading}
                items={filteredItems}
                loadingContent={<Spinner color="warning">Loading...</Spinner>}
              >
                {(item) => (
                  <TableRow key={item.projId}>
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

export default ProjectInfosTable;
