import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useCallback } from "react";
import AvailableFacilitatorTable from "../../tables/AvailableFacilitatorTable";
import FacilitatorMain from "../../dnd/FacilitatorMain";
import {
  getAssignedFacilitators,
  getAvailableFacilitators,
  useAssignFacilitatorToProject,
} from "../../../../lib/API/PersonnelAPI";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface IEdit {
  projId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditFacilitatorAssignation: React.FC<IEdit> = ({
  isOpen,
  onClose,
  projId,
}) => {
  // Fetch assigned facilitator
  const assginedFacilitator = getAssignedFacilitators(projId);

  // Fetch all available facilitators
  const availableFacilitators = getAvailableFacilitators();



  return (
    <Modal placement="center" size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <span className="text-sm text-gray-600">
            Edit Assignation of{" "}
            <span className=" text-base text-orange-400 font-semibold">
              Facilitator
            </span>
          </span>
        </ModalHeader>
        <ModalBody>
          {/* <AvailableFacilitatorTable /> */}
          <FacilitatorMain
            projId={projId}
            refetchAssign={assginedFacilitator.refetch}
            refetchAvailable={availableFacilitators.refetch}
            facilitators={
              availableFacilitators.data ? availableFacilitators.data : []
            }
            assignedFacilitator={assginedFacilitator.data}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditFacilitatorAssignation;
