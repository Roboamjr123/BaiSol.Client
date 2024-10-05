import Header from "./Header";
import Table from "./Table";
import Footer from "./Footer";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Design from "../main/components/Quotation/pdf.css";
import { Edit, Edit2Icon } from "lucide-react";
import React, { FC } from "react";
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Component to generate a PDF of the quotation.
 *
 * @returns a component that contains a header, table and footer
 *          and a button to print and download the PDF
 */
/******  134b4739-01a7-4742-921b-d9adf1b9231d  *******/
const Form: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Prints the page.
   */
  /******  6813502f-206b-440a-a6d2-75d0185fd9f6  *******/ const handlePrint =
    () => {
      window.print();
    };

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

      pdf.save("Invoice.pdf");
    });
  };

  return (
    <div className="a4-container">
      <div className="print-container text-right flex justify-end gap-x-5 pb-5 px-1">
        <button
          onClick={handlePrint}
          className="print-button hover:text-orange-500 !important"
        >
          <LocalPrintshopIcon />
          <br />
          Print
        </button>
        <button
          onClick={handleDownload}
          className="print-button hover:text-orange-500 !important"
        >
          <DownloadRoundedIcon />
          <br />
          Download
        </button>{" "}
        {isAdmin && (
          <button className="print-button hover:text-orange-500 !important">
            <Edit />
            Edit
          </button>
        )}
      </div>

      <div id="pdf-content" className="relative pt-5 font-weight-light">
        <Header />
        <div className="content-section">
          <Table />
        </div>
        <div className="content-section">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Form;
