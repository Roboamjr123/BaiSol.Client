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
import { useAddProjectMaterialSupply } from "../../../../lib/API/Quote/ProjectQuotationAPI";
import { toast } from "react-toastify";
import { error } from "console";

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

  const { data: allMaterialCategories } = getMaterialCategory();
  const { data: availableMaterialsData, refetch: refetchMaterials } =
    getAvailableMaterials(projId, category);
  const addProjectSupply = useAddProjectMaterialSupply();

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
      setQuantity(0);
      setAvailableQuantity(0);
      refetchMaterials();
    }
  }, [isOpen, refetchMaterials]);

  // const handleMaterialChange = (value: string, qty: number) => {
  //   setSelectedMaterialCode(value);
  //   setAvailableQuantity(qty);
  // };

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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleAddNewMaerial = () => {
    addProjectSupply.mutate(
      {
        mtlCode: selectedMaterialCode,
        projId: projId,
        mtlQuantity: quantity,
      },
      {
        onSuccess: (data: any) => {
          toast.success(data);
          refetch();

          setCategory("");
          setSelectedMaterialCode("");
          setQuantity(0);
          setAvailableQuantity(0);

          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
          console.error("Something wrong with the Api: ", error);
        },
      }
    );
  };

  return (
    <Modal placement="center" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <span>Add New Material Supply</span>
        </ModalHeader>
        <ModalBody className="grid grid-cols-2 gap-5">
          <Select
            label="Select category"
            size="sm"
            value={[category]}
            onChange={handleCategoryChange}
          >
            {allMaterialCategories && allMaterialCategories.length > 0 ? (
              allMaterialCategories.map((item) => (
                <SelectItem
                  key={item.category}
                  // onClick={() => setCategory(item.category)}
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
            disabled={!availableMaterials.length}
            value={selectedMaterialCode}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0]; // Extract the first selected key from the Set
              const selectedMaterial = availableMaterials.find(
                (material) => material.code === value
              );
              setSelectedMaterialCode(String(value) || "");
              setAvailableQuantity(selectedMaterial?.quantity || 0);
            }}
          >
            {availableMaterials.length > 0 ? (
              availableMaterials.map((material) => (
                <SelectItem
                  key={material.code}
                  value={material.code}
                  // onClick={() =>
                  //   handleMaterialChange(material.code, material.quantity)
                  // }
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
            color={availableQuantity < 1 ? "danger" : "default"}
            label="Available QOH"
            variant="flat"
            size="sm"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => handleAddNewMaerial()}
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            isLoading={addProjectSupply.isPending}
            isDisabled={isInvalidQuantity || quantity <= 0 || !category}
          >
            {addProjectSupply.isPending ? "Adding..." : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddMaterialSupply;
