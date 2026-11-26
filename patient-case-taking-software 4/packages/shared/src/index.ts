export type Patient = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  phone: string;
  createdAt: string;
};

export type CaseNote = {
  id: string;
  patientId: string;
  visitDate: string;
  chiefComplaint: string;
  history: string;
  observations: string;
  assessment: string;
  plan: string;
  createdAt: string;
};
