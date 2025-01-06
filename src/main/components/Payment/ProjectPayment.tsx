import { Button, Card, Spinner, useDisclosure } from "@nextui-org/react";
import { paymentsData } from "../../constants/PaymentsData";
import {
  getClientPayments,
  IAllPayment,
  useAcknowledgePayment,
  usePayOnCash,
} from "../../../lib/API/Project/PaymentAPI";
import { Navigate, useParams } from "react-router-dom";
import Loader from "../Loader";
import { toast } from "react-toastify";
import { getClientProjId } from "../../../lib/API/Client/ClientProjectAPI";
import { getProjectExpense } from "../../../lib/API/Project/ProjectApi";
import { useState } from "react";
import PaymentDetailsModal from "../../../Admin/components/modal/payment/PaymentDetailsModal";
import { FaInfoCircle } from "react-icons/fa";

const ProjectPayment: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
  const {
    isOpen: viewIsOpen,
    onOpen: viewOnOpen,
    onClose: viewOnClose,
  } = useDisclosure();

  const { projId } = useParams<{ projId: string }>();

  const { data: clientProjId } = getClientProjId();
  const [paymentInfo, setPaymentInfo] = useState<IAllPayment | null>(null);

  if (clientProjId === null) return <div>No project yet...</div>;

  const {
    data: payment,
    error,
    isLoading,
    refetch,
  } = getClientPayments(projId!);

  const { data: totalToPay, isLoading: isLoadingTotalExpense } =
    getProjectExpense(clientProjId?.projId ?? projId);

  const paymentArray = Array.isArray(payment) ? payment : [];
  const acknowledgePayment = useAcknowledgePayment();
  const payOnCash = usePayOnCash();

  const handleAcknowledge = (referenceNumber: string, descript: string) => {
    if (window.confirm("Click OK to acknowledge payment.")) {
      acknowledgePayment.mutateAsync(
        {
          referenceNumber: referenceNumber,
          description: descript,
        },
        {
          onSuccess: (data) => {
            toast.success(data);
            refetch();
          },
        }
      );
    }
  };

  const handlePayOnCash = (referenceNumber: string) => {
    if (window.confirm("Click OK to acknowledge the cash payment.")) {
      payOnCash.mutateAsync(
        {
          referenceNumber: referenceNumber,
        },
        {
          onSuccess: (data) => {
            toast.success(data);
            refetch();
          },
        }
      );
    }
  };

  if (isLoading || isLoadingTotalExpense) return <Loader />;

  if ((error || paymentArray.length === 0) && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (projId && clientProjId && projId !== clientProjId.projId && !isAdmin) {
    return <Navigate to="/" />;
  }

  const handleViewInfo = (info: IAllPayment) => {
    setPaymentInfo(info);
    viewOnOpen();
  };

  return (
    <div className="container mx-auto p-6">
      {/* Total Project Cost Display */}
      {paymentArray.length !== 0 && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Total Project Cost
          </h2>
          <p className="text-2xl font-bold text-orange-500">
            ₱ {totalToPay?.total}
          </p>
        </div>
      )}

      {/* Payment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentArray?.map((payment) => {
          const is60PercentPaid = paymentArray.some(
            (p) => p.description === "60% downpayment." && p.status === "paid"
          );
          const is30PercentPaid = paymentArray.some(
            (p) =>
              p.description === "30% progress payment." && p.status === "paid"
          );

          // Determine if the button should be disabled based on payment conditions
          const isButtonDisabled =
            (payment.description === "30% progress payment." &&
              !is60PercentPaid) ||
            (payment.description === "10% final payment." &&
              (!is60PercentPaid || !is30PercentPaid));

          return (
            <Card
              key={payment.referenceNumber}
              style={{
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #eaeaea",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
              className="hover:shadow-lg hover:scale-105"
            >
              <div className="p-4 flex-grow">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex justify-between items-center">
                  <span> {payment.description}</span>
                  <span>
                    <Button
                      isIconOnly
                      onClick={() => handleViewInfo(payment.paymentDetail)}
                      radius="full"
                      size="lg"
                      variant="light"
                    >
                      <FaInfoCircle className="text-default-400" />
                    </Button>
                  </span>
                </h2>
                <p
                  className={`mb-4 font-semibold ${
                    payment.status === "paid"
                      ? "text-primary"
                      : payment.status === "unpaid"
                      ? "text-danger"
                      : "text-gray-700"
                  }`}
                >
                  {payment.status}
                </p>{" "}
                <p className="text-lg font-semibold mb-2 text-gray-800">
                  Amount:{" "}
                  <span className="text-2xl text-orange-400">
                    ₱ {payment.amount}
                  </span>
                </p>
                <h4 className="text-sm text-gray-500 mb-2">
                  Reference No.: {payment.referenceNumber}
                </h4>
                {payment.status === "paid" && (
                  <p className="text-sm text-gray-500 mb-2">
                    Paid on: {formatDate(payment.paidAt)}
                  </p>
                )}
                {payment.status === "paid" && (
                  <p className="text-sm text-gray-500">
                    Source: {payment.sourceType}
                  </p>
                )}
                {payment.isAcknowledged && payment.status === "paid" && (
                  <p className="text-green-500 font-semibold mt-8">
                    Payment Acknowledged
                  </p>
                )}
              </div>

              <div className="p-4">
                {/* Conditional rendering based on isAdmin */}
                {isAdmin ? (
                  payment.status === "paid" && !payment.isAcknowledged ? (
                    <div className="flex flex-col gap-2">
                      <Button
                        className="bg-orange-400 w-full ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
                        onClick={() =>
                          handleAcknowledge(
                            payment.referenceNumber,
                            payment.description
                          )
                        }
                      >
                        Acknowledge Payment
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className={`bg-orange-400 w-full ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in ${
                        payment.isAcknowledged ? "hidden" : ""
                      }`}
                      onClick={() => handlePayOnCash(payment.referenceNumber)}
                      isDisabled={isButtonDisabled}
                    >
                      Paid In Cash
                    </Button>
                  )
                ) : (
                  payment.status === "unpaid" && (
                    <Button
                      className="bg-orange-400 w-full ml-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
                      onClick={() =>
                        handleRedirectToCheckout(payment.checkoutUrl)
                      }
                      isDisabled={isButtonDisabled}
                    >
                      Pay Now
                    </Button>
                  )
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <PaymentDetailsModal
        isOpen={viewIsOpen}
        onClose={viewOnClose}
        paymentDetails={paymentInfo!}
      />
    </div>
  );
};

const handleRedirectToCheckout = (checkoutUrl: string) => {
  // Use window.location to redirect to the checkout URL
  if (checkoutUrl) {
    window.open(checkoutUrl, "_blank");
  } else {
    console.error("Checkout URL is not available.");
  }
};
const handleRedirectToCheckoutAsAdmin = (checkoutUrl: string) => {
  // Use window.location to redirect to the checkout URL
  if (checkoutUrl) {
    const userConfirmed = window.confirm(
      "Are you sure you want to be redirected to the checkout page?"
    );
    if (userConfirmed) {
      window.open(checkoutUrl, "_blank");
    }
  } else {
    console.error("Checkout URL is not available.");
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default ProjectPayment;
