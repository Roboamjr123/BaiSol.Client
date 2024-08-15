import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

const SampleTable: React.FC = () => {
  const columns = [
    { name: "ID", uid: "id" },
    { name: "Email", uid: "email" },
    { name: "Username", uid: "username" },
    { name: "Role", uid: "role" },
    { name: "Status", uid: "status" },
  ];

  const rows = [
    {
      id: 1,
      email: "user1@example.com",
      username: "user1",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      email: "user2@example.com",
      username: "user2",
      role: "User",
      status: "Inactive",
    },
    {
      id: 3,
      email: "user3@example.com",
      username: "user3",
      role: "User",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Responsive Table with NextUI and Tailwind CSS
        </h1>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <Table
              aria-label="Example table with dynamic content"
              className="min-w-max"
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
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

export default SampleTable;
