import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { FaUser, FaEnvelope, FaPhone, FaDownload } from "react-icons/fa";
import StatusTag from "./StatusTag";
import { IAllPayment } from "../../../../lib/API/Project/PaymentAPI";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentDetails?: IAllPayment;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  paymentDetails,
}) => {
  const renderDetailRow = (
    label: string,
    value: React.ReactNode | null | undefined,
    valueClassName: string = ""
  ) => (
    <div className="flex justify-between my-2">
      <span className="font-bold w-1/2">{label}</span>
      <span className={`text-right w-1/2 ${valueClassName}`}>
        {value || "N/A"}
      </span>
    </div>
  );

  const renderIconDetailRow = (
    icon: JSX.Element,
    value: string | null | undefined
  ) => (
    <div className="flex items-center gap-2 my-2">
      {icon}
      <span className="text-left text-sm">{value || "N/A"}</span>
    </div>
  );

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} at ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  };

  const capitalizeSourceType = (sourceType: string | null | undefined) => {
    if (!sourceType) return "N/A";
    return sourceType.charAt(0).toUpperCase() + sourceType.slice(1);
  };

  const isUnpaid = paymentDetails?.status === "unpaid";

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

      pdf.save(`${paymentDetails?.description}-receipt.pdf`);
    });
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      className="p-4"
      style={{ maxWidth: "100%", minWidth: "400px" }}
      size="5xl"
    >
      <ModalContent style={{ padding: "15px" }}>
        <ModalHeader className="flex justify-between items-center">
          <span className="text-2xl font-bold text-orange-500">
            {paymentDetails?.referenceNumber}
          </span>
          {paymentDetails?.status === "paid" && (
            <Button
              onClick={handleDownload}
              isIconOnly
              className="bg-orange-400 text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            >
              <FaDownload />
            </Button>
          )}
        </ModalHeader>

        <ModalBody id="pdf-content">
          {/* Conditionally render payment details if the status is not unpaid */}
          {!isUnpaid && (
            <div className="flex flex-row gap-6 mb-6">
              {/* Left Section: Payment Calculation */}
              <div className="flex-1 mr-3">
                <h2 className="text-lg font-semibold mb-4 text-[#1e0e4b]">
                  Payment Details
                </h2>
                {renderDetailRow("Gross Amount", `₱${paymentDetails?.amount}`)}
                {renderDetailRow(
                  `Fees (${paymentDetails?.paymentFeePercent})`,
                  `- ₱${paymentDetails?.paymentFee}`
                )}
                <hr />
                {renderDetailRow("Net Amount", `₱${paymentDetails?.netAmount}`)}
              </div>

              {/* Middle Section: Source Type and Paid At */}
              <div className="flex-1 mt-5">
                <div className="text-lg font-semibold mb-2">
                  {capitalizeSourceType(paymentDetails?.sourceType)}
                </div>
                <div className="text-sm text-gray-500">
                  Paid on {formatDate(paymentDetails?.paidAt)}
                </div>
              </div>

              {/* Right Section: Billing Details with Border and Icons */}
              <div className="flex-1 border border-gray-300 p-4 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out">
                <h2 className="text-lg font-semibold text-[#1e0e4b] mb-4">
                  Billing Details
                </h2>
                {renderIconDetailRow(<FaUser />, paymentDetails?.billingName)}
                {renderIconDetailRow(
                  <FaEnvelope />,
                  paymentDetails?.billingEmail
                )}
                {renderIconDetailRow(<FaPhone />, paymentDetails?.billingPhone)}
              </div>
            </div>
          )}

          {/* Full-width row for Link Information */}
          <div className="w-full">
            <h2 className="text-lg font-semibold text-[#1e0e4b] mb-4">
              Link Information
            </h2>
            <div className="grid grid-cols-2 gap-x-11">
              {renderDetailRow(
                "Reference no.",
                paymentDetails?.referenceNumber
              )}
              {renderDetailRow(
                "Amount",
                `₱${paymentDetails?.amount}`,
                "text-gray-500 font-bold text-xl"
              )}
              {renderDetailRow("Description", paymentDetails?.description)}
              {renderDetailRow(
                "Status",
                <StatusTag
                  status={paymentDetails?.status as "paid" | "unpaid"}
                />
              )}
              {renderDetailRow(
                "Bill date",
                formatDate(paymentDetails?.createdAt)
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaymentDetailsModal;
