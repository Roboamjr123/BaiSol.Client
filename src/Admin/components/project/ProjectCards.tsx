import React from "react";
import { getAllClientsProjects } from "../../../lib/API/Project/ProjectApi";
import { Link } from "react-router-dom";
import { Card, CardBody, Chip } from "@nextui-org/react";
import { projectStatusColorMap } from "../../../lib/utils/project";
import { formatName } from "../../../lib/utils/functions";

const ProjectCards = ({
  projects,
  currentPage,
  pageSize,
}: {
  projects: any[];
  currentPage: number;
  pageSize: number;
}) => {
  
  const filteredProjects = projects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // const { data: projects, isLoading, error, refetch } = getAllClientsProjects();

  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 mb-auto w-full">
      {filteredProjects?.map((project: any) => {
        return (
          <Link
            key={project.projId}
            to={`/project/${project.projId}`}
            className="p-5 shadow-lg rounded-lg cursor-pointer bg-white hover:scale-105 duration-300"
          >
            <div className="flex flex-row justify-between">
              <span className="text-lg font-bold tracking-widest flex-grow overflow-hidden text-ellipsis">
                {project.projName}
              </span>
              <Chip
                className="capitalize border-none text-default-600"
                color={projectStatusColorMap[project.status]}
                size="sm"
                variant="dot"
              />
            </div>
            <p className="my-2 text-medium text-gray-700">
              {project.projDescript}
            </p>
            <p className="text-sm text-gray-600 font-medium">
              Client: {formatName(project.clientName)}
            </p>
            <p className="pl-2 text-xs text-gray-500">
              Address: {project.clientAddress}
            </p>
            <p className="pl-2 text-xs text-gray-500">
              Date: {project.createdAt}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default ProjectCards;
