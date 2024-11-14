import {
  Dropdown,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  Button,
  DropdownMenu,
  DropdownItem,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import {
  getAllAvailableClients,
  useAddNewProjectExistClient,
} from "../../../lib/API/Project/ProjectApi";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const ExistingClient = ({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) => {
  const [projectName, setProjectName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [clientId, setClientId] = useState<string>();
  const addNewProject = useAddNewProjectExistClient();
  const { data: clients } = getAllAvailableClients();
  const availableClients = clients ? clients : [];

  useEffect(() => {
    if (!isOpen) {
      setDescription("");
      setProjectName("");
      setClientId(""); // Clear position when modal closes
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      projName: projectName!,
      projDescript: description!,
      clientId: clientId!,
    };

    addNewProject.mutate(formData, {
      onSuccess: () => {
        toast.success("Project added successfully!");
        refetch();
        onClose();
        setDescription("");
        setProjectName("");
        setClientId("");
        window.location.reload();
      },
      onError: (err: any) => {
        const errorMessage =
          err?.response?.data || "An unexpected error occurred";
        toast.error(errorMessage);
      },
    });
  };

  const handleClientIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClientId(e.target.value);
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form className="gap-3" onSubmit={handleSubmit}>
          <ModalHeader>
            <div className="text-xl font-bold mb-2 text-center">
              Add New <span className="text-orange-500">Project</span> with
              existing Client
            </div>
          </ModalHeader>
          <ModalBody>
            <Select
              placeholder="Select Client"
              aria-label="select client"
              size="lg"
              className={"text-orange-400 h-full w-[50%]"}
              onChange={handleClientIdChange}
              endContent={<MdEmail className="text-lg text-orange-400" />}
            >
              {availableClients.length ? (
                availableClients.map((client) => (
                  <SelectItem key={client.clientId} value={client.clientId}>
                    {client.clientEmail}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key="" isDisabled>
                  No available clients yet :(
                </SelectItem>
              )}
            </Select>
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
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
              type="submit"
              endContent={<FaPlus className="text-small" />}
              isDisabled={
                description === "" || projectName === "" || clientId === ""
              }
              isLoading={addNewProject.isPending}
            >
              {addNewProject.isPending ? "Creating..." : "Add new project"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ExistingClient;
