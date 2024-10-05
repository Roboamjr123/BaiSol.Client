import React, { useEffect, useMemo, useState } from "react";
import {
  getClientProjectInfo,
  IClientProjectInfo,
  useUpdateClientProjectInfo,
} from "../../../../lib/API/Project/ProjectApi";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import Loader from "../../../../main/components/Loader";
import { toast } from "react-toastify";

interface IEdit {
  infos: IClientProjectInfo | undefined;
  isOpen: boolean;
  onClose: () => void;
  refetchInfo: () => void;
  refetchExpense: () => void;
}

const EditClientInfo: React.FC<IEdit> = ({
  infos,
  isOpen,
  onClose,
  refetchExpense,
  refetchInfo,
}) => {
  const [cNum, setCNum] = useState<string>(infos?.clientContactNum || "");
  const [clientMonthlyElectricBill, setClientMonthlyElectricBill] =
    useState<string>(String(infos?.clientMonthlyElectricBill || ""));
  const [firstName, setFirstName] = useState<string>(infos?.clientFName || "");
  const [lastName, setLastName] = useState<string>(infos?.clientLName || "");
  const [address, setAddress] = useState<string>(infos?.clientAddress || "");
  const [projectName, setProjectName] = useState<string>(infos?.projName || "");
  const [description, setDescription] = useState<string>(
    infos?.projDescript || ""
  );
  const [vatRate, setVATRate] = useState<string>(String(infos?.vatRate || ""));
  const [discountRate, setDiscountRate] = useState<string>(
    String(infos?.discountRate || "")
  );

  const updateClientInfo = useUpdateClientProjectInfo();

  useEffect(() => {
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
      isOpen={isOpen}
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
            <div className="flex flex-col">
              <div className="flex flex-row gap-2"> </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditClientInfo;
