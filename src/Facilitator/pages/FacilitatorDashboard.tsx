import React from "react";
import { getAssignedProject } from "../../lib/API/Facilitator/AssignedAPI";
import ClientInfoDisplay from "../../main/components/ClientInfo/ClientInfoDisplay";
import { getClientProjectInfo } from "../../lib/API/Project/ProjectApi";
import { getProjectProgress } from "../../lib/API/Project/GanttAPI";
import Loader from "../../main/components/Loader";
import { getPaymentProgress } from "../../lib/API/Project/PaymentAPI";

const FacilitatorDashboard = () => {
  const { data: projId, isLoading: isLoadingId } = getAssignedProject();

  const { data: infos, isLoading: isLoadingCPI } = getClientProjectInfo(
    projId!
  );

  const { data: payProg, isLoading: isLoadingPay } = getPaymentProgress(
    projId!
  );
  const { data: projProg, isLoading: isLoadingproj } = getProjectProgress(
    projId!
  );

  // const { data: infos, isLoading } = getClientProjectInfo(projId!);

  if (isLoadingId || isLoadingCPI || isLoadingproj || isLoadingPay) {
    return <Loader />;
  }

  if (!infos)
    return <span className="text-gray-500">Assigned Project Yet...</span>;

  return (
    <div>
      <ClientInfoDisplay
        project={infos}
        paymentProgress={payProg}
        projectProgress={projProg?.progress!}
      />
    </div>
  );
};

export default FacilitatorDashboard;
