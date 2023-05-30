import { create } from "zustand";

type dimension = {
  colName: string;
  distinct: string[];
  feature: boolean;
};

type measure = {
  colName: string;
  target: boolean;
};

interface ProjectState {
  selectedDataOID: number | undefined;
  target: string | undefined;
  features: string[] | undefined;
  dimension: dimension[] | undefined;
  measure: measure[] | undefined;
  setTarget: (target: string | undefined) => void;
  setFeatures: (features: string[] | undefined) => void;
  setDataOID: (oid: number) => void;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  selectedDataOID: undefined,
  target: undefined,
  features: undefined,
  dimension: undefined,
  measure: undefined,
  setTarget: (target: string | undefined) => set({ target: target }),
  setFeatures: (features: string[] | undefined) => set({ features: features }),
  setDataOID: (oid: number) => set({ selectedDataOID: oid }),
}));
