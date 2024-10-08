import { useState } from "react";
import { RiArrowRightWideFill } from "react-icons/ri";
import { Button } from "@nextui-org/react";
import PersonnelTable from "../components/tables/PersonnelTable";
import InstallerTable from "../components/tables/InstallerTable";

const Personnel = () => {
  const components = [
    {
      component: <PersonnelTable role="Admin" />,
      name: "Admin",
      index: 1,
    },
    {
      component: <PersonnelTable role="Facilitator" />,
      name: "Facilitator",
      index: 2,
    },
    { component: <InstallerTable />, name: "Installer", index: 3 },
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

export default Personnel;
