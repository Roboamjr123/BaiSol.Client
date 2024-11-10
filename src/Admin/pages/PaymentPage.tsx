import React from "react";
import PaymentTable from "../components/tables/PaymentTable";

const PaymentPage = () => {
  return (
    <div>
      <h1 className="flex items-center mb-4 text-lg md:text-xl">Billing</h1>
      <PaymentTable />
    </div>
  );
};

export default PaymentPage;
