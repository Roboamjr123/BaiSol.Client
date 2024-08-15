import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useStatusMutateInstaller } from "../../../lib/API/UsersApi";

// Define TypeScript interface for props
interface InstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
  installerId: number;
  installerName: string;
  action: string;
  refetch: () => void;
}

const InstallerActionModal: React.FC<InstallerModalProps> = ({
  isOpen,
  onClose,
  installerId,
  installerName,
  action,
  refetch,
}) => {
  const updateStatus = useStatusMutateInstaller();
  const [isPending, setIsPending] = useState<boolean>(false);

  // Define valid color types for Button
  type ButtonColor =
    | "default"
    | "warning"
    | "success"
    | "danger"
    | "primary"
    | "secondary";

  const actionHandlers: Record<string, () => Promise<void>> = {
    Suspend: async () => {
      await updateStatus.mutateAsync({ id: installerId, status: "Suspended" });
      toast.success(`Installer ${installerName} is successfully suspended!`);
    },
    Activate: async () => {
      await updateStatus.mutateAsync({ id: installerId, status: "Active" });
      toast.success(`Installer ${installerName} is successfully activated!`);
    },
    Delete: async () => {
      await updateStatus.mutateAsync({ id: installerId, status: "InActive" });
      toast.success(`Installer ${installerName} is successfully deleted!`);
    },
  };

  const handleActionClick = async () => {
    if (actionHandlers[action]) {
      setIsPending(true);
      try {
        await actionHandlers[action]();
        refetch();
        onClose();
      } finally {
        setIsPending(false);
      }
    }
  };

  const getModalBody = () => {
    const messages: Record<string, string> = {
      Suspend: `Are you sure you want to suspend installer ${installerName}? This action will prevent them to continue to work.`,
      Activate: `Are you sure you want to activate installer ${installerName}? They will be able work again.`,
      Delete: `Are you sure you want to delete installer ${installerName}? This action cannot be undone.`,
    };
    return <p>{messages[action]}</p>;
  };

  const getColor = (): ButtonColor => {
    const colors: Record<string, ButtonColor> = {
      Suspend: "warning",
      Activate: "success",
      Delete: "danger",
    };
    return colors[action] || "default"; // Ensure default is a valid color
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex gap-1 tracking-wide"></ModalHeader>
        <ModalBody>{getModalBody()}</ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button
            color={getColor()}
            variant="flat"
            isLoading={isPending}
            onClick={handleActionClick}
          >
            {isPending ? "Loading..." : action}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InstallerActionModal;
