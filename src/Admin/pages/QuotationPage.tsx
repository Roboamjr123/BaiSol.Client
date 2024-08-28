import { useParams } from "react-router-dom";
import LaborCostQuotation from "../components/quotation/LaborCostQuotation";
import ProjectAndMaterialsCostQuotation from "../components/quotation/ProjectAndMaterialsCostQuotation";
import { getProjectAndMaterialsCostQuote } from "../../lib/API/Quote/ProjectQuotationAPI";
import { getLaborCostQuote } from "../../lib/API/Quote/LaborQuotationAPI";

const QuotationPage = () => {
  // Fetch `id` from URL params
  const { projId } = useParams<{ projId: string }>();

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
