import React, { useEffect, useMemo, useState } from "react";
import { updateProjectMaterialSupply } from "../../../../lib/API/Quote/QuotationAPI";
import { toast } from "react-toastify";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { FaSave } from "react-icons/fa";
import { getMaterialQOH } from "../../../../lib/API/MaterialAPI";

interface IEdit {
  suppId: number;
  mtlId: number;
  mtlDescription: string;
  prevQty: number;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const EditQuantityMaterialModal: React.FC<IEdit> = ({
  suppId,
  mtlId,
  mtlDescription,
  prevQty,
  isOpen,
  onClose,
  refetch,
}) => {
  const [quantity, setQuantity] = useState<number>(prevQty!);
  const [qoh, setQoh] = useState<number>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const updateMaterial = updateProjectMaterialSupply();

  const {
    data: materialQoh,
    isSuccess,
    isLoading,
    refetch: qohRefetch,
  } = getMaterialQOH(mtlId);

  useEffect(() => {
    // Reset quantity when modal opens and prevQty changes
    if (isOpen) {
      // Set the quantity immediately
      qohRefetch();
      setQuantity(prevQty);
    }
  }, [isOpen, prevQty, materialQoh, isSuccess]);

  useEffect(() => {
    if (isOpen && isSuccess && !isLoading) {
      // Once QOH data is successfully fetched, update QOH and show the modal
      setQoh(materialQoh.qoh);
      setIsModalVisible(true);
    } else if (!isOpen) {
      // Close the modal
      setIsModalVisible(false);
    }
  }, [isOpen, isSuccess, isLoading, materialQoh]);

  const handleUpdateClick = async () => {
    const data = {
      suppId: suppId,
      mtlId: mtlId,
      quantity: quantity!,
    };

    if (quantity === prevQty) {
      toast.success("Material quantity updated successfully");
      onClose();
      return;
    }

    await updateMaterial.mutateAsync(data, {
      onSuccess: (data) => {
        toast.success(data);
        refetch();
        qohRefetch();
        onClose();
        setIsModalVisible(false); // Close modal after success
      },
      onError: (errM: any) => {
        toast.error(errM.response.data);
      },
    });
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
            <span className="text-gray-800 text-base font-semibold">
              {mtlDescription}
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
              className="bg-orange-400 w-max m-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
              endContent={<FaSave className="text-small" />}
              isDisabled={
                isInvalidQuantity || quantity === 0 || quantity === prevQty
              }
              isLoading={updateMaterial.isPending}
              onClick={() => handleUpdateClick()}
            >
              {updateMaterial.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditQuantityMaterialModal;
