import React from "react";
import { getAssignedProject } from "../../lib/API/Facilitator/AssignedAPI";
import { ToDos } from "../components/task/ToDOs";
import Loader from "../../main/components/Loader";
import { getTaskToDo } from "../../lib/API/Project/TasksAPI";
import TaskToDos from "../../main/components/Tasks/TaskToDos";
import Gantt from "../../Admin/components/gantt/Gantt";
import { getProjectDateInto } from "../../lib/API/Project/GanttAPI";

const ReportPage = () => {
  const { data: projId, isLoading: isLoadingId } = getAssignedProject();
  const projectTaskToDos = getTaskToDo(projId!);
  const {
    data: projInfo,
    isLoading,
    refetch: refetchDateInfo,
  } = getProjectDateInto(projId!);

  if (isLoadingId || isLoading || projectTaskToDos.isLoading) return <Loader />;

  // return <ToDos projId={projId!} />;
  return (
    <div className="flex flex-col gap-5">
      <Gantt isOnProcess={false} facProjId={projId} projInfo={projInfo!} />
      <TaskToDos
        taskToDo={projectTaskToDos.data!}
        refetch={projectTaskToDos.refetch}
        isFacilitator={true}
        refetchDateInfo={refetchDateInfo}
      />
    </div>
  );
};

export default ReportPage;
