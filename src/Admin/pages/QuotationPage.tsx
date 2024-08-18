import LaborCostQuotation from "../components/quotation/LaborCostQuotation";
import ProjectAndMaterialsCostQuotation from "../components/quotation/ProjectAndMaterialsCostQuotation";

const QuotationPage = () => {
  return (
    <div className="flex flex-col gap-5">
      <ProjectAndMaterialsCostQuotation />
      <LaborCostQuotation />
    </div>
  );
};

export default QuotationPage;
