import React, { useState } from "react";
import {
  ITask,
  ITaskItem,
  useUpdateTaskProgress,
} from "../../../lib/API/Project/TasksAPI";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionItem,
  Button,
  CircularProgress,
  Input,
  Selection,
  useDisclosure,
} from "@nextui-org/react";
import { FaCheck, FaClock, FaHourglassStart } from "react-icons/fa";
import { GrStatusGoodSmall, GrTools } from "react-icons/gr";
import { IoIosArrowBack } from "react-icons/io";
import ViewImage from "./ViewImage";

const TasksToUpdateProgress: React.FC<{
  isFacilitator?: boolean;
  taskToDo: ITask[];
  refetch?: () => void;
  refetchDateInfo?: () => void;
}> = ({ isFacilitator = false, taskToDo, refetch, refetchDateInfo }) => {
  const updateTaskProgress = useUpdateTaskProgress();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file); // Set the selected image in the state
      // const imageUrl = URL.createObjectURL(file); // Create the object URL for the preview
    } else {
      setUploadedImage(null); // Reset state if no file is selected
    }
  };

  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Restrict input to numbers and a maximum of 9 digits
    if (/^\d{0,9}$/.test(value)) {
      setProgress(Number(value));
    }
  };

  const handleUpdateTask = (taskId: number) => {
    if (uploadedImage && refetch && refetchDateInfo) {
      // Show confirmation dialog
      const confirmSubmission = window.confirm(
        "Click OK to update task progress."
      );

      if (confirmSubmission) {
        updateTaskProgress.mutateAsync(
          { ProofImage: uploadedImage, id: taskId, Progress: progress },
          {
            onSuccess: (data) => {
              toast.success(data);
              setUploadedImage(null);
              setProgress(0);
              refetch();
              refetchDateInfo();
            },
          }
        );
      }
    }
  };
  const [selectedParentKey, setSelectedParentKey] = useState<Selection>(
    new Set([1])
  );
  const [selectedChildKey, setSelectedChildKey] = useState<Selection>(
    new Set([1])
  );
  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };

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

  if (!taskToDo) return <div>No tasks assigned yet!</div>;

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
      {taskToDo.map((taskParent: ITask) => (
        <Accordion
          variant="bordered"
          selectedKeys={selectedParentKey}
          onSelectionChange={setSelectedParentKey}
          itemClasses={itemClasses}
        >
          <AccordionItem
            className="p-2"
            startContent={
              taskParent.isFinished ? (
                <FaCheck className="text-green-400" />
              ) : taskParent.isStarting ? (
                <FaHourglassStart className="text-orange-400" />
              ) : taskParent.daysLate > 0 ? (
                <FaClock className="text-red-600" />
              ) : taskParent.isEnable ? (
                <GrStatusGoodSmall className="text-blue-400" />
              ) : (
                <GrStatusGoodSmall className="text-gray-400" />
              )
            }
            subtitle={
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Planned Date</span>
                  <span className="text-gray-400 text-xs">
                    {taskParent.plannedStartDate +
                      " - " +
                      taskParent.plannedEndDate}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Actual Date</span>
                  <span className="text-gray-400 text-xs">
                    {taskParent.startDate + " - " + taskParent.isFinished &&
                      taskParent.endDate}
                  </span>
                </div>
              </div>
            }
            key={taskParent.id}
            title={
              <span className="tracking-wide font-semibold flex flex-row justify-between">
                {taskParent.taskName}{" "}
                {taskParent.daysLate > 0 && (
                  <span className="text-xs text-red-600">{`Days Late: ${taskParent.daysLate}`}</span>
                )}
              </span>
            }
            aria-label={taskParent.taskName}
            indicator={<IoIosArrowBack />}
          >
            {taskParent.taskList.map((taskChild: ITaskItem) => (
              <Accordion
                variant="splitted"
                selectedKeys={selectedChildKey}
                onSelectionChange={setSelectedChildKey}
                itemClasses={itemClasses}
              >
                <AccordionItem
                  className="p-2"
                  startContent={
                    taskChild.isFinish ? (
                      <FaCheck className="text-green-400" />
                    ) : taskChild.daysLate > 0 ? (
                      <FaClock className="text-red-600" />
                    ) : taskChild.isEnable ? (
                      <GrTools className="text-orange-400" />
                    ) : (
                      <GrStatusGoodSmall className="text-gray-400" />
                    )
                  }
                  key={taskChild.id}
                  title={
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col">
                        <span className="text-black-400 text-sm tracking-wide font-semibold">
                          Planned Date
                        </span>
                        <span className="text-gray-400 text-xs">
                          {taskChild.estimationStart}
                        </span>
                      </div>

                      {taskChild.actualStart != null && (
                        <div className="flex flex-col">
                          <span className="text-black-400 text-sm tracking-wide font-semibold">
                            Project Updated At
                          </span>
                          <span className="text-gray-400 text-xs">
                            {taskChild.actualStart}
                          </span>
                        </div>
                      )}
                      {taskChild.daysLate > 0 && (
                        <span className="text-xs text-red-600">{`Days Late: ${taskChild.daysLate}`}</span>
                      )}
                    </div>
                  }
                  aria-label={taskChild.estimationStart}
                  indicator={<IoIosArrowBack />}
                  subtitle={
                    <span className="flex items-center justify-center text-sm font-semibold">
                      Progress:{" "}
                      <span
                        className={`${
                          taskChild.isFinish
                            ? "text-green-500"
                            : "text-gray-400"
                        } text-xs pl-1`}
                      >
                        <CircularProgress
                          value={taskChild.taskProgress}
                          color="success"
                          //   showValueLabel={true}
                          strokeWidth={4}
                          classNames={{
                            svg: "w-5 h-5 drop-shadow-md",
                            indicator: `${
                              taskChild.isFinish
                                ? "stroke-green-500"
                                : "stroke-orange-500"
                            }`,
                            track: `${
                              taskChild.isFinish
                                ? "stroke-green-100"
                                : "stroke-orange-100"
                            }`,
                            value: "text-md font-semibold text-success-500",
                          }}
                          size="sm"
                        />
                        {/* {taskChild.taskProgress}% */}
                      </span>
                    </span>
                  }
                >
                  <div className="flex flex-col">
                    {taskChild.isEnable &&
                      // !taskChild.isFinish &&
                      isFacilitator && (
                        <div className="flex flex-row gap-x-5 justify-between">
                          <input
                            className="block mb-5 w-[40%] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="small_size"
                            type="file"
                            accept="image/*"
                            // size="sm"
                            onChange={handleImageUpload}
                            required
                          />
                          <Input
                            isRequired
                            className="w-[30%]"
                            value={progress.toString()}
                            type="text"
                            label="Progress"
                            variant="flat"
                            errorMessage={"Invalid contact number!"}
                            onChange={handleChangeProgress}
                            size="sm"
                            maxLength={3}
                          />

                          <Button
                            isLoading={updateTaskProgress.isPending}
                            onClick={() => handleUpdateTask(taskChild.id)}
                            className="flex ml-auto items-center justify-center p-2 text-white rounded-lg bg-orange-400 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
                            isDisabled={uploadedImage === null || progress < 1}
                          >
                            {updateTaskProgress.isPending
                              ? "Submitting..."
                              : "Submit"}
                          </Button>
                        </div>
                      )}
                    {!isFacilitator && taskChild.isFinish && (
                      <span
                        onClick={() => handleViewImage(taskChild.proofImage!)}
                        className="cursor-pointer text-orange-400 text-xs"
                      >
                        View Proof
                      </span>
                    )}
                  </div>
                </AccordionItem>
              </Accordion>
            ))}
          </AccordionItem>
        </Accordion>
      ))}
      <ViewImage isOpen={viewIsOpen} onClose={viewOnClose} link={link} />
    </div>
  );
};

export default TasksToUpdateProgress;
