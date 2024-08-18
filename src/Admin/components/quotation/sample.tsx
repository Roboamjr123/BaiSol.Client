import React from "react";

const data = {
  categoryCostList: [
    {
      category: "Batog",
      totalCategory: 1,
      totalExpense: 4953,
      materialCostList: [
        {
          suppId: 13,
          mtlId: 4,
          description: "Batota",
          quantity: 15,
          unit: "string",
          category: "Batog",
          unitCost: 254,
          totalUnitCost: 3810,
          buildUpCost: 4953,
          createdAt: "Aug 17, 2024",
          updatedAt: "Aug 17, 2024",
        },
      ],
    },
    {
      category: "string",
      totalCategory: 2,
      totalExpense: 1823893.5,
      materialCostList: [
        {
          suppId: 14,
          mtlId: 5,
          description: "sda",
          quantity: 2,
          unit: "string",
          category: "string",
          unitCost: 24,
          totalUnitCost: 48,
          buildUpCost: 62.4,
          createdAt: "Aug 17, 2024",
          updatedAt: "Aug 17, 2024",
        },
        {
          suppId: 11,
          mtlId: 2,
          description: "st2ring",
          quantity: 6,
          unit: "string",
          category: "string",
          unitCost: 222555,
          totalUnitCost: 1335330,
          buildUpCost: 1735929,
          createdAt: "Aug 17, 2024",
          updatedAt: "Aug 17, 2024",
        },
        {
          suppId: 12,
          mtlId: 1,
          description: "string",
          quantity: 3,
          unit: "string",
          category: "string",
          unitCost: 22555,
          totalUnitCost: 67665,
          buildUpCost: 87964.5,
          createdAt: "Aug 17, 2024",
          updatedAt: "Aug 17, 2024",
        },
      ],
    },
  ],
};

const CostTable = () => {
  return (
    <table className="border">
      <thead>
        <tr>
          <th>Category Info</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Unit Cost</th>
          <th>Total Unit Cost</th>
          <th>Build Up Cost</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {data.categoryCostList.map((category) =>
          category.materialCostList.map((material, index) => (
            <tr key={material.mtlId}>
              {index === 0 ? (
                <td
                  rowSpan={category.materialCostList.length}
                  style={{ fontWeight: "bold" }}
                >
                  {category.category} - Total Category: {category.totalCategory}{" "}
                  - Total Expense: {category.totalExpense}
                </td>
              ) : null}
              <td>{material.description}</td>
              <td>{material.quantity}</td>
              <td>{material.unit}</td>
              <td>{material.unitCost}</td>
              <td>{material.totalUnitCost}</td>
              <td>{material.buildUpCost}</td>
              <td>{material.createdAt}</td>
              <td>{material.updatedAt}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default CostTable;
