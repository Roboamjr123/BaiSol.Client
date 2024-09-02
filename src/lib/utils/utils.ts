import React from "react";
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatNumber = (number: number) => {
  // Create an instance of Intl.NumberFormat for the desired format
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });

  return formatter.format(number);
};


