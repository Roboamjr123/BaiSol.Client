import React, { ReactNode, useState } from "react";
import Sidebar from "./shared/Sidebar/Sidebar";
import { AdminSidebarLinks } from "../lib/constants/SidebarLinks";
import Header from "./shared/Header/Header";

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        links={AdminSidebarLinks}
        isOpen={isSidebarOpen}
        setOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex overflow-x-hidden scrollbar-hide scrollbar-track-white scrollbar-thumb-orange-100 flex-col mx-auto h-full">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
