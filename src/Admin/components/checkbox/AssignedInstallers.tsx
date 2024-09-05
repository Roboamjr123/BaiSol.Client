import React from "react";
import {
  IAvailableInstallers,
  removeAssignedInstallerToProject,
} from "../../../lib/API/PersonnelAPI";
import { FaTimes } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import { formatName } from "../../../lib/utils/functions";
import { toast } from "react-toastify";

const AssignedInstallers: React.FC<{
  installers: IAvailableInstallers[];
  projId: string;
  refetchAvailable: () => void;
  refetchAssign: () => void;
}> = ({ installers, projId, refetchAvailable, refetchAssign }) => {
  const removeInstaller = removeAssignedInstallerToProject();

  const handleRemove = (installerId: number) => {
    if (
      window.confirm(
        "Are you sure you want to remove this assigned installer?"
      )
    ) {
      removeInstaller.mutateAsync(
        {
          installerIds: installerId,
          projectId: projId,
        },
        {
          onSuccess: (data) => {
            toast.success(data);
            refetchAvailable();
            refetchAssign();
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
    }
  };

  return (
    <div className="flex flex-col items-start max-w-full rounded px-2">
      {installers.map((installer) => (
        <Button
          variant="light"
          className="w-full justify-between"
          onClick={() => handleRemove(installer.installerId)}
          endContent={<FaTimes />}
        >
          <div className="flex flex-col items-start">
            <span className="font-semibold text-xs tracking-widest">
              {formatName(installer.name)}
            </span>
            <span className="text-xs text-gray-400 tracking-tight">
              {installer.position}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default AssignedInstallers;
