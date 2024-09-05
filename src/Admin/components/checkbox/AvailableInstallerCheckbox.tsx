import React, { useCallback, useMemo, useState } from "react";
import { CheckboxGroup, Checkbox, Input, cn, Button } from "@nextui-org/react";
import {
  getAssignedInstallers,
  getAvailableInstallers,
  IAvailableInstallers,
  useAssignInstallersToProject,
} from "../../../lib/API/PersonnelAPI";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";
import AssignedInstallers from "./AssignedInstallers";

interface ICheck {
  quantity: number;
  // assignedInstaller: number;
  // assignedInstallers: IAvailableInstallers[];
  projId: string;
}

const AvailableInstallerCheckbox: React.FC<ICheck> = ({
  quantity,
  // assignedInstaller,
  // assignedInstallers,
  projId,
}) => {
  const [installerSelected, setInstallerSelected] = useState<number[]>([]);

  const allInstallers = getAvailableInstallers();
  const assignInstallers = useAssignInstallersToProject();
  const assignedInstallers = getAssignedInstallers(projId);

  const assignedInstallersLength = assignedInstallers.data?.length
    ? assignedInstallers.data?.length
    : 0;

  const [filterValue, setFilterValue] = useState("");

  const filteredItems = useMemo(() => {
    let filteredInstaller = allInstallers.data ?? [];

    filteredInstaller = filteredInstaller.filter((inst) =>
      inst.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    return filteredInstaller;
  }, [allInstallers.data, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const handleSelectionChange = (selected: string[]) => {
    const selectedNumbers = selected.map((id) => parseInt(id, 10));
    // Calculate the maximum selectable installers based on the provided conditions.
    const maxSelectable = quantity - assignedInstallersLength;

    // Check if the new selection is within the limit.
    if (selectedNumbers.length <= maxSelectable) {
      setInstallerSelected(selectedNumbers);
    } else {
      // Prevent any visual checkbox changes beyond the allowed limit.
      setInstallerSelected(
        (prevSelected) => prevSelected.map((id) => id) // Keep the state unchanged.
      );
    }
  };

  const handleAssign = () => {
    assignInstallers.mutateAsync(
      {
        projectId: projId,
        installerId: installerSelected,
      },
      {
        onSuccess: (data) => {
          toast.success(data);
          allInstallers.refetch();
          assignedInstallers.refetch();
          setInstallerSelected([]);
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
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between">
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
        <span className=" text-cente p-2 rounded mb-2 text-xs text-gray-600 font-semibold">
          Selected{" "}
          <span className="text-sm text-gray-400">
            {installerSelected.length} / {quantity - assignedInstallersLength}
          </span>
        </span>
      </div>

      <div className="flex flex-row max-w-full gap-4 items-center tracking-wider">
        <span className="flex items-center justify-center border p-2 rounded w-full mb-2 text-xs text-gray-600 font-semibold">
          Available Installers{" "}
          <span className="ml-1 text-gray-400">
            {allInstallers.data?.length}
          </span>
        </span>
        <span className="flex items-center justify-center border p-2 rounded w-full mb-2 text-xs text-gray-600 font-semibold">
          Assigned Installers {assignedInstallersLength}
        </span>
      </div>

      <div className="flex flex-row justify-between w-full gap-2">
        <div className="pr-2 w-full">
          <CheckboxGroup
            value={installerSelected.map((id) => String(id))}
            onChange={handleSelectionChange}
            className="h-40 overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100"
          >
            {filteredItems.map((installer) => (
              <Checkbox
                aria-label={installer.name}
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
                key={installer.installerId}
                value={String(installer.installerId)}
              >
                <div className="flex flex-col">
                  <span className="font-semibold tracking-widest">
                    {installer.name}
                  </span>
                  <span className="text-xs text-gray-400 tracking-tight">
                    {installer.position}
                  </span>
                </div>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
        <div className="w-full">
          <AssignedInstallers
            installers={assignedInstallers.data ? assignedInstallers.data : []}
            projId={projId}
            refetchAssign={assignedInstallers.refetch}
            refetchAvailable={allInstallers.refetch}
          />
        </div>
      </div>
      <div className="flex items-end pt-4">
        <Button
          onClick={() => handleAssign()}
          isLoading={assignInstallers.isPending}
          isDisabled={
            installerSelected.length === 0 || // Disable if nothing is selected
            installerSelected.length > quantity - assignedInstallersLength // Disable if exceeding the limit
          }
          className="flex ml-auto items-center justify-center p-2 text-white rounded-lg bg-orange-400 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
        >
          {assignInstallers.isPending ? "Assigning..." : "Assign"}
        </Button>
      </div>
    </div>
  );
};

export default AvailableInstallerCheckbox;
