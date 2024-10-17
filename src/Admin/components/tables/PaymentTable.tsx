import React, { useCallback, useMemo, useState } from "react";
import {
  getAllPayment,
  IAllPayment,
} from "../../../lib/API/Project/PaymentAPI";

const PaymentTable = () => {
  const { data: payments, isLoading, refetch } = getAllPayment();

  const [paymentInfo, setPaymentInfo] = useState<IAllPayment>();

  const [filterValue, setFilterValue] = useState("");
  const filteredItems = useMemo(() => {
    let filteredMaterials = payments ?? [];

    filteredMaterials = filteredMaterials.filter(
      (payment) =>
        payment.referenceNumber
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        payment.acknowledgedBy
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        payment.projName.toLowerCase().includes(filterValue.toLowerCase()) ||
        payment.billingEmail
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        payment.billingName.toLowerCase().includes(filterValue.toLowerCase()) ||
        payment.billingPhone
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        payment.projId.toLowerCase().includes(filterValue.toLowerCase())
    );

    return filteredMaterials;
  }, [payments, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = useCallback(
    (payment: IAllPayment, columnKey: React.Key) => {
      const cellValue = payment[columnKey as keyof IAllPayment];
    },
    []
  );

  return <div>PaymentTable</div>;
};

export default PaymentTable;
