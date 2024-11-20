import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Selection,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FaCheck, FaClock, FaHourglassStart } from "react-icons/fa";
import { GrStatusGoodSmall, GrTools } from "react-icons/gr";
import { IoIosArrowBack } from "react-icons/io";
import ViewImage from "./ViewImage";
import {
  ITask,
  ITaskItem,
  useSubmitTaskReport,
} from "../../../lib/API/Project/TasksAPI";
import { toast } from "react-toastify";

const TaskToDos: React.FC<{
  isFacilitator?: boolean;
  taskToDo: ITask[];
  refetch?: () => void;
}> = ({ isFacilitator = false, taskToDo, refetch }) => {
  //   interface ITaskItem {
  //     id: number;
  //     proofImage: string | null;
  //     actualStart: string;
  //     estimationStart: string;
  //     taskProgress: number;
  //     isFinish: boolean;
  //     isEnable: boolean;
  //     isLate: boolean;
  //     daysLate: number;
  //   }

  //   interface ITask {
  //     id: number;
  //     taskName: string;
  //     plannedStartDate: string;
  //     plannedEndDate: string;
  //     startDate: string;
  //     endDate: string;
  //     isEnable: boolean;
  //     isFinished: boolean;
  //     isStarting: boolean;
  //     daysLate: number;
  //     taskList: ITaskItem[];
  //   }

  //   const taskToDo: ITask[] = [
  //     {
  //       id: 8,
  //       taskName: "New Task 7",
  //       plannedStartDate: "Nov 19, 2024",
  //       plannedEndDate: "Nov 19, 2024",
  //       startDate: "",
  //       endDate: "",
  //       isEnable: true,
  //       isFinished: false,
  //       isStarting: false,
  //       daysLate: 9,
  //       taskList: [
  //         {
  //           id: 52,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 19, 2024",
  //           taskProgress: 100,
  //           isFinish: true,
  //           isEnable: true,
  //           isLate: false,
  //           daysLate: 3,
  //         },
  //       ],
  //     },
  //     {
  //       id: 7,
  //       taskName: "New Task 6",
  //       plannedStartDate: "Nov 20, 2024",
  //       plannedEndDate: "Nov 26, 2024",
  //       startDate: "",
  //       endDate: "",
  //       isEnable: true,
  //       isFinished: false,
  //       isStarting: false,
  //       daysLate: 0,
  //       taskList: [
  //         {
  //           id: 53,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 20, 2024",
  //           taskProgress: 20,
  //           isFinish: false,
  //           isEnable: true,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 54,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 21, 2024",
  //           taskProgress: 40,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 55,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 22, 2024",
  //           taskProgress: 60,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 56,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 23, 2024",
  //           taskProgress: 80,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 57,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 24, 2024",
  //           taskProgress: 100,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //       ],
  //     },
  //     {
  //       id: 9,
  //       taskName: "New Task 8",
  //       plannedStartDate: "Nov 20, 2024",
  //       plannedEndDate: "Nov 22, 2024",
  //       startDate: "",
  //       endDate: "",
  //       isEnable: true,
  //       isFinished: false,
  //       isStarting: false,
  //       daysLate: 0,
  //       taskList: [
  //         {
  //           id: 58,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 20, 2024",
  //           taskProgress: 33,
  //           isFinish: false,
  //           isEnable: true,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 59,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 21, 2024",
  //           taskProgress: 66,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 60,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 22, 2024",
  //           taskProgress: 100,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //       ],
  //     },
  //     {
  //       id: 5,
  //       taskName: "New Task 4",
  //       plannedStartDate: "Nov 21, 2024",
  //       plannedEndDate: "Nov 27, 2024",
  //       startDate: "",
  //       endDate: "",
  //       isEnable: true,
  //       isFinished: false,
  //       isStarting: false,
  //       daysLate: 0,
  //       taskList: [
  //         {
  //           id: 61,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 21, 2024",
  //           taskProgress: 20,
  //           isFinish: false,
  //           isEnable: true,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 62,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 22, 2024",
  //           taskProgress: 40,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 63,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 23, 2024",
  //           taskProgress: 60,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 64,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 24, 2024",
  //           taskProgress: 80,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 65,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 25, 2024",
  //           taskProgress: 100,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //       ],
  //     },
  //     {
  //       id: 4,
  //       taskName: "New Task 3",
  //       plannedStartDate: "Nov 27, 2024",
  //       plannedEndDate: "Nov 29, 2024",
  //       startDate: "",
  //       endDate: "",
  //       isEnable: false,
  //       isFinished: false,
  //       isStarting: false,
  //       daysLate: 0,
  //       taskList: [
  //         {
  //           id: 66,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 27, 2024",
  //           taskProgress: 33,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 67,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 28, 2024",
  //           taskProgress: 66,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //         {
  //           id: 68,
  //           proofImage: null,
  //           actualStart: "",
  //           estimationStart: "Nov 29, 2024",
  //           taskProgress: 100,
  //           isFinish: false,
  //           isEnable: false,
  //           isLate: false,
  //           daysLate: 0,
  //         },
  //       ],
  //     },
  //   ];

  const submitTaskReport = useSubmitTaskReport();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file); // Set the selected image in the state
      const imageUrl = URL.createObjectURL(file); // Create the object URL for the preview
    } else {
      setUploadedImage(null); // Reset state if no file is selected
    }
  };

  const handleImageSubmit = (taskId: number) => {
    if (uploadedImage && refetch) {
      // Show confirmation dialog
      const confirmSubmission = window.confirm(
        "Click OK to submit task report."
      );

      if (confirmSubmission) {
        submitTaskReport.mutateAsync(
          { ProofImage: uploadedImage, id: taskId },
          {
            onSuccess: (data) => {
              toast.success(data);
              setUploadedImage(null);
              refetch();
            },
          }
        );
      }
    }
  };

  const [selectedParentKey, setSelectedParentKey] = React.useState<Selection>(
    new Set([1])
  );
  const [selectedChildKey, setSelectedChildKey] = React.useState<Selection>(
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
                    {taskParent.startDate + " - " + taskParent.endDate}
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
                      <div className="flex flex-col">
                        <span className="text-black-400 text-sm tracking-wide font-semibold">
                          Actual Date
                        </span>
                        <span className="text-gray-400 text-xs">
                          {taskChild.actualStart}
                        </span>
                      </div>{" "}
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
                        {" "}
                        {taskChild.taskProgress}%
                      </span>
                    </span>
                  }
                >
                  <div className="flex flex-col">
                    {taskChild.isEnable &&
                      !taskChild.isFinish &&
                      isFacilitator && (
                        <div className="flex flex-row justify-between">
                          <Input
                            className="block mb-5 w-[50%] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="small_size"
                            type="file"
                            accept="image/*"
                            size="sm"
                            onChange={handleImageUpload}
                            required
                          />
                          <Button
                            isLoading={submitTaskReport.isPending}
                            onClick={() => handleImageSubmit(taskChild.id)}
                            className="flex ml-auto items-center justify-center p-2 text-white rounded-lg bg-orange-400 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
                            isDisabled={uploadedImage === null}
                          >
                            {submitTaskReport.isPending
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

export default TaskToDos;
