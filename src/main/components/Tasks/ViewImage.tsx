import { Image, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import React from "react";

const ViewImage: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  link: string;
}> = ({ isOpen, onClose, link }) => {
  const baseURL = import.meta.env.VITE_APP_IMAGE_PROOF;
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="2xl">
      <ModalContent>
        <ModalBody>
          <Image height={400} src={`${baseURL}${link}`} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewImage;
