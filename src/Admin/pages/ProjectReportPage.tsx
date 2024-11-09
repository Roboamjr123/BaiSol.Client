import React from "react";
import ProjectProgress from "../components/report/ProjectProgress";
import {
  getAllProjectTasksReport,
  getTasksAndProjectCounts,
} from "../../lib/API/Report";
import Loader from "../../main/components/Loader";

const ProjectReportPage = () => {
  const { data: tasksReports, isLoading: isLoadingTasks } =
    getAllProjectTasksReport();

  const { data: count, isLoading: isLoadingCount } = getTasksAndProjectCounts();

  if (isLoadingCount || isLoadingTasks) return <Loader />;

  return <ProjectProgress count={count!} tasksReports={tasksReports!} />;
};

export default ProjectReportPage;
