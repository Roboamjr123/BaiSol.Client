import React, { useCallback, useMemo, useState } from "react";
import { getInventoryLogs, IInventoryLog } from "../../../lib/API/LogsAPI";
import Loader from "../../../main/components/Loader";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";

const ItemLogs: React.FC<{
  id: string;
  isMaterial?: boolean;
  isOpen: boolean;
  onClose: () => void;
}> = ({ id, isOpen, onClose, isMaterial = false }) => {
  const itemLogs = getInventoryLogs(isMaterial ? "Material" : "Equipment", id);

  const [filterValue, setFilterValue] = useState<string>("");

  // Filtered and sorted items based on the filter value
  const filteredItems = useMemo(() => {
    let logs = itemLogs.data ?? [];

    return logs.filter(
      (log) =>
        log.userName.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.timestamp.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.details.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [itemLogs, filterValue]);

  // Update filter value on search input change
  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalContent>
        <ModalHeader>
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
        </ModalHeader>
        <ModalBody>
          {itemLogs.isLoading ? (
            <Loader label="Loading logs..." />
          ) : (
            <div className="bg-gray-100 flex items-center justify-center">
              <div className="container mx-auto p-4 bg-white h-full">
                <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
                  <div className="min-w-full p-9">
                    {filteredItems.map((log: IInventoryLog, index: number) => {
                      return (
                        <div
                          key={log.timestamp}
                          className="flex flex-row border-b-small border-gray-200 rounded-lg bg-white shadow-sm justify-between p-4 gap-6 hover:scale-105 duration-300"
                        >
                          {/* User Info Section */}
                          <div className="flex flex-col justify-center items-start gap-1 min-w-[150px]">
                            <span className="font-semibold text-sm text-gray-800">
                              {log.userName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {log.userEmail}
                            </span>
                          </div>
                          {/* Log Details Section */}
                          <div className="flex flex-col justify-between flex-1 gap-1">
                            <p className="text-sm text-gray-700">
                              {log.details}
                            </p>
                            <span className="text-xs text-right text-gray-400">
                              {log.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ItemLogs;
