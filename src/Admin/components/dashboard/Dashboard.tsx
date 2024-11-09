// src/Dashboard.tsx
import React from "react";
import CustomBarChart from "./charts/BarChart";
import CustomAreaChart from "./charts/AreaChart";
import GridItem from "./charts/GridItem";
import { motion } from "framer-motion";
import DashboardData from "./DashboardData";

const Dashboard: React.FC = () => {
  // Initialize DashboardData instance
  const data = new DashboardData();

  return (
    <div className="p-4 space-y-4 bg-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

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
          <p className="text-3xl font-semibold">{data.personnel}</p>
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
          <p className="text-3xl font-semibold">{data.completedProjects}</p>
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
          <p className="text-3xl font-semibold">{data.quotation}</p>
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
          <p className="text-3xl font-semibold">{data.onWorkProjects}</p>
        </motion.div>
      </div>

      {/* Main Charts Section */}
      <div className="flex flex-col items-center py-1">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] w-full gap-5 ">
          <GridItem title="Total Sales">
            <CustomAreaChart />
          </GridItem>

          <GridItem title="Profit">
            <CustomBarChart />
          </GridItem>
        </div>
      </div>

      {/* Material Logs Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium">Material Logs</h2>
        <ul className="divide-y divide-gray-200">
          <li className="py-2">
            <span className="font-semibold">Cement</span> ordered - 50 bags
          </li>
          <li className="py-2">
            <span className="font-semibold">Steel Rods</span> delivered at 3:30
            PM
          </li>
          <li className="py-2">
            <span className="font-semibold">Gravel</span> out of stock
          </li>
          <li className="py-2">
            <span className="font-semibold">Concrete Mix</span> restocked - 100
            units
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
