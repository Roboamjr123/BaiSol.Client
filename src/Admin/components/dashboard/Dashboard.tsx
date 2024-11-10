// src/Dashboard.tsx
import React from "react";
import CustomBarChart from "./charts/BarChart";
import CustomAreaChart from "./charts/AreaChart";
import GridItem from "./charts/GridItem";
import { motion } from "framer-motion";
import DashboardData from "./DashboardData";
import Loader from "../../../main/components/Loader";
import { getSalesReport } from "../../../lib/API/Project/PaymentAPI";
import SalesReportChart from "../report/SalesReportChart";
import { getDashboardData } from "../../../lib/API/Report";

const Dashboard: React.FC = () => {
  // Initialize DashboardData instance
  const data = new DashboardData();

  const { data: dashboardData, isLoading: isLoadingDashboard } =
    getDashboardData();
  const { data: salesData, isLoading: isLoadingSales } = getSalesReport();

  if (isLoadingDashboard || isLoadingSales)
    return <Loader label="Loading..." />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center mb-4 text-lg md:text-xl">Dashboard</h1>

      {/* Overview Statistics */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.15)",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-blue-300 to-gray-300 text-gray-800 border border-orange-500 p-4 rounded-lg shadow-lg cursor-pointer"
        >
          <h2 className="text-lg font-medium">Total Personnel</h2>
          <p className="text-3xl font-semibold">
            {dashboardData?.totalPersonnel}
          </p>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.15)",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-green-200 to-gray-300 text-gray-800 border border-orange-500 p-4 rounded-lg shadow-lg cursor-pointer"
        >
          <h2 className="text-lg font-medium">Complete Projects</h2>
          <p className="text-3xl font-semibold">
            {dashboardData?.finishedProjects}
          </p>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.15)",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-yellow-200 to-gray-300 text-gray-800 border border-orange-500 p-4 rounded-lg shadow-lg cursor-pointer"
        >
          <h2 className="text-lg font-medium">Pending Quotation</h2>
          <p className="text-3xl font-semibold">
            {dashboardData?.pendingProjects}
          </p>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.15)",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-red-200 to-gray-300 text-gray-800 border border-orange-500 p-4 rounded-lg shadow-lg cursor-pointer"
        >
          <h2 className="text-lg font-medium">Projects On Work</h2>
          <p className="text-3xl font-semibold">
            {dashboardData?.onWorkProjects}
          </p>
        </motion.div>
      </div>

      {/* Main Charts Section */}
      <div className="flex flex-col items-center py-1">
        {/* <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] w-full gap-5 "> */}
        <div className="w-full">
          <GridItem title="Total Sales">
            <SalesReportChart salesData={salesData ?? []} />{" "}
          </GridItem>

          {/* <GridItem title="Profit">
            <CustomBarChart />
          </GridItem> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
