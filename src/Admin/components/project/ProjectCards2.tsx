import React from "react";
import {
  exampleProjectsOnLists,
  ProjectDetails,
} from "../../../main/components/ClientInfo/clientinfo";
import { Card, Chip, CircularProgress } from "@nextui-org/react";
import {
  getClientsProjectInfos,
  IClientProjectInfo,
} from "../../../lib/API/Project/ProjectApi";
import Loader from "../../../main/components/Loader";
import { projectStatusColorMap } from "../../../lib/utils/project";
import { Link } from "react-router-dom";

interface Project {
  projects: IClientProjectInfo[];
  currentPage: number;
  pageSize: number;
}

const ProjectCards2: React.FC<Project> = ({
  currentPage,
  pageSize,
  projects,
}) => {
  // const { data: projects, isLoading } = getClientsProjectInfos();

  const filteredProjects = projects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // const paymentProgress = 60; // Payment completion percentage
  // const projectProgress = 60; // Project completion percentage

  return (
    <div className="flex flex-col w-full">
      {filteredProjects?.map((p: IClientProjectInfo) => {
        return (
          <Link
            key={p.projId}
            to={`/project/${p.projId}`}
            className="cursor-pointer hover:scale-105 duration-300"
          >
            <Card className="m-5">
              <div className="border p-5 border-gray-300 shadow-lg rounded-lg ">
                <Chip
                  className="capitalize border-none text-default-600"
                  color={projectStatusColorMap[p.status!]}
                  size="sm"
                  variant="dot"
                />
                {/* Profile and Project Details */}
                <div className="flex flex-col items-center justify-center md:flex-row md:space-x-8 w-full">
                  {/* Left Section: Client Info */}
                  <div className="flex flex-col items-center md:items-end mb-4 md:mb-0 w-full md:w-1/3">
                    <div className="text-gray-700 text-center md:text-left">
                      <div className="flex items-center space-x-4 mt-6">
                        <h2 className="text-lg font-bold">
                          {`${p.isMale ? "Mr." : "Ms."} ${p.clientFName} ${
                            p.clientLName
                          }`}
                        </h2>
                      </div>
                      <h5 className="text-sm font-semibold">{`${p.clientFName}@gmail.com`}</h5>
                      <div className="text-xs font-semibold">
                        <h5 className="text-sm font-semibold">{`${p.clientContactNum}`}</h5>
                      </div>
                    </div>
                  </div>

                  {/* Center Section: Divider and p Details */}
                  <div className="border-l-2 border-gray-300 hidden md:block h-40 mx-4"></div>

                  <div className="flex flex-col text-medium items-center md:items-start space-y-3 text-center md:text-left w-full md:w-2/3">
                    <h1 className="text-gray-700 font-extrabold">
                      {p.projDescript}
                    </h1>
                    <h1 className="text-gray-500 text-xs font-bold">
                      Address:{" "}
                      <span className="font-semibold text-gray-700">
                        {p.clientAddress}
                      </span>
                    </h1>
                    <h1 className="text-xs font-bold text-gray-500">
                      System Type:{" "}
                      <span className="font-semibold  text-gray-700">
                        {p.systemType}
                      </span>
                    </h1>
                    <h1 className=" text-xs font-bold text-gray-500">
                      kW Capacity:{" "}
                      <span className="font-semibold  text-gray-700">
                        {p.kWCapacity} kW
                      </span>
                    </h1>
                  </div>
                </div>

                {/* Bottom Section: Progress Indicators */}
                <div className="flex flex-col sm:flex-row justify-around items-center mt-2 space-y-4 sm:space-y-0">
                  {/* Payment Progress */}
                  {p.paymentProgress !== undefined && (
                    <div className="flex flex-col items-center">
                      <div className="mt-4 custom-circular-progress">
                        <CircularProgress
                          label="Payment Progress"
                          value={p.paymentProgress}
                          color="success"
                          showValueLabel={true}
                          strokeWidth={4}
                          classNames={{
                            svg: "w-16 h-16 drop-shadow-md",
                            indicator: "stroke-green-500",
                            track: "stroke-green-100",
                            value: "text-md font-semibold text-orange-500",
                          }}
                          size="sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Project Progress */}
                  <div className="flex flex-col items-center">
                    <div className="mt-4 custom-circular-progress">
                      <CircularProgress
                        label="Project Progress"
                        value={p.projectProgress}
                        color="success"
                        showValueLabel={true}
                        strokeWidth={4}
                        classNames={{
                          svg: "w-16 h-16 drop-shadow-md",
                          indicator: "stroke-orange-500",
                          track: "stroke-orange-100",
                          value: "text-md font-semibold text-success-500",
                        }}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Installer Information */}
                  <div className="flex flex-col items-center w-1/3 p-3 bg-gray-50 rounded-md shadow text-xs">
                    <h2 className="text-sm font-semibold mb-4 text-gray-700">
                      Personnel
                    </h2>

                    {/* Facilitator Section */}
                    <div className="w-full mb-3">
                      <h3 className="text-xs font-semibold text-gray-600 mb-1">
                        Facilitator
                      </h3>
                      <div className="flex flex-col justify-between items-start w-full px-2 py-1 bg-white rounded shadow-sm">
                        <span className="text-gray-700">
                          {p.facilitatorName}
                        </span>
                        <span className="text-gray-500">
                          {p.facilitatorEmail}
                        </span>
                      </div>
                    </div>

                    {/* Installers Section */}
                    <div className="w-full">
                      <h3 className="text-xs font-semibold text-gray-600 mb-1">
                        Installers
                      </h3>
                      {p.installers?.map((info, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center w-full px-2 py-1 bg-white rounded shadow-sm mb-1"
                        >
                          <span className="text-gray-700">{info.name}</span>
                          <span className="text-gray-500">{info.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default ProjectCards2;
