import React from "react";
import { getAssignedProject } from "../../lib/API/Facilitator/AssignedAPI";
import { ToDos } from "../components/task/ToDOs";
import Loader from "../../main/components/Loader";

const ReportPage = () => {
  const { data: projId, isLoading: isLoadingId } = getAssignedProject();

  if (isLoadingId) return <Loader />;

  return <ToDos projId={projId!} />;
};

export default ReportPage;
