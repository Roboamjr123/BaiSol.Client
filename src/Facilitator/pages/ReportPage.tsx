import React from "react";
import { getAssignedProject } from "../../lib/API/Facilitator/AssignedAPI";
import { ToDos } from "../components/task/ToDOs";
import Loader from "../../main/components/Loader";
import { getTaskToDo } from "../../lib/API/Project/TasksAPI";
import TaskToDos from "../../main/components/Tasks/TaskToDos";

const ReportPage = () => {
  const { data: projId, isLoading: isLoadingId } = getAssignedProject();
  const projectTaskToDos = getTaskToDo(projId!);

  if (isLoadingId || projectTaskToDos.isLoading) return <Loader />;

  // return <ToDos projId={projId!} />;
  return (
    <TaskToDos
      taskToDo={projectTaskToDos.data!}
      refetch={projectTaskToDos.refetch}
      isFacilitator={true}
    />
  );
};

export default ReportPage;
