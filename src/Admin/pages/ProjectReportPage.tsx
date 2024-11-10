import React from "react";
import ProjectProgress from "../components/report/ProjectProgress";
import {
  getAllProjectTasksReport,
  getTasksAndProjectCounts,
} from "../../lib/API/Report";
import Loader from "../../main/components/Loader";
import { RiArrowRightWideFill } from "react-icons/ri";

const ProjectReportPage = () => {
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
        Project
      </h1>
      <ProjectProgress count={count!} tasksReports={tasksReports!} />
    </div>
  );
};

export default ProjectReportPage;
