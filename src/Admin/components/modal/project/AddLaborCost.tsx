import React, { useEffect, useMemo, useState } from "react";
import { useAddLaborCost } from "../../../../lib/API/Quote/LaborQuotationAPI";
import { toast } from "react-toastify";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { capitalizeFirstLetter } from "../../../../lib/utils/functions";

interface IAdd {
  projId: string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  refetchPAM: () => void;
}

const AddLaborCost: React.FC<IAdd> = ({
  projId,
  isOpen,
  onClose,
  refetch,
  refetchPAM,
}) => {
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unitNum, setUnitNum] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");
  const [unitCost, setUnitCost] = useState<string>("");

  const addCost = useAddLaborCost();

  useEffect(() => {
    if (!isOpen) {
      setUnit("");
      setDescription("");
      setUnitNum(0);
      setQuantity(0);
      setUnitCost("");
    }
  }, [isOpen]);

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

  const handleUnitcost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setUnitCost(value);
    }
  };

  const handleUnitNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setUnitNum(Number(value));
    }
  };

  const handleAddNewLabor = () => {
    addCost.mutate(
      {
        description: capitalizeFirstLetter(description.trim()),
        quantity: quantity,
        unit: capitalizeFirstLetter(unit.trim()),
        unitNum: unitNum,
        unitCost: Number(unitCost),
        projId: projId,
      },
      {
        onSuccess: (data: any) => {
          toast.success(data);
          refetch();
          refetchPAM();

          setUnit("");
          setDescription("");
          setUnitNum(0);
          setQuantity(0);
          setUnitCost("");

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
          <span>Add New Labor Cost</span>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          <Textarea
            isRequired
            variant="flat"
            label="Description"
            placeholder="Enter Labor Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              isRequired
              type="text"
              label="Unit"
              variant="flat"
              value={unit}
              size="sm"
              onChange={(e) => setUnit(e.target.value)}
            />
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
              isRequired
              type="text"
              label="Unit Cost"
              variant="flat"
              value={String(unitCost)}
              size="sm"
              onChange={handleUnitcost}
            />
            <Input
              isRequired
              value={String(unitNum)}
              type="text"
              label="No. of Units"
              variant="flat"
              onChange={handleUnitNum}
              size="sm"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => handleAddNewLabor()}
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            isLoading={addCost.isPending}
            isDisabled={
              isInvalidQuantity ||
              quantity <= 0 ||
              description === "" ||
              unit === "" ||
              unitNum === 0 ||
              unitCost === ""
            }
          >
            {addCost.isPending ? "Adding..." : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddLaborCost;
