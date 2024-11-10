import React from "react";
import { getProjectHistories } from "../../lib/API/Facilitator/AssignedAPI";
import Loader from "../../main/components/Loader";
import ProjectHistories from "../components/info/ProjectHistories";

const ProjectHistoriesPage = () => {
  const { data: infos, isLoading } = getProjectHistories();

  if (isLoading) return <Loader />;

  return <ProjectHistories infos={infos!} />;
};

export default ProjectHistoriesPage;
