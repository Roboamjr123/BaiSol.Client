import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
  IAllMaterials,
  useUpdateMaterialPAndQ,
  useUpdateMaterialUAndD,
} from "../../../../lib/API/MaterialAPI";

import { toast } from "react-toastify";
import {
  IAllEquipment,
  useUpdateEquipmentPAndQ,
  useUpdateEquipmentUAndD,
} from "../../../../lib/API/EquipmentAPI";
import { materialUnitsOfMeasurement } from "../../../../lib/constants/UnitsOfMeasurement";

interface IEdit {
  prevSupply: IAllMaterials | IAllEquipment;
  isMaterial: boolean;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const EditSupply: React.FC<IEdit> = ({
  prevSupply,
  isMaterial,
  isOpen,
  onClose,
  refetch,
}) => {
  const updatePandQ = isMaterial
    ? useUpdateMaterialPAndQ()
    : useUpdateEquipmentPAndQ();
  const updateDandU = isMaterial
    ? useUpdateMaterialUAndD()
    : useUpdateEquipmentUAndD();

  const [description, setDescription] = useState<string>("");
  const [unit, setUnit] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (isMaterial) {
      const material = prevSupply as IAllMaterials;
      setDescription(material.mtlDescript);
      setUnit(material.mtlUnit);
      setQuantity(material.mtlqoh);
      setPrice(material.mtlPrice);
    } else {
      const equipment = prevSupply as IAllEquipment;
      setDescription(equipment.eqptDescript);
      setUnit(equipment.eqptUnit);
      setQuantity(equipment.eqptqoh);
      setPrice(equipment.eqptPrice);
    }
  }, [prevSupply, isMaterial]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) setPrice(Number(value));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setQuantity(Number(value));
    }
  };

  const handleSaveUpdate = async () => {
    // Check if there are any changes
    const hasChanges = isMaterial
      ? (prevSupply as IAllMaterials).mtlDescript !== description ||
        (prevSupply as IAllMaterials).mtlUnit !== unit ||
        (prevSupply as IAllMaterials).mtlPrice !== price ||
        (prevSupply as IAllMaterials).mtlqoh !== quantity
      : (prevSupply as IAllEquipment).eqptDescript !== description ||
        (prevSupply as IAllEquipment).eqptUnit !== unit ||
        (prevSupply as IAllEquipment).eqptPrice !== price ||
        (prevSupply as IAllEquipment).eqptqoh !== quantity;

    if (!hasChanges) {
      toast.success(
        `The ${isMaterial ? "material" : "equipment"} was successfully updated!`
      );
      return;
    }

    const handleUpdate = async (
      updateFn: (data: any) => Promise<any>,
      data: any
    ) => {
      try {
        const result = await updateFn(data);
        toast.success(result);
        refetch();
        onClose();
      } catch (err: any) {
        toast.error(err.response.data);
      }
    };

    if (isMaterial) {
      const material = prevSupply as IAllMaterials;

      if (material.mtlDescript !== description || material.mtlUnit !== unit) {
        await handleUpdate(updateDandU.mutateAsync, {
          mtlCode: material.mtlCode,
          mtlDescript: description,
          mtlUnit: unit,
        });
      }

      if (material.mtlPrice !== price || material.mtlqoh !== quantity) {
        await handleUpdate(updatePandQ.mutateAsync, {
          mtlId: material.mtlId,
          mtlPrice: price,
          mtlqoh: quantity,
        });
      }
    } else {
      const equipment = prevSupply as IAllEquipment;

      if (
        equipment.eqptDescript !== description ||
        equipment.eqptUnit !== unit
      ) {
        await handleUpdate(updateDandU.mutateAsync, {
          eqptCode: equipment.eqptCode,
          eqptDescript: description,
          eqptUnit: unit,
        });
      }

      if (equipment.eqptPrice !== price || equipment.eqptqoh !== quantity) {
        await handleUpdate(updatePandQ.mutateAsync, {
          eqptId: equipment.eqptId,
          eqptPrice: price,
          eqptqoh: quantity,
        });
      }
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} className="p-4">
      <ModalContent>
        <ModalHeader>
          <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
            Edit{" "}
            <span className="text-orange-500">
              {isMaterial
                ? (prevSupply as IAllMaterials).mtlDescript
                : (prevSupply as IAllEquipment).eqptDescript}
            </span>
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-3">
          <Textarea
            isRequired
            value={description}
            type="text"
            label="Project Description..."
            variant="flat"
            errorMessage={"Please fill the blank!"}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-row gap-2">
            {/* <Input
              isRequired
              value={unit}
              type="text"
              label="Unit"
              variant="flat"
              errorMessage={"Please fill the blank!"}
              onChange={(e) => setUnit(e.target.value)}
            /> */}
            
            <Autocomplete
                isRequired
                
                selectedKey={unit}
                label="Unit"
                variant="flat"
                defaultItems={materialUnitsOfMeasurement}
                onSelectionChange={setUnit}
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
          </div>
          <div className="flex flex-row gap-2">
            <Input
              isRequired
              value={String(price)}
              startContent={"₱"}
              type="text"
              label="Price"
              variant="flat"
              errorMessage={"Please fill the blank!"}
              onChange={handlePriceChange}
            />
            {/* <Input
              isRequired
              value={String(quantity)}
              type="text"
              label="Quantity"
              variant="flat"
              errorMessage={"Please fill the blank!"}
              onChange={handleQuantityChange}
            /> */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => handleSaveUpdate()}
            isDisabled={
              description === "" ||
              unit === "" ||
              // quantity <= 0 ||
              Number(price) <= 0
            }
            isLoading={updateDandU.isPending || updatePandQ.isPending}
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
          >
            {updateDandU.isPending || updatePandQ.isPending
              ? "Loading..."
              : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditSupply;
