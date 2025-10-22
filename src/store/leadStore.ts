import { create } from "zustand";
import { Lead } from "@/types/lead.interface";

interface LeadStore {
  selectedLeadForQuote: Lead | null;
  setSelectedLeadForQuote: (lead: Lead | null) => void;
  clearSelectedLeadForQuote: () => void;
}

export const useLeadStore = create<LeadStore>((set) => ({
  selectedLeadForQuote: null,
  setSelectedLeadForQuote: (lead) => set({ selectedLeadForQuote: lead }),
  clearSelectedLeadForQuote: () => set({ selectedLeadForQuote: null }),
}));
