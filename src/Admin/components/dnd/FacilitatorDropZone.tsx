import React from "react";
import { IAvailableFacilitators } from "../../../lib/API/PersonnelAPI";
import { ItemType } from "./FacilitatorMain";
import { useDrop } from "react-dnd";
import { Button } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";
import { formatName } from "../../../lib/utils/functions";

const FacilitatorDropZone: React.FC<{
  facilitator?: IAvailableFacilitators;
  prevFacilitator?: IAvailableFacilitators;
  onDrop: (index: number) => void;
  onRemove: (facilitatorId: string) => void;
  assignFacilitator: (facilitatorId: string) => void;
  isPending: boolean;
}> = ({
  facilitator,
  prevFacilitator,
  onDrop,
  onRemove,
  assignFacilitator,
  isPending,
}) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (draggedItem: { index: number }) => onDrop(draggedItem.index),
  }));
  

  return (
    <div>
      <div
        ref={drop}
        className="relative max-w-full h-32 flex items-center justify-center bg-gray-200 rounded border-2 border-dashed border-gray-400"
      >
        {facilitator ? (
          <div className="flex rounded p-2">
            <Button
              className="max-w-full"
              onClick={() => onRemove(facilitator.id)}
              endContent={<FaTimes />}
            >
              <div className="flex flex-col items-start">
                <span className="font-semibold text-xs tracking-widest">
                  {formatName(facilitator.userName)}
                </span>
                <span className="text-xs text-gray-400 tracking-tight">
                  {facilitator.email}
                </span>
              </div>
            </Button>
          </div>
        ) : (
          <span className="text-gray-500 px-2">No Facilitator Assigned</span>
        )}
      </div>
      <div className="flex items-end pt-4">
        <Button
          isDisabled={!facilitator || facilitator === prevFacilitator}
          isLoading={isPending}
          className="bg-orange-400 w-max ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
          onClick={() => assignFacilitator(facilitator?.id!)}
        >
          {isPending ? "Assigning..." : "Assign"}
        </Button>
      </div>
    </div>
  );
};

export default FacilitatorDropZone;
