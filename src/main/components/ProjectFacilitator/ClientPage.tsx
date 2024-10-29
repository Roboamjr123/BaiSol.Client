import React from "react";
import { CircularProgress } from "@nextui-org/react";
import { ProjectDetails, exampleProject } from "./clientinfo";

const ClientPage: React.FC<{ project: ProjectDetails }> = ({
  project = exampleProject,
}) => {
  const paymentProgress = 60; // Payment completion percentage
  const projectProgress = 60; // Project completion percentage

  return (
    <div className="flex flex-col items-center px-4 py-10 sm:px-12 sm:py-16">
      <div className="p-6 border border-gray-300 shadow-lg rounded-lg w-full max-w-3xl">
        {/* Profile and Project Details */}
        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          {/* Left Section: Client Info */}
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-1">
            <div className="text-gray-700 text-center md:text-left">
              <div className="flex items-center space-x-4 mt-6">
                <h2 className="text-lg font-bold">
                  {`${project.clientFName} ${project.clientLName}`}
                </h2>
              </div>
              <h5 className="text-md font-semibold">{`${project.clientFName}@gmail.com`}</h5>
              <div className="text-sm font-semibold">
                <h5 className="text-md font-semibold">{`${project.clientContactNum}`}</h5>
              </div>
            </div>
          </div>

          {/* Center Section: Divider and Project Details */}
          <div className="border-l-2 border-gray-300 hidden md:block h-40 mx-4"></div>
          <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
            <h1 className="text-gray-700 font-extrabold">
              {project.projDescript}
            </h1>
            <h1 className="text-gray-700 font-bold">
              Address:{" "}
              <span className="font-semibold text-md text-gray-600">
                {project.clientAddress}
              </span>
            </h1>
            <h1 className="text-md font-bold text-gray-700">
              System Type:{" "}
              <span className="font-semibold text-md text-gray-600">
                {project.systemType}
              </span>
            </h1>
            <h1 className="text-md font-bold text-gray-700">
              kW Capacity:{" "}
              <span className="font-semibold text-md text-gray-600">
                {project.kWCapacity} kW
              </span>
            </h1>
          </div>
        </div>

        {/* Bottom Section: Progress Indicators */}
        <div className="flex flex-col sm:flex-row justify-around items-center mt-8 space-y-4 sm:space-y-0">
          {/* Payment Progress */}
          <div className="flex flex-col items-center">
            <div className="mt-4 custom-circular-progress">
              <CircularProgress
                label="Payment Progress"
                value={paymentProgress}
                color="success"
                showValueLabel={true}
                strokeWidth={4}
                classNames={{
                  svg: "w-24 h-24 drop-shadow-md",
                  indicator: "stroke-green-500",
                  track: "stroke-green-100",
                  value: "text-md font-semibold text-orange-500",
                }}
                size="lg"
              />
            </div>
          </div>

          {/* Project Progress */}
          <div className="flex flex-col items-center">
            <div className="mt-4 custom-circular-progress">
              <CircularProgress
                label="Project Progress"
                value={projectProgress}
                color="success"
                showValueLabel={true}
                strokeWidth={4}
                classNames={{
                  svg: "w-24 h-24 drop-shadow-md",
                  indicator: "stroke-orange-500",
                  track: "stroke-orange-100",
                  value: "text-md font-semibold text-orange-500",
                }}
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
