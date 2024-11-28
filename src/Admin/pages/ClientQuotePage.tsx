import { Button } from "@nextui-org/react";
import { useState } from "react";
import { RiArrowRightWideFill } from "react-icons/ri";
import QuotationPage from "./QuotationPage";
import Scheduler from "./Scheduler";
import ProjectPayment from "../../main/components/Payment/ProjectPayment";
import RequestSupply from "../components/modal/supply/RequestSupply";
import Form from "../../main/components/Quotation/Form";
import { useNavigate, useParams } from "react-router-dom";
import {
  getIsOnGoingProject,
  getIsOnProcessProject,
  useUpdateProjectToOnProcess,
} from "../../lib/API/Project/ProjectApi";
import { toast } from "react-toastify";
import {
  getIsProjectPayedDownpayment,
  useCreatePayment,
} from "../../lib/API/Project/PaymentAPI";
import Loader from "../../main/components/Loader";

const ClientQuotePage = () => {
  const { projId } = useParams<{ projId: string }>();
  const navigate = useNavigate();

  const sealQuotation = useUpdateProjectToOnProcess();
  const createPayment = useCreatePayment();
  const {
    data: isProjectOnGoing,
    refetch: refetchProjStatus,
    isLoading: isLoadingProj,
  } = getIsOnGoingProject(projId!);
  const { data: isOnProcess, isLoading: isLoadingStatus, refetch:refetchIsOnProcess } =
    getIsOnProcessProject(projId!);

  const handleSealQuotation = () => {
    if (
      window.confirm(
        "Are you sure you want to seal this quotation? This action cannot be undone."
      )
    ) {
      sealQuotation.mutateAsync(
        { projId: projId! },
        {
          onSuccess: (pay) => {
            createPayment.mutateAsync(
              { projId: projId! },
              {
                onSuccess: (data) => {
                  toast.success(pay);
                  toast.success(data);
                  refetchProjStatus();
                  navigate(`/project/${projId}`)
                },
              }
            );
          },
        }
      );
    }
  };

  const components = [
    {
      component: <Form isAdmin={true} />,
      name: "Final Price Quote",
      index: 1,
    },
    {
      component: <QuotationPage />,
      name: "Quotation",
      index: 2,
    },
    {
      component: (
        <Scheduler isOnProcess={isOnProcess!} refetchIsOnProcess={refetchIsOnProcess} isOnGoing={isProjectOnGoing!} />
      ),
      name: "Schedule",
      index: 3,
    },
    {
      component: <ProjectPayment isAdmin={true} />,
      name: "Payment",
      index: 4,
    },
    {
      component: <RequestSupply />,
      name: "Request",
      index: 5,
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

  if (isLoadingProj || isLoadingStatus) return <Loader />;

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="flex items-center mb-4">
          Project
          <span className="mx-2 text-gray-400">
            <RiArrowRightWideFill />
          </span>
          {activeName}
        </h1>
        <div>
          {isProjectOnGoing ? (
            <Button
              onClick={handleSealQuotation}
              isLoading={sealQuotation.isPending}
              className="bg-orange-400 w-full ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            >
              Seal Quotation
            </Button>
          ) : (
            <Button
              isDisabled
              className="bg-orange-400 w-full ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            >
              Sealed Quotation
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-2 my-8">
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
