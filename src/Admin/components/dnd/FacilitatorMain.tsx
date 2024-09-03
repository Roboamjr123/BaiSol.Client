import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  IAvailableFacilitators,
  removeAssignedFacilitatorToProject,
  useAssignFacilitatorToProject,
} from "../../../lib/API/PersonnelAPI";
import { Button, Input } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import FacilitatorDragItem from "./FacilitatorDragItem";
import FacilitatorDropZone from "./FacilitatorDropZone";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { formatName } from "../../../lib/utils/functions";

export const ItemType = "FACILITATOR";

const FacilitatorMain: React.FC<{
  facilitators: IAvailableFacilitators[];
  assignedFacilitator?: IAvailableFacilitators;
  projId: string;
  refetchAssign: () => void;
  refetchAvailable: () => void;
}> = ({
  facilitators,
  assignedFacilitator,
  projId,
  refetchAssign,
  refetchAvailable,
}) => {
  const removeAssign = removeAssignedFacilitatorToProject();

  //Assign facilitator
  const assignToProject = useAssignFacilitatorToProject();
  const handleAssign = useCallback(
    (facilitatorId: string) => {
      assignToProject.mutateAsync(
        {
          facilitatorId: facilitatorId,
          projectId: projId,
        },
        {
          onSuccess: (data) => {
            toast.success(data);
            refetchAssign();
            refetchAvailable();
          },
          onError: (error: any) => {
            if (error.response) {
              toast.error(error.response.data.message);
            } else {
              toast.error(error.response.data.message);
            }
          },
        }
      );
    },
    [assignToProject]
  );

  const [filterValue, setFilterValue] = useState<string>("");
  const [dropLocation, setDropLocation] = useState<
    IAvailableFacilitators | undefined
  >(assignedFacilitator ? assignedFacilitator : undefined);
  const [items, setItems] = useState<IAvailableFacilitators[]>(facilitators);

  useEffect(() => {
    if (assignedFacilitator !== undefined) {
      setDropLocation(assignedFacilitator);
    } else {
      setDropLocation(undefined);
    }
  }, [assignedFacilitator, setDropLocation]); // Dependency array added

  console.log("ass", assignedFacilitator);
  console.log("drop", dropLocation);
  // Filtered and sorted items based on the filter value
  const filteredItems = useMemo(() => {
    return items
      .filter(
        (fac) =>
          fac.userName.toLowerCase().includes(filterValue.toLowerCase()) ||
          fac.email.toLowerCase().includes(filterValue.toLowerCase())
      )
      .sort((a, b) => a.userName.localeCompare(b.userName));
  }, [items, filterValue]);

  // Update filter value on search input change
  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  // Handles when an item is dropped in the drop location
  const handleDrop = useCallback(
    (draggedItemIndex: number) => {
      console.log("Item dropped with index:", draggedItemIndex); // Debug
      if (dropLocation) return;

      const newDropLocation = filteredItems[draggedItemIndex];
      console.log("New drop location:", newDropLocation); // Debug
      setDropLocation(newDropLocation);
      const newItems = filteredItems.filter(
        (_, index) => index !== draggedItemIndex
      );
      setItems(newItems);
    },
    [filteredItems, dropLocation]
  );

  // Handles when remove button is clicked
  const handleRemove = useCallback(
    (facilitatorId: string) => {
      if (
        window.confirm(
          "Are you sure you want to remove this assigned facilitator?"
        )
      ) {
        if (assignedFacilitator) {
          removeAssign.mutateAsync(
            {
              facilitatorId: facilitatorId,
              projectId: projId,
            },
            {
              onSuccess: (data) => {
                toast.warning(data);
                setDropLocation(undefined);
                refetchAssign();
                refetchAvailable();
              },
            }
          );
        }

        if (dropLocation) {
          setItems((prevItems) => [...prevItems, dropLocation]);
          setDropLocation(undefined);
        }
      }
    },
    [
      assignedFacilitator,
      dropLocation,
      removeAssign,
      projId,
      refetchAssign,
      refetchAvailable,
    ]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-flow-row gap-2">
        {/* Search Input */}
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[45%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<CiSearch className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        />

        <div className="flex flex-row max-w-full gap-4 justify-between tracking-wider">
          <span className=" border text-center p-2 rounded block w-full  mb-2 text-xs text-gray-600 font-semibold">
            Available Facilitators <span className="text-gray-400">{facilitators.length}</span>
          </span>
          <span className=" border text-center p-2 rounded block w-full  mb-2 text-xs text-gray-600 font-semibold">
            Assigned Facilitator
          </span>
        </div>

        <div className="flex flex-row max-w-full gap-4 justify-between items-center">
          {/* Drag Item */}
          <div className="w-full justify-items-start overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100 h-40">
            {filteredItems.map((facilitator, index) => (
              <FacilitatorDragItem
                key={index}
                facilitator={facilitator}
                index={index}
              />
            ))}
          </div>

          {/* Drop Zone */}
          <div className="w-full justify-center">
            {assignedFacilitator ? (
              <div className="flex rounded px-2">
                <Button
                  variant="light"
                  className="max-w-full"
                  onClick={() => handleRemove(assignedFacilitator.id)}
                  endContent={<FaTimes />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-xs tracking-widest">
                      {formatName(assignedFacilitator.userName)}
                    </span>
                    <span className="text-xs text-gray-400 tracking-tight">
                      {assignedFacilitator.email}
                    </span>
                  </div>
                </Button>
              </div>
            ) : (
              <FacilitatorDropZone
                facilitator={dropLocation}
                prevFacilitator={assignedFacilitator}
                isPending={assignToProject.isPending}
                assignFacilitator={handleAssign}
                onDrop={handleDrop}
                onRemove={handleRemove}
              />
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default FacilitatorMain;
