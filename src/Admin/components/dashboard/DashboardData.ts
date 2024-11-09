// src/DashboardData.ts

export default class DashboardData {
  quotation: number;
  personnel: number;
  completedProjects: number;
  onWorkProjects: number;

  constructor(
    quotation = 12,
    personnel = 1245,
    completedProjects = 532,
    onWorkProjects = 34
  ) {
    this.quotation = quotation;
    this.personnel = personnel;
    this.completedProjects = completedProjects;
    this.onWorkProjects = onWorkProjects;
  }

  // Optional: Add methods to dynamically update data if needed
}
