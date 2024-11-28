import React, { useEffect, useState } from "react";
import ProjectProgress from "../components/report/ProjectProgress";
import {
  getAllProjectTasksReport,
  getTasksAndProjectCounts,
} from "../../lib/API/Report";
import Loader from "../../main/components/Loader";
import { RiArrowRightWideFill } from "react-icons/ri";
import { useParams } from "react-router-dom";

const ProjectReportPage: React.FC<{ projectId?: string }> = ({projectId}) => {

  const { data: tasksReports, isLoading: isLoadingTasks } =
    getAllProjectTasksReport();

  const { data: count, isLoading: isLoadingCount } = getTasksAndProjectCounts();

  if (isLoadingCount || isLoadingTasks) return <Loader />;

  return (
    <div className="flex flex-col">
      <h1 className="flex items-center mb-4">
        Report
        <span className="mx-2 text-gray-400">
          <RiArrowRightWideFill />
        </span>
        Project{" "}
        <span className="mx-2 text-gray-400">
          <RiArrowRightWideFill />
        </span>
        Updates
      </h1>
      <ProjectProgress
        // projectId="5678e619-2571-4f24-9b57-5a16695b393f"
        projId={projectId}
        count={count!}
        tasksReports={tasksReports!}
      />
    </div>
  );
};

export default ProjectReportPage;
