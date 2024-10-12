import React, { useEffect, useState, useMemo } from "react";
import {
  LaborCost,
  useUpdateLaborCost,
} from "../../../../lib/API/Quote/LaborQuotationAPI";
import { capitalizeFirstLetter } from "../../../../lib/utils/functions";
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
import { getAssignedInstallers } from "../../../../lib/API/PersonnelAPI";

interface IEdit {
  labor: LaborCost;
  isPredefined: boolean;
  isOpen: boolean;
  projId: string;
  onClose: () => void;
  refetch: () => void;
  refetchPAM: () => void;
}

const EditLaborCost: React.FC<IEdit> = ({
  labor,
  isPredefined,
  isOpen,
  onClose,
  refetch,
  refetchPAM,
  projId,
}) => {
  const [formData, setFormData] = useState({
    description: labor.description,
    unit: labor.unit,
    quantity: labor.quantity,
    unitCost: String(labor.unitCost),
    unitNum: labor.unitNum,
  });
  const updateLaborCost = useUpdateLaborCost();
  const assignedInstallers = getAssignedInstallers(projId);

  const assignedInstallersLength = assignedInstallers.data?.length || 0;

  const checkManPower =
    labor.description === "Manpower"
      ? assignedInstallersLength > formData.quantity
      : false;

  useEffect(() => {
    setFormData({
      description: labor.description,
      unit: labor.unit,
      quantity: labor.quantity,
      unitCost: String(labor.unitCost),
      unitNum: labor.unitNum,
    });
  }, [labor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;

    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "quantity" || name === "unitNum" ? Number(value) : value,
      }));
    }
  };

  const handleUpdateClick = async () => {
    const { description, unit, quantity, unitCost, unitNum } = formData;
    if (
      labor.description === description &&
      labor.unit === unit &&
      labor.quantity === quantity &&
      labor.unitCost === Number(unitCost) &&
      labor.unitNum === unitNum
    ) {
      toast.info("No changes were made.");
      onClose();
      return;
    }

    await updateLaborCost.mutateAsync(
      {
        laborId: labor.laborId,
        description: isPredefined
          ? description
          : capitalizeFirstLetter(description),
        unit: capitalizeFirstLetter(unit),
        quantity,
        unitCost: Number(unitCost),
        unitNum,
      },
      {
        onSuccess: (data) => {
          toast.success(data);
          refetch();
          refetchPAM();
          onClose();
        },
        onError: (errM: any) => {
          toast.error(errM.response.data);
        },
      }
    );
  };

  const validateQtyNumber = (value: number | undefined) =>
    /^\d{1,9}$/.test(String(value));

  const isInvalidQuantity = useMemo(
    () => !validateQtyNumber(formData.quantity),
    [formData.quantity]
  );

  return (
    <Modal placement="center" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <span className="text-sm text-gray-600">
            Update Labor Cost{" "}
            <span className=" text-base text-orange-400 font-semibold">
              {formData.description}
            </span>
          </span>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-2">
          {isPredefined ? null : (
            <Textarea
              isRequired
              name="description"
              value={formData.description}
              variant="flat"
              label="Description"
              placeholder="Enter Labor Description"
              onChange={handleChange}
            />
          )}
          <div className="grid grid-cols-2 gap-2">
            {isPredefined ? null : (
              <Input
                isRequired
                type="text"
                name="unit"
                label="Unit"
                variant="flat"
                value={formData.unit}
                size="sm"
                onChange={handleChange}
              />
            )}

            {labor.description !== "Project Manager - Electrical Engr." &&
              labor.description !== "Manpower" && (
                <Input
                  isRequired
                  name="quantity"
                  value={String(formData.quantity)}
                  type="text"
                  label="Quantity"
                  isInvalid={isInvalidQuantity}
                  variant="flat"
                  errorMessage="Invalid quantity number!"
                  onChange={handleChange}
                  size="sm"
                  maxLength={9}
                />
              )}

            <Input
              isRequired
              type="text"
              name="unitCost"
              label="Unit Cost"
              variant="flat"
              value={formData.unitCost}
              size="sm"
              onChange={handleChange}
            />
            <Input
              isRequired
              name="unitNum"
              value={String(formData.unitNum)}
              type="text"
              label="No. of Units"
              variant="flat"
              onChange={handleChange}
              size="sm"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleUpdateClick}
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            isLoading={updateLaborCost.isPending}
            isDisabled={
              isInvalidQuantity ||
              formData.quantity <= 0 ||
              !formData.description ||
              !formData.unit ||
              formData.unitNum === 0 ||
              !formData.unitCost ||
              checkManPower
            }
          >
            {updateLaborCost.isPending ? "Saving Update..." : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditLaborCost;
