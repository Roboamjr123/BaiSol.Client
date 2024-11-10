import React, { useCallback, useMemo, useState } from "react";
import {
  getAllProjectTasksReport,
  getTasksAndProjectCounts,
  IAllProjectTasks,
  ReportCounts,
} from "../../../lib/API/Report";
import Loader from "../../../main/components/Loader";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { GrUserWorker } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";
import ViewImage from "../../../main/components/Tasks/ViewImage";

const ProjectProgress: React.FC<{
  tasksReports: IAllProjectTasks[];
  count: ReportCounts;
}> = ({ count, tasksReports }) => {
  const [filterValue, setFilterValue] = useState("");

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredTasks = tasksReports ?? [];

    if (hasSearchFilter) {
      filteredTasks = filteredTasks.filter((task) => {
        const projId = task.projId?.toLowerCase() || "";
        const taskName = task.taskName?.toLowerCase() || "";
        const facilitatorEmail = task.facilitatorEmail?.toLowerCase() || "";
        const facilitatorName = task.facilitatorName?.toLowerCase() || "";

        return (
          projId.includes(filterValue.toLowerCase()) ||
          taskName.includes(filterValue.toLowerCase()) ||
          facilitatorEmail.includes(filterValue.toLowerCase()) ||
          facilitatorName.includes(filterValue.toLowerCase())
        );
      });
    }

    return filteredTasks;
  }, [tasksReports, filterValue, hasSearchFilter]);

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
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col w-full md:w-2/3 gap-4">
        <div className="flex items-end w-full md:w-1/4 pb-2">
          <Input
            isClearable
            classNames={{
              base: "w-full",
              inputWrapper: "border-1",
            }}
            placeholder="Search..."
            size="sm"
            startContent={<CiSearch className="text-default-300" />}
            variant="bordered"
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className="min-w-full p-9">
            <ol className="relative border-l-2 border-gray-200 dark:border-gray-700">
              {filteredItems && filteredItems.length > 0 ? (
                <div>
                  {filteredItems.map((task) => (
                    <li key={task.id} className="mb-10 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        {task.isFinished ? (
                          <GrUserWorker className="text-blue-500" />
                        ) : (
                          <GrUserWorker className="text-warning-500" />
                        )}
                      </span>
                      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-3 sm:flex-col md:flex-row">
                          <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                            {task.plannedStartDate} - {task.plannedEndDate}
                          </time>
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                            <span>{task.taskName}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-5 p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                          <div>
                            <span className="flex flex-row gap-3">
                              <strong>Planned Date Started:</strong>{" "}
                              {task.plannedStartDate}
                            </span>
                            <span className="flex flex-row gap-3">
                              <strong>Date Started:</strong> {task.startDate}
                              {task.startProofImage && (
                                <span
                                  onClick={() =>
                                    handleViewImage(task.startProofImage!)
                                  }
                                  className="cursor-pointer text-orange-400 text-xs"
                                >
                                  View Proof
                                </span>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="flex flex-row gap-3">
                              <strong>Planned Date Finished:</strong>{" "}
                              {task.plannedEndDate}
                            </span>
                            <span className="flex flex-row gap-3">
                              <strong>Date Finished:</strong> {task.endDate}
                              {task.finishProofImage && (
                                <span
                                  onClick={() =>
                                    handleViewImage(task.startProofImage!)
                                  }
                                  className="cursor-pointer text-orange-400 text-xs"
                                >
                                  View Proof
                                </span>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="flex flex-row gap-3">
                              <strong>Project ID:</strong>{" "}
                              {task.projId || "N/A"}
                            </span>
                            <span className="flex flex-row gap-3">
                              <strong>Facilitator Name:</strong>{" "}
                              {task.facilitatorName || "N/A"}
                            </span>
                            <span className="flex flex-row gap-3">
                              <strong>Facilitator Email:</strong>{" "}
                              {task.facilitatorEmail || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </div>
              ) : (
                <div className="text-orange-500 font-semibold tracking-wide">
                  No tasks available yet...
                </div>
              )}
            </ol>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-1/3 items-center justify-center gap-6">
        <Card shadow="sm" radius="lg" className="w-48">
          <CardHeader className="justify-center">
            <span className="text-primary font-semibold">Projects</span>
          </CardHeader>
          <CardBody className="p-4 flex flex-col items-center">
            <span className="text-xl font-bold">
              {count?.projectCount.finishedProject} /{" "}
              {count?.projectCount.allProject}
            </span>
          </CardBody>
        </Card>
        <Card shadow="sm" radius="lg" className="w-48">
          <CardHeader className="justify-center">
            <span className="text-primary font-semibold">Tasks</span>
          </CardHeader>
          <CardBody className="p-4 flex flex-col items-center">
            <span className="text-xl font-bold">
              {count?.taskCount.finishedTasks} / {count?.taskCount.allTasks}
            </span>
          </CardBody>
        </Card>
      </div>
      <ViewImage isOpen={viewIsOpen} onClose={viewOnClose} link={link} />
    </div>
  );
};

export default ProjectProgress;
