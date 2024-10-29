export interface ProjectDetails {
  projId: string;
  projName: string;
  projDescript: string;
  discount: number;
  vatRate: number;
  clientId: string;
  clientFName: string;
  clientLName: string;
  clientContactNum: string;
  clientAddress: string;
  systemType: string;
  kWCapacity: number;
  sex: "Male" | "Female";
  isMale: boolean;
  status: boolean;
}

// Example usage:
export const exampleProject: ProjectDetails = {
  projId: "0024d3ad-f631-4de6-a84e-a4dde77dff68",
  projName: "Mr. Roboam Dosdos",
  projDescript: "To provide a 1 kW OFF-GRID SYSTEM system for a residential home.",
  discount: 0,
  vatRate: 0,
  clientId: "d2eac0aa-3811-4d4c-aa9e-f85d78ff1f54",
  clientFName: "Roboam",
  clientLName: "Dosdos",
  clientContactNum: "092221231",
  clientAddress: "A.s. fortuna st., banilad 6014 cebu city",
  systemType: "OFF-GRID SYSTEM",
  kWCapacity: 1,
  sex: "Male",
  isMale: true,
  status: false,
};