import React, { useCallback, useMemo, useState } from "react";
import { IMaterialReport } from "../../../lib/API/Report";
import {
  Button,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { inventory_report_columns } from "../../../lib/utils/reportInventoryTable";
import { CiSearch } from "react-icons/ci";
import { BiDotsVertical } from "react-icons/bi";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const MaterialReport: React.FC<{ materialReport: IMaterialReport[] }> = ({
  materialReport,
}) => {
  const [projId, setProjId] = useState<string>("");

  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);

  const filteredReport = useMemo(() => {
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

  const handleOpenMoreInfo = (id: string) => {
    setProjId(id);
  };

  const renderCell = useCallback(
    (report: IMaterialReport, columnKey: React.Key) => {
      const cellValue = report[columnKey as keyof IMaterialReport];
      switch (columnKey) {
        case "description":
          return <div>{report.mtlDescript}</div>;
        case "quantity":
          return <div>{report.mtlQuantity}</div>;
        case "assignedPrice":
          return <div>₱ {report.assignedPrice}</div>;
        case "unit":
          return <div>{report.mtlUnit}</div>;
        case "category":
          return <div>{report.mtlCategory}</div>;
        case "qoh":
          return <div>{report.mtlqoh}</div>;
        case "price":
          return <div>₱ {report.currentPrice}</div>;
        case "timestamp":
          return (
            <div className="flex flex-col ">
              <span className="font-semibold tracking-widest">
                Created:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {report.createdAt}
                </span>
              </span>
              <span className="font-semibold tracking-widest">
                Updated:{" "}
                <span className="text-xs text-gray-400 tracking-tight">
                  {report.updatedAt}
                </span>
              </span>
            </div>
          );
        case "action":
          return (
            <Link to={`/project/${report.projId}`}>
              <FaInfoCircle className="text-default-400" />
            </Link>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search..."
            size="sm"
            startContent={<CiSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-start">
          <span className="text-default-400 text-small">
            Total {filteredReport.length}
          </span>
        </div>
      </div>
    );
  }, [onSearchChange, filteredReport, filterValue]);

  const classNamesDesign = useMemo(
    () => ({
      base: "max-h-[500px] overflow-y-scroll scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100",
      table: "min-h-[120px]",
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      //   th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );
  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white h-full">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-orange-100">
          <div className=" min-w-full">
            <Table
              aria-label="Materials Table"
              isHeaderSticky
              removeWrapper
              classNames={classNamesDesign}
              selectionMode="single"
              topContent={topContent}
              topContentPlacement="outside"
            >
              <TableHeader columns={inventory_report_columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent={"No material found"}
                items={filteredReport}
                loadingContent={<Spinner color="warning">Loading...</Spinner>}
              >
                {(item) => (
                  <TableRow key={item.suppId}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialReport;
