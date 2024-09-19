import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAvailableEquipment,
  getEquipmentCategory,
} from "../../../../lib/API/EquipmentAPI";
import { useAssignEquipment } from "../../../../lib/API/Quote/EquipmentAssignationAPI";
import { toast } from "react-toastify";
interface IAdd {
  projId: string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}
const AddEquipmentSupply: React.FC<IAdd> = ({
  projId,
  isOpen,
  onClose,
  refetch,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number>(0);

  const { data: allEquipmentCategories, isLoading: categoryIsLoading } =
    getEquipmentCategory();
  const {
    data: availableEquipmentsData,
    refetch: refetchEquipment,
    isLoading: availableIsLoading,
  } = getAvailableEquipment(projId, category);
  const assignEquipment = useAssignEquipment();

  const availableEquipment = availableEquipmentsData || [];

  useEffect(() => {
    if (category) {
      setSelectedEquipmentId(0);
      refetchEquipment();
    }
  }, [category, refetchEquipment]);

  useEffect(() => {
    if (!isOpen) {
      setCategory("");
      setSelectedEquipmentId(0);
      setQuantity(0);
      setAvailableQuantity(0);
      refetchEquipment();
    }
  }, [isOpen, refetchEquipment]);

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

  const handleAssignNewEquipment = () => {
    assignEquipment.mutate(
      { eqptId: selectedEquipmentId, projId: projId, eqptQuantity: quantity },
      {
        onSuccess: (data: any) => {
          toast.success(data);
          refetch();

          setCategory("");
          setSelectedEquipmentId(0);
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
          <span>Add New Equipment Supply</span>
        </ModalHeader>
        <ModalBody className="grid grid-cols-2 gap-5">
          <Select
            label="Select category"
            size="sm"
            value={[category]}
            isLoading={categoryIsLoading}
            onChange={handleCategoryChange}
          >
            {allEquipmentCategories && allEquipmentCategories.length > 0 ? (
              allEquipmentCategories.map((item) => (
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
            label="Select Equipment"
            size="sm"
            isLoading={availableIsLoading}
            disabled={!availableEquipment.length}
            value={selectedEquipmentId}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0]; // Extract the first selected key from the Set
              const selectedEquipment = availableEquipment.find(
                (equipment) => equipment.eqptId === Number(value) // Convert value back to number
              );
              setSelectedEquipmentId(Number(value)); // Store it as a number
              setAvailableQuantity(selectedEquipment?.quantity || 0);
            }}
          >
            {availableEquipment.length > 0 ? (
              availableEquipment.map((equipment) => (
                <SelectItem
                  key={equipment.eqptId}
                  value={equipment.eqptId}
                  // onClick={() =>
                  //   handleEquipmentChange(equipment.code, equipment.quantity)
                  // }
                >
                  {equipment.description}
                </SelectItem>
              ))
            ) : (
              <SelectItem key="no-equipments" isDisabled>
                No Equipments
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
            onClick={() => handleAssignNewEquipment()}
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            isLoading={assignEquipment.isPending}
            isDisabled={
              isInvalidQuantity ||
              quantity <= 0 ||
              availableQuantity < quantity ||
              !category
            }
          >
            {assignEquipment.isPending ? "Adding..." : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddEquipmentSupply;
