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
  const validatedClientProjId = clientProjId
    ? clientProjId.projId
    : "73288400-fc5f-4888-96c0-6733c7c3e024";

  const { data: infos, isLoading: isLoadingCPI } = getClientProjectInfo(
    validatedClientProjId
  );

  const { data: payProg, isLoading: isLoadingPay } = getPaymentProgress(
    validatedClientProjId
  );

  const { data: projProg, isLoading: isLoadingproj } = getProjectProgress(
    validatedClientProjId
  );

  // const { data: infos, isLoading } = getClientProjectInfo(projId!);

  if (isLoading || isLoadingCPI || isLoadingPay || isLoadingproj) {
    return <Loader />;
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
