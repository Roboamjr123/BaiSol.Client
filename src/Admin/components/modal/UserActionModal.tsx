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
import {
  useActivateUser,
  useDeleteUser,
  useSuspendUser,
} from "../../../lib/API/UsersApi";

// Define TypeScript interface for props
interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // Adjust the type according to your data structure
  email: string;
  action: string;
  refetch: () => void;
}

const UserActionModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userId,
  email,
  action,
  refetch,
}) => {
  const suspendUser = useSuspendUser();
  const activateUser = useActivateUser();
  const deleteUser = useDeleteUser();
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
      await suspendUser.mutateAsync(userId);
      toast.success(`The email ${email} user is successfully suspended!`);
    },
    Activate: async () => {
      await activateUser.mutateAsync(userId);
      toast.success(`The email ${email} user is successfully activated!`);
    },
    Delete: async () => {
      await deleteUser.mutateAsync(userId);
      toast.success(`The email ${email} user is successfully deleted!`);
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
      Suspend: `Are you sure you want to suspend the user with email ${email}? This action will prevent them from logging in.`,
      Activate: `Are you sure you want to activate the user with email ${email}? They will be able to log in again.`,
      Delete: `Are you sure you want to delete the user with email ${email}? This action cannot be undone.`,
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
        <ModalHeader className="flex gap-1 tracking-wide">
          <span className={`text-${getColor()}`}>{action}</span> User
        </ModalHeader>
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

export default UserActionModal;
