import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import React from "react";
import AvailableFacilitatorTable from "../../tables/AvailableFacilitatorTable";

interface IEdit {
  isOpen: boolean;
  onClose: () => void;
}

const EditFacilitatorAssignation: React.FC<IEdit> = ({ isOpen, onClose }) => {
  return (
    <Modal placement="center" size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <span className="text-sm text-gray-600">
            Edit Assignation of{" "}
            <span className=" text-base text-orange-400 font-semibold">
              Facilitator
            </span>
          </span>
        </ModalHeader>
        <ModalBody className="grid grid-cols-2 gap-2">
          <AvailableFacilitatorTable />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditFacilitatorAssignation;
