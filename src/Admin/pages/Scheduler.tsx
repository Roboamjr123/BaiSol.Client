import React from "react";
import Gantt from "../components/gantt/Gantt";
import {
  getIsOnProcessProject,
  useUpdateProjectToOnWork,
} from "../../lib/API/Project/ProjectApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@nextui-org/react";

const Scheduler: React.FC<{ isOnProcess: boolean; isOnGoing: boolean }> = ({
  isOnProcess,
  isOnGoing,
}) => {
  const { projId } = useParams<{ projId: string }>();
  const updateProjectToOnWork = useUpdateProjectToOnWork();

  const handleMakeProjectToWork = () => {
    if (
      window.confirm(
        "Click OK to make the project start to work. This action cannot be undone."
      )
    ) {
      updateProjectToOnWork.mutateAsync(
        { projId: projId! },
        {
          onSuccess: (data) => {
            toast.success(data);
            window.location.reload();
          },
        }
      );
    }
  };

  if (isOnGoing) {
    return <>Project is upcoming and not yet paid down...</>; // Message for upcoming projects
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        {isOnProcess && (
          <Button
            onClick={() => handleMakeProjectToWork()}
            isLoading={updateProjectToOnWork.isPending}
            className="bg-orange-400  text-white rounded-lg hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
          >
            Start Project
          </Button>
        )}
      </div>

      <Gantt isOnProcess={isOnProcess} />
    </div>
  );
};

export default Scheduler;
