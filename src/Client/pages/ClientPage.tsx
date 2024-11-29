import React from "react";
import { RiArrowRightWideFill } from "react-icons/ri";
import ClientTable from "../../Admin/components/tables/ClientTable";
import { getClientProjectInfo } from "../../lib/API/Project/ProjectApi";
import { useParams } from "react-router-dom";
import { getClientProjId } from "../../lib/API/Client/ClientProjectAPI";
import Loader from "../../main/components/Loader";
import ClientInfoDisplay from "../../main/components/ClientInfo/ClientInfoDisplay";
import { getPaymentProgress } from "../../lib/API/Project/PaymentAPI";
import { getProjectProgress } from "../../lib/API/Project/GanttAPI";

const ClientPage = () => {
  // const { projId } = useParams<{ projId: string }>();

  const { data: clientProjId, isLoading } = getClientProjId();

  // If `clientProjId` is still loading or is null, return a loading state or handle appropriately.
  if (isLoading) {
    return <Loader />;
  }

  if (clientProjId === null) {
    return <div>No project yet...</div>;
  }

  // Now safely access `projId` after validating that `clientProjId` is not null
  const validatedClientProjId = clientProjId!.projId;

  const { data: infos, isLoading: isLoadingCPI } = getClientProjectInfo(
    validatedClientProjId
  );
  const { data: payProg, isLoading: isLoadingPay } = getPaymentProgress(
    validatedClientProjId
  );
  const { data: projProg, isLoading: isLoadingproj } = getProjectProgress(
    validatedClientProjId
  );

  // Check if any of the data is still loading
  if (isLoadingCPI || isLoadingPay || isLoadingproj) {
    return <Loader />;
  }

  // Once data is loaded, check if any data is null
  if (infos === null || payProg === null || projProg === null) {
    return <div>No project data available...</div>;
  }
  return (
    <div>
      <ClientInfoDisplay
        project={infos!}
        paymentProgress={payProg}
        projectProgress={projProg?.progress!}
      />
    </div>
  );
};

export default ClientPage;
