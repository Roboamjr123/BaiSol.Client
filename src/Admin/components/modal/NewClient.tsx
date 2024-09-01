import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Button,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaEye, FaEyeSlash, FaPlus } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useAddNewProjectNewClient } from "../../../lib/API/Project/ProjectApi";
import { capitalizeFirstLetter } from "../../../lib/utils/functions";
import { toast } from "react-toastify";

const NewClient = ({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [conPassword, setConPassword] = useState<string>("");
  const [cNum, setCNum] = useState<string>("");
  const [clientMonthlyElectricBill, setClientMonthlyElectricBill] =
    useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [projectName, setProjectName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  
  const addNewProject = useAddNewProjectNewClient();

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setConPassword("");
      setCNum("");
      setClientMonthlyElectricBill("");
      setFirstName("");
      setAddress("");
      setLastName("");
      setProjectName("");
      setDescription("");
      setShowPassword(false);
    }
  }, [isOpen]);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalidEmail = useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const validatePassword = (value: string) =>
    value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/);

  const isInvalidPassword = useMemo(() => {
    if (password === "") return false;

    return validatePassword(password) ? false : true;
  }, [password]);

  // Memoized password confirmation validation result
  const isInvalidConPassword = useMemo(() => {
    if (password === conPassword) return false;
    return true;
  }, [password, conPassword]);

  const validateContactNumber = (value: string) => /^\d{9}$/.test(value);
  const isInvalidCNum = useMemo(() => {
    // Check if the contact number is empty or invalid
    return cNum !== "" && !validateContactNumber(cNum);
  }, [cNum]);

  const isInvalidBill = useMemo(() => {
    const trimmedValue = clientMonthlyElectricBill.trim();

    // Return false if the input is empty
    if (trimmedValue === "") return false;

    // Check if the value is a valid number
    const numberValue = parseFloat(trimmedValue);

    // Check if the input is all zeros or improperly formatted
    return (
      /^0+(\.0+)?$/.test(trimmedValue) || // All zeros or zeros with decimal
      isNaN(numberValue) || // Not a number
      numberValue <= 0 // Zero or negative number
    );
  }, [clientMonthlyElectricBill]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      firstName: capitalizeFirstLetter(firstName.trim()),
      lastName: capitalizeFirstLetter(lastName.trim()),
      email: email.trim(),
      password: password.trim(),
      clientContactNum: cNum.trim(),
      clientAddress: capitalizeFirstLetter(address.trim()),
      clientMonthlyElectricBill:
        parseFloat(clientMonthlyElectricBill.trim()) || 0, // Convert to number and default to 0 if empty
      projName: capitalizeFirstLetter(projectName!.trim()) || "",
      projDescript: capitalizeFirstLetter(description!.trim()) || "",
    };

    try {
      addNewProject.mutate(formData, {
        onSuccess: (data) => {
          toast.success("New Client and Project added successfully!");
          toast.success(data);
          refetch();
          onClose();
          setEmail("");
          setPassword("");
          setConPassword("");
          setCNum("");
          setClientMonthlyElectricBill("");
          setFirstName("");
          setAddress("");
          setLastName("");
          setProjectName("");
          setDescription("");
          setShowPassword(false);
        },
        onError: (error: any) => {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error(error.response.data.message);
          }
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="3xl">
      <form className="flex flex-row gap-3" onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader>
            <div className="text-xl font-bold mb-2  text-center">
              Add New <span className="text-orange-500">Project</span> with new
              Client
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col">
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
                <div>
                  <Input
                    endContent={
                      <div className="flex items-center h-full">
                        <MdEmail color="#666666" size={20} />
                      </div>
                    }
                    isRequired
                    value={email}
                    type="email"
                    label="Email"
                    variant="flat"
                    isInvalid={isInvalidEmail}
                    color={isInvalidEmail ? "danger" : "default"}
                    errorMessage={
                      isInvalidEmail ? "Please enter a valid email." : "Email"
                    }
                    onChange={(e) => setEmail(e.target.value)}
                    size="sm"
                  />
                </div>
                <div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    variant="flat"
                    size="sm"
                    endContent={
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:cursor-pointer flex items-center h-full"
                      >
                        {showPassword ? (
                          <FaEye color="#666666" size={20} />
                        ) : (
                          <FaEyeSlash color="#666666" size={20} />
                        )}
                      </div>
                    }
                    isRequired
                    label="Password"
                    isInvalid={isInvalidPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    errorMessage={
                      "Password must be: 8 to 24 characters long, include uppercase and lowercase letters, a number, and a special character (!, @, #, $, %)."
                    }
                  />
                </div>
                <div>
                  <Input
                    size="sm"
                    type={showPassword ? "text" : "password"}
                    variant="flat"
                    endContent={
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:cursor-pointer flex items-center h-full"
                      >
                        {showPassword ? (
                          <FaEye color="#666666" size={20} />
                        ) : (
                          <FaEyeSlash color="#666666" size={20} />
                        )}
                      </div>
                    }
                    isRequired
                    label="Confirm Password"
                    isInvalid={isInvalidConPassword}
                    value={conPassword}
                    onChange={(e) => setConPassword(e.target.value)}
                    autoComplete="confirm-password"
                    errorMessage={"Passwords don't match!"}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-2">
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
              endContent={<FaPlus className="text-small" />}
              isDisabled={
                description === "" ||
                projectName === "" ||
                isInvalidConPassword ||
                isInvalidPassword ||
                isInvalidEmail ||
                isInvalidCNum ||
                isInvalidBill ||
                firstName === "" ||
                lastName === "" ||
                email === "" ||
                password === ""
              }
              isLoading={addNewProject.isPending}
            >
              {addNewProject.isPending ? "Creating..." : "Add new project"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default NewClient;
