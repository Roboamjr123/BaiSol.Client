import { useState } from "react";
import EquipmentTable from "../components/tables/EquipmentTable";
import MaterialTable from "../components/tables/MaterialTable";
import { Button } from "@nextui-org/react";
import { RiArrowRightWideFill } from "react-icons/ri";
import AllRequesitionTable from "../components/tables/AllRequesitionTable";

const Supply = () => {
  const components = [
    {
      component: <MaterialTable />,
      name: "Material",
      index: 1,
    },
    {
      component: <EquipmentTable />,
      name: "Equipment",
      index: 2,
    },
    {
      component: <AllRequesitionTable />,
      name: "Requests",
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
  return (
    <div>
      <h1 className="flex items-center mb-4">
        Personnel
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

export default Supply;
