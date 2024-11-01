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
  projDescript:
    "To provide a 1 kW OFF-GRID SYSTEM system for a residential home.",
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

export const exampleProjectsOnLists: ProjectDetails[] = [
  {
    projId: "0024d3ad-f631-4de6-a84e-a4dde77dff68",
    projName: "Mr. Roboam Dosdos",
    projDescript: "To provide a 1 kW OFF-GRID SYSTEM for a residential home.",
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
  },
  {
    projId: "f5a7b2b5-bf4f-4d8e-bd4e-58a2f830d5a2",
    projName: "Ms. Liza Santos",
    projDescript:
      "Installation of a 3 kW ON-GRID SYSTEM for a commercial building.",
    discount: 5,
    vatRate: 12,
    clientId: "b1c83b47-174c-4d67-bc68-cdfb2f7318ae",
    clientFName: "Liza",
    clientLName: "Santos",
    clientContactNum: "09181234567",
    clientAddress: "123 Main St., Cebu City",
    systemType: "ON-GRID SYSTEM",
    kWCapacity: 3,
    sex: "Female",
    isMale: false,
    status: true,
  },
  {
    projId: "a7c90c8a-6c9b-45c7-a51c-1d1b3b72e54e",
    projName: "Mr. Juan Dela Cruz",
    projDescript: "Providing a 5 kW HYBRID SYSTEM for a resort.",
    discount: 10,
    vatRate: 12,
    clientId: "f7e2c1e2-9e9b-4f67-bb8e-bc9c4b7e2af3",
    clientFName: "Juan",
    clientLName: "Dela Cruz",
    clientContactNum: "09271234567",
    clientAddress: "456 Sunshine Blvd., Cebu City",
    systemType: "HYBRID SYSTEM",
    kWCapacity: 5,
    sex: "Male",
    isMale: true,
    status: true,
  },
];
