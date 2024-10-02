import Header from "./Header";
import Table from "./Table";
import Footer from "./Footer";
import "./App.css"; // Import the stylesheet
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Form = () => {
  const handlePrint = () => {
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
    <div>
      <div className="a4-container">
        <div className="print-container text-right py-5 px-1">
          <button onClick={handlePrint} className="print-button">
            <LocalPrintshopIcon />
            <br />
            Print
          </button>
          <button onClick={handleDownload} className="print-button px-5">
            <DownloadRoundedIcon />
            <br />
            Download
          </button>
        </div>
        <div
          id="pdf-content"
          className="relative bg-gray-100 pt-5 font-weight-light"
        >
          <Header />
          <div className="content-section">
            <Table />
          </div>
          <div className="content-section">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
