import { ChipProps } from "@nextui-org/react";

export const projectStatusColorMap: Record<string, ChipProps["color"]> = {
  Finished: "success",
  OnGoing: "secondary",
  OnProcess: "warning",
  OnWork: "primary",
};
