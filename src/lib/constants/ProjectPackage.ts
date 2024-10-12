// Define the structure for the system type options
export interface Option {
  kWCapacity: string;
  cost: number;
  value: number;
}

export interface SystemType {
  type: string;
  options: Option[];
}

export const ProjectDescriptionSystemType: SystemType[] = [
  {
    type: "OFF-GRID SYSTEM",
    options: [
      { kWCapacity: "1 kW", cost: 120000.0, value: 1 }, // Numeric value added
      { kWCapacity: "3 kW", cost: 210000.0, value: 3 }, // Numeric value added
      { kWCapacity: "5 kW", cost: 350000.0, value: 5 }, // Numeric value added
    ],
  },
  {
    type: "GRID-TIE SYSTEM",
    options: [
      { kWCapacity: "3 kW", cost: 180000.0, value: 3 }, // Numeric value added
      { kWCapacity: "5 kW", cost: 250000.0, value: 5 }, // Numeric value added
      { kWCapacity: "8 kW", cost: 450000.0, value: 8 }, // Numeric value added
      { kWCapacity: "10 kW", cost: 550000.0, value: 10 }, // Numeric value added
      { kWCapacity: "15 kW", cost: 680000.0, value: 15 }, // Numeric value added
      { kWCapacity: "20 kW", cost: 800000.0, value: 20 }, // Numeric value added
    ],
  },
  {
    type: "HYBRID SYSTEM",
    options: [
      { kWCapacity: "3 kW", cost: 350000.0, value: 3 }, // Numeric value added
      { kWCapacity: "5 kW", cost: 480000.0, value: 5 }, // Numeric value added
      { kWCapacity: "8 kW", cost: 650000.0, value: 8 }, // Numeric value added
      { kWCapacity: "10 kW", cost: 850000.0, value: 10 }, // Numeric value added
      { kWCapacity: "12 kW", cost: 1050000.0, value: 12 }, // Numeric value added
      { kWCapacity: "15 kW", cost: 1200000.0, value: 15 }, // Numeric value added
    ],
  },
];
