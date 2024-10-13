import React, { useEffect, useMemo, useState } from "react";
import {
  getMaterialCategory,
  IAddMaterial,
  useAddMaterial,
} from "../../../../lib/API/MaterialAPI";
import {
  Autocomplete,
  AutocompleteItem,
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
import {
  getEquipmentCategory,
  IAddEquipment,
  useAddEquipment,
} from "../../../../lib/API/EquipmentAPI";
import { materialUnitsOfMeasurement } from "../../../../lib/constants/UnitsOfMeasurement";
import {
  EquipmentCategories,
  MaterialCategories,
} from "../../../../lib/constants/SupplyCategories";

const AddSupply: React.FC<{
  isExistCategory?: boolean;
  isOpen: boolean;
  isMaterial: boolean;
  onClose: () => void;
  refetch: () => void;
}> = ({ isExistCategory, isMaterial, isOpen, onClose, refetch }) => {
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [category, setCategory] = useState<any>();
  const [unit, setUnit] = useState<any>(null);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setQuantity(Number(value));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) setPrice(value);
  };

  const addNewSupply = isMaterial ? useAddMaterial() : useAddEquipment();
  const { data: allMaterialCategories } = isMaterial
    ? getMaterialCategory()
    : getEquipmentCategory();

  const allSupplyCategories = isMaterial
    ? MaterialCategories
    : EquipmentCategories;

  useEffect(() => {
    if (!isOpen) {
      setDescription("");
      setPrice("");
      setQuantity(0);
      setCategory("");
      setUnit(""); // Clear position when modal closes
    }
  }, [isOpen]);

  const handleSubmitNewMaterial = async (e: React.FormEvent) => {
    e.preventDefault();

    // Correctly type formData based on isMaterial
    let formData: IAddMaterial | IAddEquipment;
    if (isMaterial) {
      formData = {
        mtlDescript: description,
        mtlPrice: Number(price),
        mtlqoh: quantity,
        mtlCategory: category,
        mtlUnit: unit,
      } as IAddMaterial;
    } else {
      formData = {
        eqptDescript: description,
        eqptPrice: Number(price),
        eqptqoh: quantity,
        eqptCategory: category,
        eqptUnit: unit,
      } as IAddEquipment;
    }

    try {
      await addNewSupply.mutateAsync(formData as IAddMaterial & IAddEquipment, {
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
            toast.error("An error occurred");
          }
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} className="p-4">
      <ModalContent>
        <ModalHeader>
          <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
            Add New{" "}
            <span className="text-orange-500">
              {isMaterial ? "Material" : "Equipment"}
            </span>
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
                <div>
                  {/* <Select
                    label="Select category"
                    size="sm"
                    value={[category]}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {allMaterialCategories &&
                    allMaterialCategories.length > 0 ? (
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
                  </Select> */}

                  <Autocomplete
                    label="Select category"
                    size="sm"
                    defaultItems={allSupplyCategories}
                    selectedKey={category}
                    onSelectionChange={setCategory}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.Value}>
                        {item.Value}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
              ) : (
                // <Input
                //   isRequired
                //   value={category}
                //   type="text"
                //   isDisabled={isExistCategory}
                //   label="Category"
                //   variant="flat"
                //   errorMessage={"Please fill the blank!"}
                //   onChange={(e) => setCategory(e.target.value)}
                // />

                <Autocomplete
                  label="Select category"
                  size="sm"
                  defaultItems={allSupplyCategories}
                  selectedKey={category}
                  onSelectionChange={setCategory}
                >
                  {(item) => (
                    <AutocompleteItem key={item.Value}>
                      {item.Value}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
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
              {/* <Input
                isRequired
                value={unit}
                type="text"
                label="Unit"
                variant="flat"
                errorMessage={"Please fill the blank!"}
                onChange={(e) => setUnit(e.target.value)}
              /> */}
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

            <Button
              isDisabled={
                description === "" ||
                unit === "" ||
                category === "" ||
                // quantity <= 0 ||
                Number(price) <= 0
              }
              isLoading={addNewSupply.isPending}
              type="submit"
              className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            >
              {addNewSupply.isPending ? "Loading..." : "Add"}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddSupply;
