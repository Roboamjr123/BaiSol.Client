import React, { useState } from "react";
import {
  getRequestMaterialSupplies,
  useRequestSupply,
} from "../../../lib/API/Facilitator/RequestAPI";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "react-toastify";

interface IAddRequest {
  isMaterial?: boolean;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddRequest: React.FC<IAddRequest> = ({
  isMaterial,
  isOpen,
  onClose,
  refetch,
}) => {
  const {
    data: supplies,
    isLoading,
    refetch: refetchSupplies,
  } = getRequestMaterialSupplies(isMaterial ? "Material" : "Equipment");
  const sendRequest = useRequestSupply();

  const [selectedToRequest, setSelectedToRequest] = useState<number[]>([]);

  const handleSelect = (selected: string[]) => {
    const selectedId = selected.map((id) => Number(id));

    setSelectedToRequest(selectedId);
  };

  const handleSendRequestSupply = () => {
    if (selectedToRequest.length === 0) {
      toast.error("Please select supplies to request.");
      return;
    }

    // Map through the selectedToRequest array to create requestDetails for each suppId
    const requestDetails = selectedToRequest.map((suppId) => ({
      suppId,
      quantityRequested: 0,
    }));

    sendRequest.mutateAsync(
      {
        requestDetails,
      },
      {
        onSuccess: (data) => {
          toast.success(data);
          onClose();
          refetch();
          refetchSupplies();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalHeader>
            <span className="text-sm text-gray-600">
              Select to request needed{" "}
              <span className=" text-base text-orange-400 font-semibold">
                {isMaterial ? "Material/s" : "Equipment"}
              </span>
            </span>
          </ModalHeader>
        </ModalHeader>
        <ModalBody>
          <span className=" text-end rounded  text-xs text-gray-600 font-semibold">
            Selected{" "}
            <span className="text-sm text-gray-400">
              {selectedToRequest.length} / {supplies?.length ?? 0}
            </span>
          </span>
          <CheckboxGroup
            value={selectedToRequest.map((id) => String(id))}
            onChange={handleSelect}
            className="h-40 px-3 overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100"
          >
            {supplies?.map((supply) => (
              <Checkbox
                aria-label={supply.supplyName}
                classNames={{
                  base: cn(
                    "inline-flex max-w-md w-full bg-content1 m-0",
                    "hover:bg-content2 items-center justify-start",
                    "cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                    "data-[selected=true]:border-warning"
                  ),
                  label: "w-full",
                  wrapper:
                    "after:bg-orange-400 after:text-background text-background",
                }}
                className="hover:bg-gray-300 rounded w-full"
                key={supply.suppId}
                value={String(supply.suppId)}
              >
                <div className="flex flex-col">
                  <span className="font-semibold tracking-widest">
                    {supply.supplyName}
                  </span>
                </div>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </ModalBody>
        <ModalFooter>
          {" "}
          <Button
            onClick={() => handleSendRequestSupply()}
            isLoading={sendRequest.isPending}
            isDisabled={
              selectedToRequest.length === 0 || (supplies?.length ?? 0) <= 0
            }
            className="flex ml-auto items-center justify-center p-2 text-white rounded-lg bg-orange-400 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
          >
            {sendRequest.isPending ? "Sending Request..." : "Send"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddRequest;
