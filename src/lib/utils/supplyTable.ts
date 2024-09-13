import { ChipProps } from "@nextui-org/react";

export const supply_columns = [
  { name: "DESCRIPTION", uid: "description" },
  { name: "PRICE", uid: "price" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "UNIT", uid: "unit" },
  { name: "TIMESTAMPS", uid: "timestamps" },
  { name: "ACTIONS", uid: "actions" },
];

// export const equipment_columns = [
//   { name: "DESCRIPTION", uid: "description" },
//   { name: "QUANTITY", uid: "quantity" },
//   { name: "UNIT", uid: "unit" },
//   { name: "STATUS", uid: "status" },
//   { name: "TIMESTAMPS", uid: "timestamps" },
//   { name: "ACTIONS", uid: "actions" },
// ];

export const equipmentStatusOptions = [
  { name: "Good", uid: "Good" },
  { name: "Damaged", uid: "Damaged" },
];

export const equipmentStatusColorMap: Record<string, ChipProps["color"]> = {
  Good: "success",
  Damaged: "danger",
};
