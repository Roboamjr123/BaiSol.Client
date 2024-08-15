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
  const updateMaterial = updateProjectMaterialSupply();

  const { data: materialQoh, isSuccess } = getMaterialQOH(mtlId);

  useEffect(() => {
    // Reset quantity when modal opens and prevQty changes
    if (isOpen) {
      setQuantity(prevQty);
    }

    if (isSuccess) {
      setQoh(materialQoh.qoh);
    }
  }, [isOpen, prevQty, materialQoh, isSuccess]);

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
        onClose();
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
    <Modal size="xs" isOpen={isOpen} onClose={onClose}>
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
            isDisabled
            defaultValue={String(qoh)}
            type="text"
            label="QOH"
            variant="flat"
            size="sm"
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end w-full">
            <Button
              className="bg-orange-400 w-max m-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
              endContent={<FaSave className="text-small" />}
              isDisabled={isInvalidQuantity || quantity === 0}
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
