import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { FaSave } from "react-icons/fa";
import { useUpdateEquipmentAssigned } from "../../../../lib/API/Quote/EquipmentAssignationAPI";
import { getEquipmentQOH } from "../../../../lib/API/EquipmentAPI";

interface IEdit {
  suppId: number;
  eqptId: number;
  eqptDescription: string;
  prevQty: number;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const EditQuantityEquipment: React.FC<IEdit> = ({
  suppId,
  eqptId,
  eqptDescription,
  prevQty,
  isOpen,
  onClose,
  refetch,
}) => {
  const [quantity, setQuantity] = useState<number>(prevQty!);
  const [qoh, setQoh] = useState<number>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const updateEquipment = useUpdateEquipmentAssigned();

  const {
    data: equipmentQoh,
    isSuccess,
    isLoading,
    refetch: qohRefetch,
  } = getEquipmentQOH(eqptId);

  useEffect(() => {
    // Reset quantity when modal opens and prevQty changes
    if (isOpen) {
      // Set the quantity immediately
      qohRefetch();
      setQuantity(prevQty);
    }
  }, [isOpen, prevQty]);

  useEffect(() => {
    if (isOpen && isSuccess && !isLoading) {
      // Once QOH data is successfully fetched, update QOH and show the modal
      setQoh(equipmentQoh.qoh);
      setIsModalVisible(true);
    } else if (!isOpen) {
      // Close the modal
      setIsModalVisible(false);
    }
  }, [isOpen, isSuccess, isLoading, equipmentQoh]);

  const handleUpdateClick = async () => {
    console.log(suppId + " " + eqptId);
    if (quantity === prevQty) {
      toast.success("Equipment quantity updated successfully");
      onClose();
      return;
    }

    await updateEquipment.mutateAsync(
      {
        eqptId: eqptId,
        suppId: suppId,
        quantity: quantity,
      },
      {
        onSuccess: (data) => {
          toast.success(data);
          refetch();
          qohRefetch();
          onClose();
          setIsModalVisible(false); // Close modal after success
        }
      }
    );
  };

  const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setQuantity(Number(value));
    }
  };

  const validateQtyNumber = (value: number | undefined) => {
    // Convert the value to string for validation
    return value !== undefined && /^\d{1,9}$/.test(value.toString());
  };

  const isInvalidQuantity = useMemo(() => {
    // Check if the quantity is invalid
    return quantity !== undefined && !validateQtyNumber(quantity);
  }, [quantity]);

  return (
    <Modal size="xs" isOpen={isModalVisible} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <span className="text-small text-gray-600">
            Edit quantity of{" "}
            <span className="text-orange-400 text-base font-semibold">
              {eqptDescription}
            </span>
          </span>
        </ModalHeader>
        <ModalBody className="flex flex-row gap-5">
          <Input
            isRequired
            value={String(quantity)}
            type="text"
            label="Quantity"
            isInvalid={isInvalidQuantity}
            variant="flat"
            errorMessage={"Invalid quantity number!"}
            onChange={handleQuantity}
            size="sm"
            maxLength={9}
          />
          <Input
            isReadOnly
            defaultValue={String(qoh)}
            type="text"
            label="Available QOH"
            variant="flat"
            size="sm"
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end w-full">
            <Button
              className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
              endContent={<FaSave className="text-small" />}
              isDisabled={
                isInvalidQuantity || quantity === 0 || quantity === prevQty
              }
              isLoading={updateEquipment.isPending}
              onClick={() => handleUpdateClick()}
            >
              {updateEquipment.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditQuantityEquipment;
