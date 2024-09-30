import React, { useEffect, useState } from "react";
import { IAllRequest } from "../../../lib/API/Facilitator/RequestAPI";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useUpdateRequestQuantity } from "../../../lib/API/RequisitionAPI";

interface IEdit {
  request: IAllRequest;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const EditRequestQuantityModal: React.FC<IEdit> = ({
  request,
  isOpen,
  onClose,
  refetch,
}) => {
  const updateQuantiy = useUpdateRequestQuantity();

  const [quantity, setQuantity] = useState<number>(request.quantityRequested);

  useEffect(() => {
    if (!isOpen) {
      setQuantity(0);
    }
  }, [isOpen]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setQuantity(Number(value));
    }
  };

  const handleUpdateQuantity = () => {
    if (quantity === request.quantityRequested) {
      toast.success("Quantity saved!");
      return;
    }

    updateQuantiy.mutateAsync(
      { newQuantity: quantity, reqId: request.reqId },
      {
        onSuccess: (data) => {
          toast.success(data);
          refetch();
          setQuantity(0);
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <div className="text-xl font-bold mb-2 text-center">
            Edit{" "}
            <span className="text-orange-500">{request.requestSupply}</span>{" "}
            requested quantity
          </div>
        </ModalHeader>
        <ModalBody>
          <Input
            isRequired
            value={String(quantity)}
            type="text"
            label="Quantity"
            variant="flat"
            errorMessage={"Please fill the blank!"}
            onChange={handleQuantityChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={quantity <= 0}
            isLoading={updateQuantiy.isPending}
            onClick={() => handleUpdateQuantity()}
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
          >
            {updateQuantiy.isPending ? "Saving..." : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditRequestQuantityModal;
