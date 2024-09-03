import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";
import FacilitatorMain from "../../dnd/FacilitatorMain";
import {
  getAssignedFacilitators,
  getAvailableFacilitators,
} from "../../../../lib/API/PersonnelAPI";

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
    <Modal
      placement="center"
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      className="m-2 overflow-x-auto  scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100"
    >
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
