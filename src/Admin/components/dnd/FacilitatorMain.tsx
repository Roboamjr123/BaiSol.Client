import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAvailableFacilitators,
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
  >(undefined);
  const [items, setItems] = useState<IAvailableFacilitators[]>(facilitators);

  useEffect(() => {
    if (assignedFacilitator !== undefined) {
      setDropLocation(assignedFacilitator);
    }
  }, [assignedFacilitator]); // Dependency array added

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
      // Check if the drop zone is empty before allowing the drop
      if (dropLocation) return;

      const newDropLocation = filteredItems[draggedItemIndex];
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
        if (assignedFacilitator !== undefined) {
          removeAssign.mutateAsync(
            {
              facilitatorId: facilitatorId,
              projectId: projId,
            },
            {
              onSuccess: (data) => {
                toast.info(data);
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
    [dropLocation]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid sm:grid-flow-row grid-flow-col gap-2">
        {/* Search Input */}
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
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

        <span className=" border p-2 rounded block max-w-full  mb-2 text-xs text-gray-600 font-semibold">
          Available Facilitators
        </span>

        <div className="flex flex-row justify-evenly">
          {/* Drag Item */}
          <div className="max-w-full justify-items-start overflow-y-auto h-40">
            {filteredItems.map((facilitator, index) => (
              <FacilitatorDragItem
                key={index}
                facilitator={facilitator}
                index={index}
              />
            ))}
          </div>

          {/* Drop Zone */}
          <div>
            <FacilitatorDropZone
              facilitator={dropLocation}
              prevFacilitator={assignedFacilitator}
              isPending={assignToProject.isPending}
              assignFacilitator={handleAssign}
              onDrop={handleDrop}
              onRemove={handleRemove}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default FacilitatorMain;
