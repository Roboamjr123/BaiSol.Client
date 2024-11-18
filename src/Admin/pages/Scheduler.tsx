import React from "react";
import Gantt from "../components/gantt/Gantt";
import { useUpdateProjectToOnWork } from "../../lib/API/Project/ProjectApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@nextui-org/react";
import {
  getProjectDateInto,
  getProjectStatus,
} from "../../lib/API/Project/GanttAPI";
import TasksUpdates from "../../main/components/Tasks/TasksUpdates";
import TaskToDos from "../../main/components/Tasks/TaskToDos";
import { getTaskToDo } from "../../lib/API/Project/TasksAPI";
import Loader from "../../main/components/Loader";

const Scheduler: React.FC<{
  isOnProcess: boolean;
  isOnGoing: boolean;
  refetchIsOnProcess?: () => void;
}> = ({ isOnProcess, isOnGoing, refetchIsOnProcess }) => {
  const { projId } = useParams<{ projId: string }>();
  const updateProjectToOnWork = useUpdateProjectToOnWork();
  const projectTaskStatus = getProjectStatus(projId!);
  const projectTaskToDos = getTaskToDo(projId!);

  const {
    data: projInfo,
    isLoading,
    refetch: refetchDateInfo,
  } = getProjectDateInto(projId!);

  const handleMakeProjectToWork = () => {
    if (
      refetchIsOnProcess &&
      window.confirm(
        "Click OK to make the project start to work. This action cannot be undone."
      )
    ) {
      updateProjectToOnWork.mutateAsync(
        { projId: projId! },
        {
          onSuccess: (data) => {
            toast.success(data);
            refetchIsOnProcess();
            refetchDateInfo();
            window.location.reload();
          },
        }
      );
    }
  };

  if (
    updateProjectToOnWork.isPending ||
    projectTaskToDos.isLoading ||
    isLoading
  ) {
    return <Loader />;
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

      <Gantt isOnProcess={isOnProcess} projInfo={projInfo!} />

      {/* <TasksUpdates tasks={projectTaskStatus.data?.tasks} /> */}
      <TaskToDos taskToDo={projectTaskToDos.data!} />
    </div>
  );
};

export default Scheduler;
