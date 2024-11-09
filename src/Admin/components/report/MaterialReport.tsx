import React, { useCallback, useMemo, useState } from "react";
import { IMaterialReport } from "../../../lib/API/Report";

const MaterialReport: React.FC<{ materialReport: IMaterialReport[] }> = ({
  materialReport,
}) => {
  const [projId, setProjId] = useState<string>("");

  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);

  const filtereReport = useMemo(() => {
    let filteredMaterials = materialReport ?? [];

    if (hasSearchFilter) {
      filteredMaterials = filteredMaterials.filter(
        (user) =>
          user.mtlCode.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.mtlDescript.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.projId.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredMaterials;
  }, [materialReport, filterValue]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = useCallback(
    (report: IMaterialReport, columnKey: React.Key) => {
      const cellValue = report[columnKey as keyof IMaterialReport];
      switch (columnKey) {
        case "description":
          break;
        case "quantity":
          break;
        case "assignedPrice":
          break;
        case "unit":
          break;
        case "category":
          break;
        case "qoh":
          break;
        case "price":
          break;
        case "timestamp":
          break;

        default:
          return cellValue;
      }
    },
    []
  );

  return <div>MaterialReport</div>;
};

export default MaterialReport;
