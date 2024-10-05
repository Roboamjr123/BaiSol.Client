import React, { useEffect, useMemo, useState } from "react";
import {
  getClientProjectInfo,
  IClientProjectInfo,
  useUpdateClientProjectInfo,
} from "../../../../lib/API/Project/ProjectApi";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import Loader from "../../../../main/components/Loader";
import { toast } from "react-toastify";
import { IoIosSave } from "react-icons/io";

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
  const [clientMonthlyElectricBill, setClientMonthlyElectricBill] =
    useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [vatRate, setVATRate] = useState<string>("");
  const [discountRate, setDiscountRate] = useState<string>("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: infos, isSuccess, isLoading } = getClientProjectInfo(projId);
  const updateClientInfo = useUpdateClientProjectInfo();

  useEffect(() => {
    if (isOpen && !isLoading) {
      setDiscountRate(String(infos?.discountRate));
      setVATRate(String(infos?.vatRate));
      setCNum(infos?.clientContactNum!);
      setClientMonthlyElectricBill(String(infos?.clientMonthlyElectricBill));
      setFirstName(infos?.clientFName!);
      setAddress(infos?.clientAddress!);
      setLastName(infos?.clientLName!);
      setProjectName(infos?.projName!);
      setDescription(infos?.projDescript!);
      setIsModalVisible(true);
    }

    if (!isOpen) {
      setDiscountRate("");
      setVATRate("");
      setCNum("");
      setClientMonthlyElectricBill("");
      setFirstName("");
      setAddress("");
      setLastName("");
      setProjectName("");
      setDescription("");
      setIsModalVisible(false);
    }
  }, [isOpen]);

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

  const handleMBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setClientMonthlyElectricBill(value);
    }
  };

  // Validation for each field
  const isInvalidBill = useMemo(
    () => isInvalidNumber(clientMonthlyElectricBill),
    [clientMonthlyElectricBill]
  );
  const isInvalidVAT = useMemo(
    () => isInvalidNumber(vatRate, false, 100),
    [vatRate]
  ); // Max VAT = 100%
  const isInvalidDiscount = useMemo(
    () => isInvalidNumber(discountRate, false, 100),
    [discountRate]
  ); // Max discount = 100%

  const handleUpdateClientInfo = () => {
    const hasChanges =
      projectName !== infos?.projName ||
      description !== infos?.projDescript ||
      parseFloat(discountRate) !== infos?.discountRate ||
      parseFloat(vatRate) !== infos?.vatRate ||
      firstName !== infos?.clientFName ||
      lastName !== infos?.clientLName ||
      cNum !== infos?.clientContactNum ||
      address !== infos?.clientAddress ||
      parseFloat(clientMonthlyElectricBill) !==
        infos?.clientMonthlyElectricBill;

    if (!hasChanges) {
      toast.success("Client Info successfully updated!");
      return;
    }

    const formData: IClientProjectInfo = {
      projId: infos!.projId, // Assuming projId comes from infos
      projName: projectName,
      projDescript: description,
      discountRate: parseFloat(discountRate), // Convert string to number
      vatRate: parseFloat(vatRate), // Convert string to number
      clientId: infos!.clientId, // Assuming clientId comes from infos
      clientFName: firstName,
      clientLName: lastName,
      clientContactNum: cNum,
      clientAddress: address,
      clientMonthlyElectricBill: parseFloat(clientMonthlyElectricBill), // Convert string to number
    };

    updateClientInfo.mutateAsync(formData, {
      onSuccess: (data) => {
        toast.success(data);

        setDiscountRate("");
        setVATRate("");
        setCNum("");
        setClientMonthlyElectricBill("");
        setFirstName("");
        setAddress("");
        setLastName("");
        setProjectName("");
        setDescription("");

        refetchExpense();
        refetchInfo();
        onClose();
      },
    });
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
              </div>{" "}
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
              <div className="flex flex-row ">
                <Input
                  isRequired
                  value={clientMonthlyElectricBill}
                  type="text"
                  label="Monthly Electric Bill"
                  variant="flat"
                  errorMessage={
                    isInvalidBill ? "Must be a non-zero amount!" : ""
                  }
                  onChange={handleMBillChange}
                  size="sm"
                  isInvalid={isInvalidBill}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <Input
                  isRequired
                  value={vatRate}
                  type="text"
                  label="VAT Rate"
                  variant="flat"
                  isInvalid={isInvalidVAT}
                  errorMessage={"Please fill the blank!"}
                  onChange={(e) => setVATRate(e.target.value)}
                  size="sm"
                />
                <Input
                  isRequired
                  value={discountRate}
                  type="text"
                  label="Discount Rate"
                  variant="flat"
                  isInvalid={isInvalidDiscount}
                  errorMessage={"Please fill the blank!"}
                  onChange={(e) => setDiscountRate(e.target.value)}
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
              isInvalidBill ||
              firstName === "" ||
              lastName === "" ||
              discountRate === "" ||
              address === "" ||
              discountRate === "" ||
              vatRate === "" ||
              isInvalidDiscount ||
              isInvalidVAT
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
