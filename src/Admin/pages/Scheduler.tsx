import React from "react";
import Gantt from "../components/gantt/Gantt";
import { useUpdateProjectToOnWork } from "../../lib/API/Project/ProjectApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@nextui-org/react";
import {
  getProjectActualWorkedDate,
  getProjectDateInto,
  getProjectStatus,
} from "../../lib/API/Project/GanttAPI";
import TasksUpdates from "../../main/components/Tasks/TasksUpdates";
import TaskToDos from "../../main/components/Tasks/TaskToDos";
import {
  getTaskToDo,
  getTaskToUpdateProgress,
} from "../../lib/API/Project/TasksAPI";
import Loader from "../../main/components/Loader";
import TasksToUpdateProgress from "../../main/components/Tasks/TasksToUpdateProgress";

const Scheduler: React.FC<{
  isOnProcess: boolean;
  isOnGoing: boolean;
  refetchIsOnProcess?: () => void;
}> = ({ isOnProcess, isOnGoing, refetchIsOnProcess }) => {
  const { projId } = useParams<{ projId: string }>();
  const updateProjectToOnWork = useUpdateProjectToOnWork();
  const projectTaskStatus = getProjectStatus(projId!);
  const projectTaskToDos = getTaskToUpdateProgress(projId!);
  const navigate = useNavigate();

  const {
    data: projInfo,
    isLoading,
    refetch: refetchDateInfo,
  } = getProjectDateInto(projId!);

  const { data: projActualWorkDate, isLoading: isLoadingWorkDates } =
    getProjectActualWorkedDate(projId!);

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
            navigate(`/project/${projId}`);
          },
        }
      );
    }
  };

  if (
    updateProjectToOnWork.isPending ||
    projectTaskToDos.isLoading ||
    isLoading ||
    isLoadingWorkDates
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

      <Gantt
        isOnProcess={isOnProcess}
        projInfo={projInfo!}
        projFinishDates={projActualWorkDate}
      />

      {/* <TasksUpdates tasks={projectTaskStatus.data?.tasks} /> */}
      <TasksToUpdateProgress taskToDo={projectTaskToDos.data!} />
    </div>
  );
};

export default Scheduler;
