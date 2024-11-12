import React from "react";
import Form from "../../main/components/Quotation/Form";
import { Navigate, useParams } from "react-router-dom";
import { getClientProjId } from "../../lib/API/Client/ClientProjectAPI";

const ClientProjectQuotationPage = () => {
  const { data: clientProjId } = getClientProjId();
  const { projId } = useParams<{ projId: string }>();

  if (
    (projId && clientProjId && projId !== clientProjId.projId) ||
    !clientProjId ||
    !projId
  ) {
    return <Navigate to="/" />;
  }

  return <Form />;
};

export default ClientProjectQuotationPage;
