import { useNavigate, useParams } from "react-router-dom";
import LaborCostQuotation from "../components/quotation/LaborCostQuotation";
import ProjectAndMaterialsCostQuotation from "../components/quotation/ProjectAndMaterialsCostQuotation";
import { getProjectAndMaterialsCostQuote } from "../../lib/API/Quote/ProjectQuotationAPI";
import { getLaborCostQuote } from "../../lib/API/Quote/LaborQuotationAPI";
import { useEffect, useState } from "react";
import Loader from "../../main/components/Loader";
import { Switch } from "@nextui-org/react";
import { FileEdit } from "lucide-react";
import { IoIosSave } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { getAssignedEquipment } from "../../lib/API/Quote/EquipmentAssignationAPI";
import ProvideEquipmentSupply from "../components/quotation/ProvideEquipmentSupply";

const QuotationPage = () => {
  // Fetch `id` from URL params
  const { projId } = useParams<{ projId: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    data: projectCost,
    refetch: refetchPAM,
    isLoading: isLoadingPAM,
  } = getProjectAndMaterialsCostQuote(projId!);

  const {
    data: laborCost,
    isLoading: isLoadingLabor,
    refetch: refetchLabor,
  } = getLaborCostQuote(projId!);

  const {
    data: assignedEquipment,
    refetch: refetchEquipment,
    isLoading: isLoadingEquipment,
  } = getAssignedEquipment(projId!);

  useEffect(() => {
    if (laborCost && laborCost.laborCost.length === 0) {
      navigate("/404");
    }
  }, [laborCost, navigate]);

  if (isLoadingPAM || isLoadingLabor) {
    return <Loader />; // Add a proper loading indicator
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="ml-auto">
          <Switch
            className="items-center"
            color="warning"
            size="lg"
            isSelected={isEditMode}
            onValueChange={setIsEditMode}
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <FaEdit className={className} />
              ) : (
                <IoIosSave className={className} />
              )
            }
          >
            {isEditMode ? "Edit" : "Saved"}
          </Switch>
        </div>
      </div>

      <ProjectAndMaterialsCostQuotation
        projId={projId!}
        projectCost={projectCost}
        isLoading={isLoadingPAM}
        refetch={refetchPAM}
        refetchLabor={refetchLabor}
        isEditMode={isEditMode}
      />
      <LaborCostQuotation
        projId={projId!}
        laborCost={laborCost}
        isLoading={isLoadingLabor}
        isEditMode={isEditMode}
        refetch={refetchLabor}
        refetchPAM={refetchPAM}
      />
      <ProvideEquipmentSupply
        projId={projId!}
        isEditMode={isEditMode}
        assignedEquipment={assignedEquipment!}
        isLoading={isLoadingEquipment}
        refetch={refetchEquipment}
      />
    </div>
  );
};

export default QuotationPage;
