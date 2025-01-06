import Header from "./Header";
import Table from "./Table";
import Footer from "./Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, Edit } from "lucide-react";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  getClientProjectInfo,
  getIsOnGoingProject,
  getProjectExpense,
  getProjectInfo,
  getProjectSupply,
} from "../../../lib/API/Project/ProjectApi";
import { Button, useDisclosure } from "@nextui-org/react";
import EditClientInfo from "../../../Admin/components/modal/project/EditClientInfo";
import { FaDownload } from "react-icons/fa";
import {
  getClientProjId,
  getIsProjectApprovedQuotation,
} from "../../../lib/API/Client/ClientProjectAPI";
import Loader from "../Loader";
import TermsAndConditionsModal from "../../../Client/components/modal/TermsAndConditionsModal";
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Component to generate a PDF of the quotation.
 *
 * @returns a component that contains a header, table and footer
 *          and a button to print and download the PDF
 */
/******  134b4739-01a7-4742-921b-d9adf1b9231d  *******/
const Form: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
  const { projId } = useParams<{ projId: string }>();

  const {
    data: projInfo,
    refetch: refetchInfo,
    isLoading: infoLoading,
  } = getProjectInfo(projId);
  const {
    data: projExpense,
    refetch: refetchExpense,
    isLoading: expenseLoading,
  } = getProjectExpense(projId);
  const {
    data: materialSupplies,
    isLoading: supplyLoading,
    refetch: refetchSupply,
  } = getProjectSupply(projId);
  const {
    data: isProjectOnGoing,
    isLoading: onGoingLoading,
    refetch: refetchStatus,
  } = getIsOnGoingProject(projId!);
  const {
    data: isProjectApproved,
    isLoading: approvedLoading,
    refetch: refetchApprove,
  } = getIsProjectApprovedQuotation(projId!);

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();

  const {
    isOpen: approveIsOpen,
    onOpen: approveOnOpen,
    onClose: approveOnClose,
  } = useDisclosure();

  if (
    expenseLoading ||
    infoLoading ||
    supplyLoading ||
    onGoingLoading ||
    approvedLoading
  )
    return <Loader />;

  if (!projInfo || !projExpense || !materialSupplies)
    return <div>No project yet...</div>;
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Prints the page.
   */
  /******  6813502f-206b-440a-a6d2-75d0185fd9f6  *******/

  const handleDownload = () => {
    const input = document.getElementById("pdf-content"); // Use the ID you set on the container

    // Check if input is null
    if (!input) {
      console.error("Element with ID 'pdf-content' not found.");
      return; // Exit the function if input is null
    }

    html2canvas(input, { scale: 2 }).then((canvas) => {
      // Increase scale for better quality
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      // Calculate the width and height for the image in the PDF
      const imgWidth = pdf.internal.pageSize.getWidth() - 20; // 10 margin on each side
      const pageHeight = pdf.internal.pageSize.getHeight() - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      let heightLeft = imgHeight;

      let position = 0;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new page if the content exceeds the page height
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${projInfo?.customerName}.pdf`);
    });
  };

  return (
    <div className="a4-container">
      <div className="print-container text-right flex justify-end gap-x-5 pb-5 px-1">
        {!isAdmin && (
          <Button
            isLoading={
              expenseLoading || infoLoading || supplyLoading || onGoingLoading
            }
            className="bg-orange-500 text-background"
            size="sm"
            onClick={() => approveOnOpen()}
            isDisabled={isProjectApproved}
          >
            {isProjectApproved ? "Approved" : "Approve Quotation"}
          </Button>
        )}
        <button
          onClick={handleDownload}
          className="print-button flex flex-col items-center hover:text-orange-500 !important"
        >
          <Download />
          Download
        </button>{" "}
        {isAdmin && isProjectOnGoing && (
          <button
            onClick={() => editOnOpen()}
            className="print-button flex flex-col items-center hover:text-orange-500 !important"
          >
            <Edit />
            Edit
          </button>
        )}
      </div>

      <div id="pdf-content" className="relative pt-5 font-weight-light">
        <Header projInfo={projInfo} />
        <div className="content-section">
          <Table
            materialSupplies={materialSupplies}
            projExpense={projExpense}
          />
        </div>
        <div className="content-section">
          <Footer projExpense={projExpense} />
        </div>
      </div>

      <EditClientInfo
        isOpen={editIsOpen}
        onClose={editOnClose}
        projId={projId!}
        refetchExpense={refetchExpense}
        refetchInfo={refetchInfo}
      />

      <TermsAndConditionsModal
        isOpen={approveIsOpen}
        onClose={approveOnClose}
        refetchInfo={refetchInfo}
        refetchExpense={refetchExpense}
        refetchApprove={refetchApprove}
        refetchSupply={refetchSupply} // if there's a refetch in `getProjectSupply`
        refetchOnGoing={refetchStatus} // if there's a refetch in `getIsOnGoingProject`
      />
    </div>
  );
};

export default Form;
