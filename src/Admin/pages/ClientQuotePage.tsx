import { Button } from "@nextui-org/react";
import { useState } from "react";
import { RiArrowRightWideFill } from "react-icons/ri";
import QuotationPage from "./QuotationPage";
import FinalQuotePrice from "./FinalQuotePrice";
import Scheduler from "./Scheduler";
import ProjectPayment from "../components/quotation/ProjectPayment";

const ClientQuotePage = () => {
  const components = [
    {
      component: <FinalQuotePrice />,
      name: "Final Price Quote",
      index: 1,
    },
    {
      component: <QuotationPage />,
      name: "Quotation",
      index: 2,
    },
    {
      component: <Scheduler />,
      name: "Schedule",
      index: 3,
    },
    {
      component: <ProjectPayment />,
      name: "Payment",
      index: 4,
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
        Project
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
            className={`w-28 font-semibold text-sm md:w-36 lg:w-48 text-white md:text-lg  ${
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
      <div className="container mx-auto p-2 rounded-lg">{activeComponent}</div>
    </div>
  );
};

export default ClientQuotePage;
