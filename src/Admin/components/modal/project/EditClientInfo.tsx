import React, { useEffect, useMemo, useState } from "react";
import {
  getClientProjectInfo,
  IClientProjectInfo,
  useUpdateClientProjectInfo,
} from "../../../../lib/API/Project/ProjectApi";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import Loader from "../../../../main/components/Loader";
import { toast } from "react-toastify";
import { IoIosSave } from "react-icons/io";
import { ProjectDescriptionSystemType } from "../../../../lib/constants/ProjectPackage";

interface IEdit {
  projId: string;
  isOpen: boolean;
  onClose: () => void;
  refetchInfo: () => void;
  refetchExpense: () => void;
}

const EditClientInfo: React.FC<IEdit> = ({
  projId,
  isOpen,
  onClose,
  refetchExpense,
  refetchInfo,
}) => {
  const [cNum, setCNum] = useState<string>("");
  const [kWCapacity, setkWCapacity] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [vatRate, setVATRate] = useState<string>("");
  const [isVAT, setIsVAT] = useState<boolean>(false);
  const [discount, setDiscount] = useState<string>("");
  const [sex, setSex] = useState<string>("");
  const [systemType, setSystemType] = useState<string>("");
  const [isMale, setIsMale] = useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: infos,
    isSuccess,
    refetch,
    isLoading,
  } = getClientProjectInfo(projId);
  const updateClientInfo = useUpdateClientProjectInfo();

  useEffect(() => {
    if (isOpen && !isLoading) {
      setDiscount(String(infos?.discount));
      setVATRate(String(infos?.vatRate));
      setCNum(infos?.clientContactNum!);
      setkWCapacity(infos?.kWCapacity!);
      setFirstName(infos?.clientFName!);
      setAddress(infos?.clientAddress!);
      setLastName(infos?.clientLName!);
      setProjectName(infos?.projName!);
      setDescription(infos?.projDescript!);
      setSex(infos?.sex!);
      setSystemType(infos?.systemType!);
      setIsMale(infos?.isMale!);
      setIsModalVisible(true);

      const initialVATRate = Number(infos?.vatRate); // Convert VAT rate to number
      // Set isVAT to true if VAT rate is greater than 0, false otherwise
      setIsVAT(initialVATRate > 0);
      setVATRate(initialVATRate.toString() || ""); // Set VAT rate or reset itq
    }

    if (!isOpen) {
      setDiscount("");
      setVATRate("");
      setCNum("");
      setkWCapacity(0);
      setFirstName("");
      setAddress("");
      setLastName("");
      setProjectName("");
      setDescription("");
      setIsModalVisible(false);
    }
  }, [isOpen, infos, isLoading]);

  // This function handles the checkbox toggle
  const handleVATChange = (value: boolean) => {
    setIsVAT(value); // Update the VAT state based on the checkbox
    setVATRate(value ? "12" : "0"); // Set VAT rate to 12% when checked, else reset
  };

  const validateContactNumber = (value: string) => /^\d{9}$/.test(value);
  const isInvalidCNum = useMemo(() => {
    // Check if the contact number is empty or invalid
    return cNum !== "" && !validateContactNumber(cNum);
  }, [cNum]);

  // Shared validation function
  const isInvalidNumber = (
    value: string,
    allowZero = false,
    max = Infinity
  ) => {
    const trimmed = value.trim();
    const number = parseFloat(trimmed);
    return (
      !trimmed ||
      isNaN(number) ||
      number < 0 ||
      (!allowZero && number === 0) ||
      number > max
    );
  };

  const handleCNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setCNum(value);
    }
  };

  const isInvalidDiscount = useMemo(() => {
    const trimmed = discount.trim();

    // Regular expression to match numbers formatted as 11,333,333.33
    const validFormat = /^(\d{1,3}(,\d{3})*)(\.\d{1,2})?$/.test(trimmed);

    // Remove commas to convert the string into a number correctly
    const sanitizedValue = trimmed.replace(/,/g, "");
    const number = parseFloat(sanitizedValue);

    return (
      !validFormat || // Ensure the format matches the specified pattern
      isNaN(number) || // Ensure the value is a valid number
      number < 0 || // Disallow negative numbers
    );
  }, [discount]);

  const handleUpdateClientInfo = () => {
    const hasChanges =
      projectName !== infos?.projName ||
      description !== infos?.projDescript ||
      parseFloat(discount) !== infos?.discount ||
      parseFloat(vatRate) !== infos?.vatRate ||
      firstName !== infos?.clientFName ||
      lastName !== infos?.clientLName ||
      cNum !== infos?.clientContactNum ||
      address !== infos?.clientAddress ||
      isMale !== infos?.isMale ||
      kWCapacity !== infos?.kWCapacity;

    if (!hasChanges) {
      toast.success("Client Info successfully updated!");
      return;
    }

    const formData: IClientProjectInfo = {
      projId: infos!.projId, // Assuming projId comes from infos
      projName: projectName,
      projDescript: description,
      discount: parseFloat(discount), // Convert string to number
      vatRate: parseFloat(vatRate), // Convert string to number
      clientId: infos!.clientId, // Assuming clientId comes from infos
      clientFName: firstName,
      clientLName: lastName,
      clientContactNum: cNum,
      clientAddress: address,
      kWCapacity: kWCapacity, // Convert string to number,
      isMale: isMale,
      sex: sex,
      systemType: systemType,
    };

    updateClientInfo.mutateAsync(formData, {
      onSuccess: (data) => {
        toast.success(data);

        setDiscount("");
        setVATRate("");
        setCNum("");
        setkWCapacity(0);
        setFirstName("");
        setAddress("");
        setLastName("");
        setProjectName("");
        setDescription("");

        refetchExpense();
        refetchInfo();
        refetch();
        onClose();
      },
    });
  };

  // Handler for the first autocomplete
  const handleTypeChange = (key: string | null) => {
    if (key) {
      if (key !== systemType) {
        // Only reset the kW capacity when the system type actually changes
        setkWCapacity(0);
      }
      setSystemType(key);
    } else {
      setSystemType(""); // Reset system type if key is null
    }
  };

  // Handler for the second autocomplete
  const handleKWCapacityChange = (key: number | null) => {
    setkWCapacity(key ? Number(key) : 0); // Convert key to number
  };

  const handleSexChange = (value: string) => {
    setIsMale(value === "Male");
    setSex(value);
  };

  return (
    <Modal
      placement="center"
      size="2xl"
      isOpen={isModalVisible}
      onClose={onClose}
      className="m-2 overflow-x-auto  scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100"
    >
      <ModalContent>
        <ModalHeader>
          <span className="text-sm text-gray-600">
            Edit Client{" "}
            <span className=" text-base text-orange-400 font-semibold">
              Information
            </span>
          </span>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <div className="flex flex-row gap-2">
                <Input
                  isRequired
                  value={firstName}
                  type="text"
                  label="Firstname"
                  variant="flat"
                  errorMessage={"Please fill the blank!"}
                  onChange={(e) => setFirstName(e.target.value)}
                  size="sm"
                />
                <Input
                  isRequired
                  value={lastName}
                  type="text"
                  label="Lastname"
                  variant="flat"
                  errorMessage={"Please fill the blank!"}
                  onChange={(e) => setLastName(e.target.value)}
                  size="sm"
                />
              </div>
              <div className="flex flex-row gap-2 pb-2">
                <RadioGroup
                  label="Sex"
                  value={sex}
                  size="sm"
                  orientation="horizontal"
                  color="warning"
                  onValueChange={handleSexChange}
                >
                  <Radio value="Female">Female</Radio>
                  <Radio value="Male">Male</Radio>
                </RadioGroup>
              </div>
              <div className="flex flex-row ">
                <Input
                  isRequired
                  value={cNum}
                  type="text"
                  label="Contact #"
                  isInvalid={isInvalidCNum}
                  variant="flat"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-xs">+639</span>
                    </div>
                  }
                  errorMessage={"Invalid contact number!"}
                  onChange={handleCNumChange}
                  size="sm"
                  maxLength={9}
                />
              </div>
              <div className="flex flex-row pb-2">
                <Autocomplete
                  defaultItems={ProjectDescriptionSystemType.map((item) => ({
                    label: item.type,
                    value: item.type,
                  }))}
                  label="Select Solar Type"
                  size="sm"
                  placeholder="Choose a solar type"
                  className="max-w-xs"
                  selectedKey={systemType}
                  onSelectionChange={handleTypeChange}
                >
                  {(item) => (
                    <AutocompleteItem key={item.value}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              <div className="flex flex-row">
                {systemType && (
                  <Autocomplete
                    defaultItems={
                      ProjectDescriptionSystemType.find(
                        (item) => item.type === systemType
                      )?.options.map((option) => ({
                        label: option.kWCapacity,
                        value: option.value.toString(),
                      })) || []
                    }
                    size="sm"
                    label="Select kW Capacity"
                    placeholder="Choose a kW capacity"
                    className="max-w-xs"
                    selectedKey={kWCapacity.toString()}
                    onSelectionChange={handleKWCapacityChange}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.value}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 pb-2">
                <Checkbox
                  isSelected={isVAT}
                  color="warning"
                  onValueChange={handleVATChange}
                >
                  VAT
                </Checkbox>
                <Input
                  value={discount}
                  type="text"
                  label="Discount"
                  variant="flat"
                  isInvalid={isInvalidDiscount}
                  onChange={(e) => setDiscount(e.target.value)}
                  size="sm"
                />
              </div>
              <Input
                isRequired
                value={address}
                type="text"
                label="Address"
                variant="flat"
                errorMessage={"Please fill the blank!"}
                size="sm"
                onChange={(e) => setAddress(e.target.value)}
              />
              <Input
                isRequired
                value={projectName}
                type="text"
                label="Project Name"
                variant="flat"
                errorMessage={"Please fill the blank!"}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <Textarea
                isRequired
                value={description}
                type="text"
                label="Project Description..."
                variant="flat"
                errorMessage={"Please fill the blank!"}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            type="submit"
            endContent={<IoIosSave className="text-small" />}
            isDisabled={
              description === "" ||
              projectName === "" ||
              isInvalidCNum ||
              firstName === "" ||
              lastName === "" ||
              address === "" ||
              isInvalidDiscount
            }
            isLoading={updateClientInfo.isPending}
            onClick={() => handleUpdateClientInfo()}
          >
            {updateClientInfo.isPending ? "Saving..." : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditClientInfo;
