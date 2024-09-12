import React, { useEffect, useMemo, useState } from "react";
import {
  getMaterialCategory,
  useAddMaterial,
} from "../../../../lib/API/MaterialAPI";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { toast } from "react-toastify";

const AddMaterial: React.FC<{
  isExistCategory?: boolean;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}> = ({ isExistCategory, isOpen, onClose, refetch }) => {
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [unit, setUnit] = useState<string>("");

  const validateQuantity = (value: string) => /^\d{9}$/.test(value);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setQuantity(Number(value));
    }
  };

  const isInvalidPrice = useMemo(() => {
    const parsedPrice = parseFloat(price);
    return price !== "" && (isNaN(parsedPrice) || parsedPrice <= 0);
  }, [price]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) setPrice(value);
  };

  const addNewMaterial = useAddMaterial();
  const { data: allMaterialCategories } = getMaterialCategory();

  useEffect(() => {
    if (!isOpen) {
      setDescription("");
      setPrice("");
      setQuantity(0);
      setCategory("");
      setUnit(""); // Clear position when modal closes
    }
  }, [isOpen]);

  const handleSubmitNewMaterial = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      addNewMaterial.mutateAsync(
        {
          mtlDescript: description,
          mtlPrice: Number(price),
          mtlqoh: quantity,
          mtlCategory: category,
          mtlUnit: unit,
        },
        {
          onSuccess: (data) => {
            toast.success(data);
            refetch();
            onClose();
            setDescription("");
            setPrice("");
            setQuantity(0);
            setCategory("");
            setUnit("");
          },
          onError: (error: any) => {
            if (error.response) {
              toast.error(error.response.data.message);
            } else {
              toast.error(error.response.data.message);
            }
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} className="p-4">
      <ModalContent>
        <ModalHeader>
          <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
            Add New <span className="text-orange-500">Installer</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmitNewMaterial}
          >
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
              {isExistCategory ? (
                <Select
                  label="Select category"
                  size="sm"
                  value={[category]}
                  onChange={(e) => setCategory(e.target.value)}
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
              ) : (
                <Input
                  isRequired
                  value={category}
                  type="text"
                  isDisabled={isExistCategory}
                  label="Category"
                  variant="flat"
                  errorMessage={"Please fill the blank!"}
                  onChange={(e) => setCategory(e.target.value)}
                />
              )}
              <Input
                isRequired
                value={unit}
                type="text"
                label="Unit"
                variant="flat"
                errorMessage={"Please fill the blank!"}
                onChange={(e) => setUnit(e.target.value)}
              />
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
              <Input
                isRequired
                value={String(quantity)}
                type="text"
                label="Quantity"
                variant="flat"
                errorMessage={"Please fill the blank!"}
                onChange={handleQuantityChange}
              />
            </div>

            <Button
              isDisabled={
                description === "" ||
                unit === "" ||
                category === "" ||
                quantity <= 0 ||
                Number(price) <= 0
              }
              isLoading={addNewMaterial.isPending}
              type="submit"
              className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            >
              {addNewMaterial.isPending ? "Loading..." : "Add"}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddMaterial;
