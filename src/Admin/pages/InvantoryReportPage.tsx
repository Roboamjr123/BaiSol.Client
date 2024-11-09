import React from "react";
import {
  getAllEquipmentReport,
  getAllMaterialReport,
} from "../../lib/API/Report";
import Loader from "../../main/components/Loader";
import MaterialReport from "../components/report/MaterialReport";
import EquipmentReport from "../components/report/EquipmentReport";

const InvantoryReportPage: React.FC<{ isMaterial?: boolean }> = ({
  isMaterial = false,
}) => {
  const { data: materialreport, isLoading: isLoadingMTLReport } =
    getAllMaterialReport();
  const { data: equipmentreport, isLoading: isLoadingEQPTReport } =
    getAllEquipmentReport();

  if (isLoadingEQPTReport || isLoadingMTLReport) return <Loader />;

  if (isMaterial) return <MaterialReport materialReport={materialreport!} />;

  return <EquipmentReport equipmentlReport={equipmentreport!} />;
};

export default InvantoryReportPage;
