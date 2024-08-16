import React, { useEffect, useMemo, useState } from "react";
import {
  AvailMaterials,
  getAvailableMaterials,
  getMaterialCategory,
} from "../../../../lib/API/MaterialAPI";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";

interface IAdd {
  projId: string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddMaterialSupply: React.FC<IAdd> = ({
  projId,
  isOpen,
  onClose,
  refetch,
}) => {
  const [quantity, setQuantity] = useState<number>(0);

  const [availableQuantity, setAvailableQuantity] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [selectedMaterialCode, setSelectedMaterialCode] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: allMaterialCategories } = getMaterialCategory();
  const { data: availableMaterialsData, refetch: refetchMaterials } =
    getAvailableMaterials(projId, category);

  const availableMaterials = availableMaterialsData || [];

  useEffect(() => {
    if (category) {
      // Reset selected material when category changes
      setSelectedMaterialCode("");
      // Refetch available materials whenever the category changes
      refetchMaterials();
    }
  }, [category, refetchMaterials]);

  useEffect(() => {
    if (!isOpen) {
      setCategory("");
      setSelectedMaterialCode("");
    }
  }, []);

  const handleMaterialChange = (value: string, qty: number) => {
    setSelectedMaterialCode(value);
    setAvailableQuantity(qty);
  };

  const validateQtyNumber = (value: number | undefined) => {
    // Convert the value to string for validation
    return value !== undefined && /^\d{1,9}$/.test(value.toString());
  };
  const isInvalidQuantity = useMemo(() => {
    // Check if the quantity is invalid
    return quantity !== undefined && !validateQtyNumber(quantity);
  }, [quantity]);

  const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setQuantity(Number(value));
    }
  };

  return (
    <Modal placement="center" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <span>Add New Material Supply</span>
        </ModalHeader>
        <ModalBody className="grid grid-cols-2 gap-5">
          <Select label="Select category" size="sm">
            {allMaterialCategories && allMaterialCategories.length > 0 ? (
              allMaterialCategories.map((item) => (
                <SelectItem
                  key={item.category}
                  onClick={() => setCategory(item.category)}
                >
                  {item.category}
                </SelectItem>
              ))
            ) : (
              <SelectItem key={""} isDisabled>
                No Categories Available
              </SelectItem>
            )}
          </Select>
          <Select
            label="Select Material"
            size="sm"
            disabled={!availableMaterials}
          >
            {availableMaterials.length > 0 ? (
              availableMaterials.map((material) => (
                <SelectItem
                  key={material.code}
                  onClick={() =>
                    handleMaterialChange(material.code, material.quantity)
                  }
                >
                  {material.description}
                </SelectItem>
              ))
            ) : (
              <SelectItem key="no-materials" isDisabled>
                No Materials
              </SelectItem>
            )}
          </Select>
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
            defaultValue={String(availableQuantity)}
            type="text"
            value={String(availableQuantity)}
            label="Available QOH"
            variant="flat"
            size="sm"
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddMaterialSupply;
