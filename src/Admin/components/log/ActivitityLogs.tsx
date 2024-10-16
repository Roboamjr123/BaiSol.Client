import React, { useCallback, useMemo, useState } from "react";
import { getActivityLogs, IActivityLogs } from "../../../lib/API/LogsAPI";
import Loader from "../../../main/components/Loader";
import { Chip, Input } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { RiAdminLine } from "react-icons/ri";
import { GrUserWorker } from "react-icons/gr";
import { MdOutlinePerson4 } from "react-icons/md";

const ActivitityLogs = () => {
  const activitiyLogs = getActivityLogs();

  const [filterValue, setFilterValue] = useState<string>("");

  // Filtered and sorted items based on the filter value
  const filteredItems = useMemo(() => {
    let logs = activitiyLogs.data ?? [];

    return logs.filter(
      (log) =>
        log.userName.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.timestamp.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.userRole.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.action.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.entityName.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.details.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [activitiyLogs, filterValue]);

  // Update filter value on search input change
  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  return (
    <div>
      {activitiyLogs.isLoading ? (
        <Loader label="Loading logs..." />
      ) : (
        <div className="bg-gray-100 flex items-center justify-center">
          <div className="container mx-auto p-4 bg-white h-full">
            <Input
              isClearable
              classNames={{
                base: "w-full sm:max-w-[45%]",
                inputWrapper: "border-1",
              }}
              placeholder="Search..."
              size="sm"
              startContent={<CiSearch className="text-default-300" />}
              value={filterValue}
              variant="bordered"
              onClear={() => setFilterValue("")}
              onValueChange={onSearchChange}
            />
            <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
              <div className="min-w-full p-9">
                <ol className="relative border-s border-gray-200 dark:border-gray-700">
                  {filteredItems.map((log) => (
                    <li key={log.logId} className="mb-10 ms-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        {log.userRole === "Admin" ? (
                          <RiAdminLine className="text-orange-500" />
                        ) : log.userRole === "Facilitator" ? (
                          <GrUserWorker className="text-blue-500" />
                        ) : (
                          <MdOutlinePerson4 className="text-green-500" />
                        )}
                      </span>
                      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        <div className="items-center justify-between mb-3 sm:flex">
                          <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                            {log.timestamp}
                            {log.action === "Create" || log.action === "Add" || log.action === "Logged In"? (
                              <Chip
                                className="capitalize border-none gap-1 text-default-600"
                                size="sm"
                                variant="dot"
                                color="success"
                              />
                            ) : log.action === "Update" ? (
                              <Chip
                                className="capitalize border-none gap-1 text-default-600"
                                size="sm"
                                variant="dot"
                                color="primary"
                              />
                            ) : log.action === "Delete" || log.action === "Logged Out" ? (
                              <Chip
                                className="capitalize border-none gap-1 text-default-600"
                                size="sm"
                                variant="dot"
                                color="danger"
                              />
                            ) : null}
                          </time>
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                            {log.userName} {log.action} on{" "}
                            <span className="font-semibold text-orange-600 dark:text-orange-500 hover:underline">
                              {log.entityName}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                          {log.details}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitityLogs;
