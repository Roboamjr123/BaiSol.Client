import { ChipProps } from "@nextui-org/react";

export const payment_columns = [
  { name: "REFERENCE", uid: "reference" },
  { name: "AMOUNT", uid: "amount" },
  { name: "CREATED DATE", uid: "created date" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "PROJECT", uid: "projName" },
  { name: "ACTION", uid: "action" },
];

export const paymentStatusOptions = [
    { name: "Paid", uid: "paid" },
    { name: "UnPaid", uid: "unpaid" },
  ];
  
  export const paymentStatusColorMap: Record<string, ChipProps["color"]> = {
    paid: "success",
    unpaid: "warning",
  };