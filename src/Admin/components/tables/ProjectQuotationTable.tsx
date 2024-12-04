import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Link, NavLink, useParams } from "react-router-dom";
import ProjectInfosTable from "../report/ProjectInfosTable";
import ProjectReportPage from "../../pages/ProjectReportPage";

const ProjectQuotationTable = () => {
  const { projectId } = useParams();
  const components = [
    {
      name: "Projects",
      link: "/reports/project",
      index: 1,
    },
    {
      name: "Task Updates",
      link: "/reports/project/updates",
      index: 2,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-2 mb-2">
        {components.map((item) => (
          <NavLink
            to={`${item.link}`}
            key={item.index}
            className={({ isActive }) =>
              `w-28 font-semibold text-sm md:w-36 lg:w-48 text-white md:text-lg ${
                isActive ? "sidebar-active" : "bg-orange-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {location.pathname === "/reports/project" && <ProjectInfosTable />}
      {location.pathname === "/reports/project/updates" && (
        <ProjectReportPage />
      )}
      {location.pathname === `/reports/project/updates/${projectId}` && (
        <ProjectReportPage projectId={projectId} />
      )}
    </div>
  );
};

export default ProjectQuotationTable;
