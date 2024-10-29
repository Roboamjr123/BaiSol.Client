// Define the Task interface
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaCheck, FaHourglassStart, FaToggleOn } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import {
  getTasksToDo,
  ITaskToDo,
  useFinishTask,
  useStartTask,
} from "../../../lib/API/Project/TasksAPI";
import { toast } from "react-toastify";
import Loader from "../../../main/components/Loader";
// interface Task {
//   id: number;
//   taskName: string;
//   plannedStartDate: string;
//   plannedEndDate: string;
//   isEnable: boolean;
//   isFinished: boolean;
//   isStarting: boolean;
// }

// Example task data
// const taskData: ITaskToDo[] = [
//   {
//     id: 9,
//     taskName: "New Task 5",
//     plannedStartDate: "Oct 23, 2024",
//     plannedEndDate: "Oct 25, 2024",
//     isEnable: true,
//     isFinished: true,
//     isStarting: true,
//   },
//   {
//     id: 8,
//     taskName: "New Task 4",
//     plannedStartDate: "Oct 24, 2024",
//     plannedEndDate: "Oct 25, 2024",
//     isEnable: true,
//     isFinished: false,
//     isStarting: false,
//   },
//   {
//     id: 5,
//     taskName: "New Task 1",
//     plannedStartDate: "Oct 25, 2024",
//     plannedEndDate: "Oct 30, 2024",
//     isEnable: true,
//     isFinished: false,
//     isStarting: true,
//   },
//   {
//     id: 10,
//     taskName: "New Task 6",
//     plannedStartDate: "Oct 28, 2024",
//     plannedEndDate: "Oct 31, 2024",
//     isEnable: false,
//     isFinished: false,
//     isStarting: false,
//   },
// ];
export const ToDos: React.FC<{ projId: string }> = ({ projId }) => {
  const {
    data: tasksToDo = [],
    isLoading,
    refetch,
  } = getTasksToDo(projId) ?? {};

  useEffect(() => {
    setTasks(tasksToDo);
  }, [tasksToDo]);

  const [tasks, setTasks] = useState<ITaskToDo[]>(tasksToDo);
  const [selectedTask, setSelectedTask] = useState<ITaskToDo | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const startTask = useStartTask();
  const finishTask = useFinishTask();

  const openTaskDetails = (task: ITaskToDo) => {
    setSelectedTaskId(task.id);
    setSelectedTask(task);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file); // Set the selected image in the state
      const imageUrl = URL.createObjectURL(file); // Create the object URL for the preview
      setImagePreview(imageUrl); // Set the preview image
    } else {
      setUploadedImage(null); // Reset state if no file is selected
      setImagePreview(""); // Reset the preview image
    }
  };

  const handleImageSubmit = () => {
    if (uploadedImage) {
      // Show confirmation dialog
      const confirmSubmission = window.confirm(
        selectedTask?.isStarting
          ? "Click OK to Finish the project."
          : "Click OK to Start the project."
      );

      if (confirmSubmission) {
        const mutationFn = selectedTask!.isStarting ? finishTask : startTask;

        mutationFn.mutateAsync(
          { ProofImage: uploadedImage, id: selectedTask?.id! },
          {
            onSuccess: (data) => {
              toast.success(data);
              setUploadedImage(null);
              setImagePreview("");
              refetch();
            },
          }
        );
      } else {
        // Optionally, you can add a message here if needed
        toast.info("Image submission canceled.");
      }
    } else {
      toast.error("Please upload an image before submitting."); // Optional: Notify if no image is uploaded
    }
  };

  if (isLoading) return <Loader label="Loading tasks" />;

  return (
    <div className="flex flex-col md:flex-row md:flex-auto">
      {/* Sidebar Task List */}
      <div className="md:w-1/4 w-full p-4 border-b md:border-r border-gray-300 font-sans shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Tasks</h2>
        <div className="relative flex flex-col pl-6 space-y-4">
          {/* Timeline vertical line */}
          <ol className="relative border-l border-orange-400 dark:border-gray-700">
            {tasks.map((task, index) => (
              <li key={task.id} className="mb-10 ms-6 ">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full -start-3 ring-8 ring-white ">
                  {task.isFinished && task.isEnable && task.isFinished ? (
                    <FaCheck className="text-success-400" />
                  ) : task.isStarting && task.isEnable ? (
                    <FaHourglassStart className="text-warning-400" />
                  ) : task.isEnable && !task.isFinished && !task.isStarting ? (
                    <GrStatusGoodSmall className="text-primary-400" />
                  ) : (
                    <GrStatusGoodSmall className="text-default-400" />
                  )}
                </span>

                <h3
                  onClick={() => openTaskDetails(task)}
                  className={`transition-transform transform hover:scale-105 flex items-center mb-1 text-lg font-semibold dark:text-white 
                    ${
                      selectedTaskId === task.id
                        ? "text-orange-500"
                        : "text-gray-900"
                    }`}
                >
                  {task.taskName}{" "}
                  {task.isFinished && task.isEnable && task.isFinished && (
                    <span className="bg-success-100 text-success-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded ms-3">
                      Finished
                    </span>
                  )}
                </h3>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Task Details Display */}
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-[35px] font-semibold text-gray-800 mb-6 text-center md:text-left">
          Task Report
        </h1>
        {selectedTask ? (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {selectedTask.taskName}{" "}
              {!selectedTask.isEnable && (
                <span className="text-gray-400 text-small">Coming...</span>
              )}
            </h2>

            <div className="flex flex-col md:flex-row md:items-start justify-between text-gray-600 p-4">
              {/* Left Column: Dates */}
              <div className="flex flex-col mb-4 md:mb-0">
                <div className="mb-2">
                  <span className="block text-sm font-medium text-gray-500">
                    Start Date
                  </span>
                  <span className="text-lg font-medium">
                    {new Date(selectedTask.plannedStartDate).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Started
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {new Date(selectedTask.startDate).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Right Column: Dates */}
              <div className="flex flex-col">
                <div className="mb-2">
                  <span className="block text-sm font-medium text-gray-500">
                    End Date
                  </span>
                  <span className="text-lg font-medium">
                    {new Date(selectedTask.plannedEndDate).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Finished
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {new Date(selectedTask.endDate).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mt-4">
              <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3">
                {selectedTask.isEnable && !selectedTask.isFinished && (
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-500 dark:text-white"
                      htmlFor="small_size"
                    >
                      Upload Task Image
                    </label>
                    <input
                      className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id="small_size"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                    />
                    {/* <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-[350px] max-w-sm text-[#444] p-2 bg-white rounded-[10px] border border-[rgba(8,8,8,0.288)]"
                      required
                    /> */}
                  </div>
                )}
                {uploadedImage && (
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="w-20 h-20 object-cover rounded-lg shadow-md border border-gray-300"
                  />
                )}
              </div>
            </div>

            {/* Submission Button */}
            <div className="mt-6 flex justify-end">
              {selectedTask.isEnable && !selectedTask.isFinished && (
                <Button
                  isLoading={startTask.isPending || finishTask.isPending}
                  onClick={handleImageSubmit}
                  className="flex ml-auto items-center justify-center p-2 text-white rounded-lg bg-orange-400 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
                  isDisabled={
                    !selectedTask?.isEnable || // Use optional chaining to avoid errors if selectedTask is null
                    selectedTask?.isFinished ||
                    uploadedImage === null
                  }
                >
                  {startTask.isPending || finishTask.isPending
                    ? "Submitting..."
                    : selectedTask.isEnable && !selectedTask.isFinished
                    ? !selectedTask.isStarting
                      ? "Start"
                      : "Finish"
                    : null}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Please select a task to view details.
          </p>
        )}
      </div>
    </div>
  );
};
