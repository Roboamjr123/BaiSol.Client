import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useUpdateProfitRate } from "../../../../lib/API/Project/ProjectApi";

const EditProfitRate: React.FC<{
  projId: string;
  prevProfitRate: number;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  refetchLabor: () => void;
}> = ({ isOpen, onClose, prevProfitRate, projId, refetch, refetchLabor }) => {
  const [profitRate, setProfitRate] = useState<number>(prevProfitRate);

  const updateProfit = useUpdateProfitRate();

  const handleProfitRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setProfitRate(Number(value));
    }
  };

  const handleUpdateProfit = async () => {
    await updateProfit.mutateAsync(
      {
        profitRate: profitRate,
        projId: projId,
      },
      {
        onSuccess: (data) => {
          toast.success(data);
          onClose();
          refetch();
          refetchLabor();
        },
      }
    );
  };

  return (
    <Modal placement="center" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <span className="text-sm text-gray-600">Edit profit rate</span>
        </ModalHeader>
        <ModalBody>
          <Input
            isRequired
            value={String(profitRate)}
            type="text"
            label="Profit Rate %"
            variant="flat"
            onChange={handleProfitRate}
            size="sm"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleUpdateProfit}
            className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            isLoading={updateProfit.isPending}
            isDisabled={profitRate < 1 || profitRate > 30}
          >
            {updateProfit.isPending ? "Saving Update..." : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfitRate;
