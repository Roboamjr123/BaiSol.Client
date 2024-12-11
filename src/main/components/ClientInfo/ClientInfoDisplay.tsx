import React from "react";
import { CircularProgress } from "@nextui-org/react";
import { ProjectDetails, exampleProject } from "./clientinfo";
import { IClientProjectInfo } from "../../../lib/API/Project/ProjectApi";
import { info } from "console";

const ClientInfoDisplay: React.FC<{
  project: IClientProjectInfo | null;
  paymentProgress?: number;
  projectProgress: number;
}> = ({ project, paymentProgress, projectProgress }) => {
  // const paymentProgress = 60; // Payment completion percentage
  // const projectProgress = 60; // Project completion percentage

  if (!project || !project.projId ) {
    return <div>No project yet...</div>;
  }
  return (
    <div className="flex flex-col items-center px-4 py-5 sm:px-6 sm:py-8">
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
                <h5 className="text-md font-semibold">{`+639${project.clientContactNum}`}</h5>
              </div>
            </div>
          </div>

          {/* Center Section: Divider and Project Details */}
          <div className="border-l-2 border-gray-300 hidden md:block h-40 mx-4"></div>
          <div className="flex flex-col text-medium items-center md:items-start space-y-3 text-center md:text-left">
            <h1 className="text-gray-700 font-extrabold">
              {project.projDescript}
            </h1>
            <h1 className="text-gray-500 font-bold">
              Address:{" "}
              <span className="font-semibold text-md text-gray-700">
                {project.clientAddress}
              </span>
            </h1>
            <h1 className="text-md font-bold text-gray-500">
              System Type:{" "}
              <span className="font-semibold text-md text-gray-700">
                {project.systemType}
              </span>
            </h1>
            <h1 className="text-md font-bold text-gray-500">
              kW Capacity:{" "}
              <span className="font-semibold text-md text-gray-700">
                {project.kWCapacity} kW
              </span>
            </h1>
          </div>
        </div>

        {/* Bottom Section: Progress Indicators */}
        <div className="flex flex-col sm:flex-row justify-around items-center mt-8 space-y-4 sm:space-y-0">
          {/* Payment Progress */}
          {paymentProgress !== undefined && (
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
          )}

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
          {/* Installer Information */}
          <div className="flex flex-col text-xs items-center w-1/3 p-2 bg-gray-50 rounded-md shadow">
            <h2 className="text-sm font-semibold mb-3 text-gray-700">
              Personnel
            </h2>
            {project.installers?.map((info, index) => (
              <div
                key={index}
                className="flex justify-between items-center w-full px-2 py-1 bg-white rounded shadow-sm mb-1"
              >
                <span className="text-gray-700 text-xs font-medium">
                  {info.name}
                </span>
                <span className="text-gray-500 text-xs">{info.position}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoDisplay;
