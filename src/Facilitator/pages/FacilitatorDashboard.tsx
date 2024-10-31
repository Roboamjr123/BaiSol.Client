import React from "react";
import { getAssignedProject } from "../../lib/API/Facilitator/AssignedAPI";
import ClientInfoDisplay from "../../main/components/ClientInfo/ClientInfoDisplay";
import { getClientProjectInfo } from "../../lib/API/Project/ProjectApi";
import { getProjectProgress } from "../../lib/API/Project/GanttAPI";
import Loader from "../../main/components/Loader";

const FacilitatorDashboard = () => {
  const { data: projId, isLoading: isLoadingId } = getAssignedProject();

  const { data: infos, isLoading: isLoadingCPI } = getClientProjectInfo(
    projId!
  );

  const { data: projProg, isLoading: isLoadingproj } = getProjectProgress(
    projId!
  );

  // const { data: infos, isLoading } = getClientProjectInfo(projId!);

  if (isLoadingId || isLoadingCPI || isLoadingproj) {
    return <Loader />;
  }
  console.log(projId);

  return (
    <div>
      <ClientInfoDisplay
        project={infos!}
        projectProgress={projProg?.progress!}
      />
    </div>
  );
};

export default FacilitatorDashboard;
