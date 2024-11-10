import React from "react";
import {
  getAllEquipmentReport,
  getAllMaterialReport,
} from "../../lib/API/Report";
import Loader from "../../main/components/Loader";
import MaterialReport from "../components/report/MaterialReport";
import EquipmentReport from "../components/report/EquipmentReport";
import { RiArrowRightWideFill } from "react-icons/ri";

const InventoryReportPage: React.FC<{ isMaterial?: boolean }> = ({
  isMaterial = false,
}) => {
  const { data: materialreport, isLoading: isLoadingMTLReport } =
    getAllMaterialReport();
  const { data: equipmentreport, isLoading: isLoadingEQPTReport } =
    getAllEquipmentReport();

  if (isLoadingEQPTReport || isLoadingMTLReport) return <Loader />;

  return (
    <div className="flex flex-col">
      <h1 className="flex items-center mb-4">
        Report
        <span className="mx-2 text-gray-400">
          <RiArrowRightWideFill />
        </span>
        {isMaterial ? "Materials" : "Equipment"}
      </h1>
      {isMaterial ? (
        <MaterialReport materialReport={materialreport!} />
      ) : (
        <EquipmentReport equipmentReport={equipmentreport!} />
      )}
    </div>
  );
};

export default InventoryReportPage;
