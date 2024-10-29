import React, { useState } from "react";
import { ProjectTasks } from "../../../lib/API/Project/GanttAPI";
import { GrUserWorker } from "react-icons/gr";
import { useDisclosure } from "@nextui-org/react";
import ViewImage from "./ViewImage";

const TasksUpdates: React.FC<{ tasks?: ProjectTasks[] }> = ({ tasks }) => {
  const [link, setLink] = useState<string>("");

  const {
    isOpen: viewIsOpen,
    onOpen: viewOnOpen,
    onClose: viewOnClose,
  } = useDisclosure();

  const handleViewImage = (link: string) => {
    setLink(link);
    viewOnOpen();
  };

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
      <div className="min-w-full p-9">
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {tasks?.map((task) => (
            <li key={task.id} className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <GrUserWorker className="text-blue-500" />
              </span>
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                <div className="items-center justify-between mb-3 sm:flex">
                  <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0"></time>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                    <span>{task.taskName}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-5 p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                  <div>
                    <span className="flex flex-row gap-3">
                      Planned Date Started: {task.plannedStartDate}
                    </span>
                    <span className="flex flex-row gap-3">
                      Date Started: {task.startDate}
                      {task.startProofImage && (
                        <span
                          onClick={() => handleViewImage(task.startProofImage!)}
                          className="cursor-pointer text-orange-400 text-xs"
                        >
                          View Proof
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="flex flex-row gap-3">
                      Planned Date Finished: {task.plannedEndDate}
                    </span>
                    <span className="flex flex-row gap-3">
                      Date Finished: {task.endDate}{" "}
                      {task.finishProofImage && (
                        <span
                          onClick={() => handleViewImage(task.startProofImage!)}
                          className="cursor-pointer text-orange-400 text-xs"
                        >
                          View Proof
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <ViewImage isOpen={viewIsOpen} onClose={viewOnClose} link={link} />
    </div>
  );
};

export default TasksUpdates;
