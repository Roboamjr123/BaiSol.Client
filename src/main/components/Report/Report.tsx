// Define the Task interface
import { useState } from "react";
interface Task {
  id: number;
  taskName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  isEnable: boolean;
  isFinished: boolean;
}

// Example task data
const taskData: Task[] = [
  {
    id: 9,
    taskName: "New Task 5",
    plannedStartDate: "2024-10-23T00:00:00Z",
    plannedEndDate: "2024-10-25T09:00:00Z",
    isEnable: true,
    isFinished: true,
  },
  {
    id: 8,
    taskName: "New Task 4",
    plannedStartDate: "2024-10-24T00:00:00Z",
    plannedEndDate: "2024-10-25T09:00:00Z",
    isEnable: false,
    isFinished: false,
  },
  {
    id: 5,
    taskName: "New Task 1",
    plannedStartDate: "2024-10-25T00:00:00Z",
    plannedEndDate: "2024-10-30T09:00:00Z",
    isEnable: false,
    isFinished: false,
  },
  {
    id: 10,
    taskName: "New Task 6",
    plannedStartDate: "2024-10-28T00:00:00Z",
    plannedEndDate: "2024-10-31T09:00:00Z",
    isEnable: false,
    isFinished: false,
  },
  {
    id: 11,
    taskName: "New Task 7",
    plannedStartDate: "2024-10-28T00:00:00Z",
    plannedEndDate: "2024-10-31T09:00:00Z",
    isEnable: false,
    isFinished: false,
  },
  {
    id: 12,
    taskName: "New Task 8",
    plannedStartDate: "2024-10-28T00:00:00Z",
    plannedEndDate: "2024-10-31T09:00:00Z",
    isEnable: false,
    isFinished: false,
  },
  {
    id: 13,
    taskName: "New Task 8",
    plannedStartDate: "2024-10-28T00:00:00Z",
    plannedEndDate: "2024-10-31T09:00:00Z",
    isEnable: false,
    isFinished: false,
  },
];
export const Report = () => {
  const [tasks, setTasks] = useState<Task[]>(taskData);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [uploadedImage, setUploadedImage] = useState<
    string | ArrayBuffer | null
  >(null);

  const openTaskDetails = (task: Task) => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, isFinished: !t.isFinished } : t
    );
    setTasks(updatedTasks);
    setSelectedTask(updatedTasks.find((t) => t.id === task.id) || null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleImageSubmit = () => {
    if (!selectedTask) {
      alert("Please select a task before submitting.");
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === selectedTask.id) {
        if (task.isEnable && task.isFinished) {
          return { ...task, isFinished: true };
        } else if (!task.isEnable) {
          alert("Task is not enabled for submission.");
          return task;
        } else if (!task.isFinished) {
          alert("Task must be marked as finished before submission.");
          return task;
        }
      }
      return task;
    });

    setTasks(updatedTasks);

    return (
      <div className="flex flex-col md:flex-row md:flex-auto">
        {/* Sidebar Task List */}
        <div className="md:w-1/4 w-full p-4 border-b md:border-r border-gray-300 font-sans bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Tasks</h2>
          <div className="relative flex flex-col pl-6 space-y-4">
            {/* Timeline vertical line */}
            <div className="absolute top-0 left-4 w-2.5 bg-gray-300 h-full"></div>

            {tasks.map((task, index) => (
              <div key={task.id} className="relative flex items-center w-full">
                {/* Stepper Circle */}
                <div
                  className={`absolute -left-3 top-5 w-4 h-4 rounded-full border-2 ${
                    task.isFinished
                      ? "bg-orange-500 border-orange-500"
                      : "bg-white border-gray-300"
                  }`}
                ></div>

                <div
                  className={`flex items-center w-full p-4 ml-2 bg-white rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
                    task.isFinished ? "bg-gray-200" : "bg-white"
                  }`}
                  onClick={() => openTaskDetails(task)}
                >
                  {/* Task Number */}
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-600 text-white font-bold">
                    {index + 1}
                  </div>
                  {/* Task Name */}
                  <div
                    className={`ml-3 text-lg ${
                      task.isFinished ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.taskName}
                  </div>
                  {/* Task Status Indicator */}
                  <div
                    className={`ml-auto w-2 h-2 rounded-full ${
                      task.isFinished ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={task.isFinished ? "Finished" : "Not Finished"}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Details Display */}
        <div className="flex-1 p-6 bg-gray-50">
          <h1 className="text-[35px] font-semibold text-gray-800 mb-6 text-center md:text-left">
            Daily Report
          </h1>
          {selectedTask ? (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {selectedTask.taskName}
              </h2>

              <div className="flex flex-col md:flex-row  md:items-center justify-between text-gray-600">
                <div className="mb-4 md:mb-0">
                  <span className="block text-sm font-medium text-gray-500">
                    Start Date
                  </span>
                  <span className="text-lg font-medium">
                    {new Date(selectedTask.plannedStartDate).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    End Date
                  </span>
                  <span className="text-lg font-medium">
                    {new Date(selectedTask.plannedEndDate).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="mt-4">
                <label className="block text-gray-500 text-sm font-medium mb-2">
                  Upload Task Image
                </label>
                <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {uploadedImage && (
                    <img
                      src={uploadedImage as string}
                      alt="Uploaded Preview"
                      className="w-20 h-20 object-cover rounded-lg shadow-md border border-gray-300"
                    />
                  )}
                </div>
              </div>

              {/* Submission Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleImageSubmit}
                  className={`px-5 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    selectedTask.isEnable && !selectedTask.isFinished
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-400 text-gray-100 cursor-not-allowed"
                  }`}
                  disabled={!selectedTask.isEnable || selectedTask.isFinished}
                >
                  {selectedTask.isFinished ? "Submitted" : "Submit"}
                </button>
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
};
