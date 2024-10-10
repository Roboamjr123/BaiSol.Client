import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  IAllMaterials,
  useUpdateMaterialQOH,
} from "../../../../lib/API/MaterialAPI";
import {
  IAllEquipment,
  useUpdateEquipmentQOH,
} from "../../../../lib/API/EquipmentAPI";

const AddQuantitySupply: React.FC<{
  isMaterial: boolean;
  prevSupply: IAllMaterials | IAllEquipment;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}> = ({ isMaterial, isOpen, onClose, refetch, prevSupply }) => {
  const [quantity, setQuantity] = useState<number>(0);
  const updateQOH = isMaterial
    ? useUpdateMaterialQOH()
    : useUpdateEquipmentQOH();

  const handleAddQuantity = async () => {
    const handleUpdate = async (
      updateFn: (data: any) => Promise<any>,
      data: any
    ) => {
      const result = await updateFn(data);
      toast.success(result);
      refetch();
      onClose();
    };
    if (isMaterial) {
      const material = prevSupply as IAllMaterials;
      await handleUpdate(updateQOH.mutateAsync, {
        mtlId: material.mtlId,
        mtlqoh: quantity,
      });
    } else {
      const equipment = prevSupply as IAllEquipment;
      await handleUpdate(updateQOH.mutateAsync, {
        eqptId: equipment.eqptId,
        eqptqoh: quantity,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setQuantity(0);
    }
  });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setQuantity(Number(value));
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
            Add Quantity{" "}
            <span className="text-orange-500">
              {isMaterial
                ? (prevSupply as IAllMaterials).mtlDescript
                : (prevSupply as IAllEquipment).eqptDescript}
            </span>
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
            onClick={() => handleAddQuantity()}
            isDisabled={quantity <= 0}
            isLoading={updateQOH.isPending}
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
          >
            {updateQOH.isPending ? "Adding..." : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddQuantitySupply;
