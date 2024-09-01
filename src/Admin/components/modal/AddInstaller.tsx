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
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { capitalizeFirstLetter } from "../../../lib/utils/functions";
import { useAddNewInstaller } from "../../../lib/API/UsersApi";

interface AddNewInstaller {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddInstaller: React.FC<AddNewInstaller> = ({
  isOpen,
  onClose,
  refetch,
}) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const addNewInstaller = useAddNewInstaller();

  useEffect(() => {
    if (!isOpen) {
      setFirstName("");
      setLastName("");
      setPosition(""); // Clear position when modal closes
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name:
        capitalizeFirstLetter(firstName) +
        " " +
        capitalizeFirstLetter(lastName),
      position: position,
    };

    try {
      addNewInstaller.mutate(formData, {
        onSuccess: (data) => {
          toast.success(data);
          refetch();
          onClose();
          setFirstName("");
          setLastName("");
          setPosition("");
        },
        onError: (error: any) => {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error(error.response.data.message);
          }
        },
      });
    } catch (e) {
      console.error("Error submitting form:", e);
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
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-2">
              <Input
                isRequired
                value={firstName}
                type="text"
                label="Firstname"
                variant="flat"
                errorMessage={"Please fill the blank!"}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                isRequired
                value={lastName}
                type="text"
                label="Lastname"
                variant="flat"
                errorMessage={"Please fill the blank!"}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="block relative">
              <Dropdown>
                <DropdownTrigger>
                  <Button>
                    {position === "" ? "Choose Position" : position}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="flat"
                  aria-label="Installer positions"
                  selectionMode="single"
                  selectedKeys={[position]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setPosition(selectedKey || ""); // Default to empty string if no key is selected
                  }}
                >
                  <DropdownItem key="Engineer">Engineer</DropdownItem>
                  <DropdownItem key="Tig-Alsa">Tig-Alsa</DropdownItem>
                  <DropdownItem key="Tambay">Tambay</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <Button
              isDisabled={
                firstName === "" || lastName === "" || position === ""
              }
              isLoading={addNewInstaller.isPending}
              type="submit"
              className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            >
              {addNewInstaller.isPending ? "Loading..." : "Add"}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddInstaller;
