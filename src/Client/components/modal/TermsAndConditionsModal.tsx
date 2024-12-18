import React, { useEffect, useState } from "react";
import { useApproveProjectQuotation } from "../../../lib/API/Client/ClientProjectAPI";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { FaLock } from "react-icons/fa";

const TermsAndConditionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  refetchInfo: () => void;
  refetchExpense: () => void;
  refetchSupply: () => void;
  refetchOnGoing: () => void;
  refetchApprove: () => void;
}> = ({
  refetchInfo,
  refetchExpense,
  refetchSupply,
  refetchApprove,
  refetchOnGoing,
  isOpen,
  onClose,
}) => {
  const { projId } = useParams<{ projId: string }>();
  const approveQuotation = useApproveProjectQuotation();

  const navigate = useNavigate();

  const handleApproveQuotation = async () => {
    if (
      window.confirm("Click OK to approve your solar instaklation quotation.")
    ) {
      approveQuotation.mutateAsync(
        { projId: projId! },
        {
          onSuccess: (data) => {
            toast.success(data);
            refetchInfo();
            refetchExpense();
            refetchSupply();
            refetchOnGoing();
            refetchApprove();
            onClose();
            navigate(`/quotation/${projId}`);
          },
        }
      );
    }
  };

  return (
    <Modal
      placement="center"
      isOpen={isOpen}
      scrollBehavior="inside"
      onClose={onClose}
      className="scrollbar-hide scrollbar-track-white scrollbar-thumb-orange-100"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Terms and Conditions
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <p>
              By approving this quotation, you agree to the terms and conditions
              outlined below for the solar installation project. Please review
              them carefully:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Payment Terms:</strong> The payment structure includes:
                <ul className="list-disc pl-5">
                  <li>60% downpayment upon approval of the quotation.</li>
                  <li>
                    30% progress billing when the project reaches certain
                    milestones.
                  </li>
                  <li>10% payment after the installation is completed.</li>
                </ul>
              </li>
              <li>
                <strong>Project Start:</strong> The project will commence 2
                business days after the downpayment is received, provided the
                payment is made on a weekday.
              </li>
              <li>
                <strong>Progress Billing Requirement:</strong> The project will
                not proceed if the progress billing payment is not settled once
                the project reaches 60% or more completion.
              </li>
              <li>
                <strong>Agreement to Expenses:</strong> By approving the
                quotation, the client agrees to all costs associated with the
                project, including any additional expenses that may arise.
              </li>
              <li>
                <strong>Warranties:</strong> The solar installation comes with
                the following warranties:
                <ul className="list-disc pl-5">
                  <li>2-year workmanship warranty.</li>
                  <li>5-year inverter warranty.</li>
                  <li>12-year product warranty for solar panels.</li>
                  <li>25-year lifespan for solar panels.</li>
                </ul>
              </li>
              <li>
                <strong>Site Preparation:</strong> The client is responsible for
                ensuring the site is accessible and safe for the installation
                team.
              </li>
              <li>
                <strong>Force Majeure:</strong> Delays caused by natural
                disasters, acts of government, or other unforeseen circumstances
                will be communicated promptly and may adjust the installation
                timeline.
              </li>
            </ul>
            <p>
              Please contact our support team for any clarifications before
              approving the quotation.
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            onClick={handleApproveQuotation}
            isLoading={approveQuotation.isPending}
          >
            {approveQuotation.isPending ? "Loading..." : "Approve"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TermsAndConditionsModal;
