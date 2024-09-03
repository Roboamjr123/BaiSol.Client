import React, { useCallback, useMemo, useState } from "react";
import { CheckboxGroup, Checkbox, Input } from "@nextui-org/react";
import {
  getAvailableInstallers,
  IAvailableInstallers,
} from "../../../lib/API/PersonnelAPI";
import { CiSearch } from "react-icons/ci";

const AvailableInstallerCheckbox = () => {
  const [installerSelected, setInstallerSelected] = useState<string[]>([]);

  const allInstallers = getAvailableInstallers();

  const [filterValue, setFilterValue] = useState("");

  const filteredItems = useMemo(() => {
    let filteredInstaller = allInstallers.data ?? [];

    filteredInstaller = filteredInstaller.filter((inst) =>
      inst.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    return filteredInstaller;
  }, [allInstallers.data, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[45%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<CiSearch className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        />
        <span className=" text-cente p-2 rounded mb-2 text-xs text-gray-600 font-semibold">
          Selected{" "}
          <span className="text-sm text-gray-400">
            {installerSelected.length}
          </span>
        </span>
      </div>

      <div className="flex flex-row max-w-full gap-4 justify-between tracking-wider">
        <span className=" border text-center p-2 rounded block w-full  mb-2 text-xs text-gray-600 font-semibold">
          Available Installers{" "}
          <span className="text-gray-400">{allInstallers.data?.length}</span>
        </span>
        <span className=" border text-center p-2 rounded block w-full  mb-2 text-xs text-gray-600 font-semibold">
          Assigned Installers
        </span>
      </div>

      <CheckboxGroup
        value={installerSelected}
        onChange={setInstallerSelected}
        className="h-20 overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100"
      >
        {filteredItems.map((installer) => (
          <Checkbox
            classNames={{
              wrapper:
                "after:bg-orange-400 after:text-background text-background",
            }}
            className="hover:bg-gray-300 w-full"
            key={installer.installerId}
            value={String(installer.installerId)}
          >
            <div className="flex flex-col">
              <span className="font-semibold tracking-widest">
                {installer.name}
              </span>
              <span className="text-xs text-gray-400 tracking-tight">
                {installer.position}
              </span>
            </div>
          </Checkbox>
        ))}
      </CheckboxGroup>
      <p className="mt-4 ml-1 text-default-500">
        Selected: {installerSelected.join(", ")}
      </p>
    </div>
  );
};

export default AvailableInstallerCheckbox;
