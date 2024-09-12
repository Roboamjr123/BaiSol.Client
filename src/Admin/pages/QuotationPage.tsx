import { useNavigate, useParams } from "react-router-dom";
import LaborCostQuotation from "../components/quotation/LaborCostQuotation";
import ProjectAndMaterialsCostQuotation from "../components/quotation/ProjectAndMaterialsCostQuotation";
import { getProjectAndMaterialsCostQuote } from "../../lib/API/Quote/ProjectQuotationAPI";
import { getLaborCostQuote } from "../../lib/API/Quote/LaborQuotationAPI";
import { useEffect } from "react";
import Loader from "../../main/components/Loader";

const QuotationPage = () => {
  // Fetch `id` from URL params
  const { projId } = useParams<{ projId: string }>();
  const navigate = useNavigate();

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
      <ProjectAndMaterialsCostQuotation
        projId={projId!}
        projectCost={projectCost}
        isLoading={isLoadingPAM}
        refetch={refetchPAM}
      />
      <LaborCostQuotation
        projId={projId!}
        laborCost={laborCost}
        isLoading={isLoadingLabor}
        refetch={refetchLabor}
        refetchPAM={refetchPAM}
      />
    </div>
  );
};

export default QuotationPage;
