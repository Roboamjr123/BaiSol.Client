import React, { useState } from "react";
import AssignedSupplyTable from "../components/tables/AssignedSupplyTable";
import { RiArrowRightWideFill } from "react-icons/ri";
import { Button } from "@nextui-org/react";
import RequestsSupplyTable from "../components/tables/RequestsSupplyTable";
import {
  getAssignedEquipmentByFacilitator,
  getAssignedMaterialsByFacilitator,
} from "../../lib/API/Facilitator/RequestAPI";
import Loader from "../../main/components/Loader";

const AssignedSupplyPage = () => {
  const { data: assignedMaterials, isLoading } =
    getAssignedMaterialsByFacilitator();
  const { data: assignedEquipment, isLoading: isLoadingAssignedEquipment } =
    getAssignedEquipmentByFacilitator();

  const components = [
    {
      component: (
        <AssignedSupplyTable
          isMaterial={true}
        />
      ),
      name: "Material",
      index: 1,
    },
    {
      component: <AssignedSupplyTable/>,
      name: "Equipment",
      index: 2,
    },
    {
      component: <RequestsSupplyTable />,
      name: "Request",
      index: 3,
    },
  ];

  const [activeComponent, setActiveComponent] = useState<JSX.Element | null>(
    components[0].component
  );
  const [activeName, setActiveName] = useState<string>(components[0].name);
  const [activeButton, setActiveButton] = useState<number>(components[0].index);

  const handleButtonClick = (
    component: JSX.Element,
    name: string,
    buttonIndex: number
  ) => {
    setActiveComponent(component);
    setActiveName(name);
    setActiveButton(buttonIndex);
  };

  if (isLoading || isLoadingAssignedEquipment) return <Loader />;

  return (
    <div>
      <h1 className="flex items-center mb-4">
        Supply
        <span className="mx-2 text-gray-400">
          <RiArrowRightWideFill />
        </span>
        {activeName}
      </h1>
      <div className="flex gap-x-6 my-8">
        {components.map((item) => (
          <Button
            variant="shadow"
            key={item.index}
            className={`w-28 font-semibold md:w-36 lg:w-48 text-white text-lg  ${
              activeButton === item.index ? "bg-orange-300" : "bg-orange-400"
            }`}
            onClick={() =>
              handleButtonClick(item.component, item.name, item.index)
            }
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
        {activeComponent}
      </div>
    </div>
  );
};

export default AssignedSupplyPage;
