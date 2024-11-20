import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { getClientProjId } from "../../lib/API/Client/ClientProjectAPI";
import {
  getProjectProgress,
  getProjectStatus,
} from "../../lib/API/Project/GanttAPI";
import TasksUpdates from "../../main/components/Tasks/TasksUpdates";
import { Card, CircularProgress } from "@nextui-org/react";
import Loader from "../../main/components/Loader";
import { getTaskToDo } from "../../lib/API/Project/TasksAPI";
import TaskToDos from "../../main/components/Tasks/TaskToDos";

const ClientProjectReport: React.FC<{ projectId?: string }> = ({
  projectId,
}) => {
  const { projId } = useParams<{ projId: string }>();
  const { data: clientProjId, isLoading: isloadingId } = getClientProjId();
  const { data: taskReports, isLoading: isloadingPs } = getProjectStatus(
    projectId ?? projId!
  );
  const { data: progress, isLoading: isloadingPP } = getProjectProgress(
    projectId ?? projId!
  );
  const { data: toDos, isLoading: isLoadingToDos } = getTaskToDo(
    projectId ?? projId!
  );

  if (!projectId) {
    if (
      (projId && clientProjId && projId !== clientProjId.projId) ||
      !clientProjId
    ) {
      return <Navigate to="/" />;
    }
  }

  if (isloadingId || isloadingPP || isloadingPs || isLoadingToDos)
    return <Loader />;

  return (
    <div className="flex flex-row space-y-4">
      {/* Tasks Updates Section */}
      <div className="w-3/4">
        <TaskToDos taskToDo={toDos!} />
      </div>

      {/* Assigned Facilitator Section */}
      <div className="flex flex-col justify-center w-1/4 px-2 gap-5">
        <Card className="p-2">
          <h3 className="text-sm font-semibold">
            Assigned Facilitator:{" "}
            {taskReports?.info?.assignedFacilitator || "Not assigned"}
          </h3>
          <div className="flex space-x-4 justify-evenly pt-2">
            <span className="text-xs text-gray-500">
              Estimated Start Date:{" "}
              {taskReports?.info?.estimatedStartDate
                ? new Date(
                    taskReports.info.estimatedStartDate
                  ).toLocaleDateString()
                : "Not provided"}
            </span>
            <span className="text-xs text-gray-500">
              Estimated End Date:{" "}
              {taskReports?.info?.estimatedEndDate
                ? new Date(
                    taskReports.info.estimatedEndDate
                  ).toLocaleDateString()
                : "Not provided"}
            </span>
          </div>
        </Card>
        <Card className="flex items-center justify-center pt-4">
          <CircularProgress
            label="Project Progress"
            size="lg"
            value={progress?.progress}
            color="warning"
            showValueLabel={true}
            className="text-xs text-gray-500"
          />
        </Card>
      </div>
    </div>
  );
};

export default ClientProjectReport;
